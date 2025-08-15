import clsx from "clsx";
import Checkbox from "@/components/Checkbox";
import ListBody from "./ListBody";
import SearchInput from "@/components/LiteSearchInput";
import { isValidElement, PureComponent } from "react";

import type { ReactNode, ReactElement, UIEvent, ChangeEvent } from "react";
import type { Observable, Subscription } from "@/types/store";
import type { PartialBy } from "@/types/utils";
import type {
  TransferItem,
  TransferDirection,
  RenderResult,
  RenderResultObject,
  LoadDataResponse,
  LoadDataParams
} from "../types";

const defaultRender = () => null;

const isRenderResultPlainObject = (result: RenderResult) => {
  return (
    result &&
    !isValidElement(result) &&
    Object.prototype.toString.call(result) === "[object Object]"
  );
};

export interface RenderedItem {
  renderedText: string;
  renderedEl: ReactNode;
  item: TransferItem;
}

export interface TransferListProps {
  prefixCls: string;
  titleText: string;
  dataSource: TransferItem[];
  filterOption?: (filterText: string, item: TransferItem) => boolean;
  checkedKeys: string[];
  onItemSelect: (key: string, check: boolean) => void;
  onItemSelectAll: (dataSource: string[]) => void;
  render?: (item: TransferItem) => RenderResult;
  showSearch?: boolean;
  onScroll: (e: UIEvent<HTMLUListElement>) => void;
  disabled?: boolean;
  direction: TransferDirection;
  showSelectAll?: boolean;
  actions?: ReactElement;
  loadData?: (params: LoadDataParams) => Promise<LoadDataResponse>;
  $filters?: Observable;
  selectedText: string;
  searchText: string;
  noDataText: string;
}

interface TransferListState {
  filters: { [key: string]: any };
  filterValue: string;
  page: number;
  count: number;
  totalPages: number;
  dataSource: TransferItem[];
  loading: boolean;
}

export default class TransferList extends PureComponent<
  TransferListProps,
  TransferListState
> {
  static defaultProps = {
    dataSource: [],
    titleText: "",
    showSearch: false
  };

  triggerScrollTimer: number | undefined = undefined;
  unwatchFilters: Subscription | null = null;
  exceptedKeys: string[] = [];

  constructor(props: TransferListProps) {
    super(props);
    this.state = {
      filters: {},
      filterValue: "",
      page: 0,
      totalPages: 1,
      count: 0,
      dataSource: [],
      loading: false
    };
  }

  setExceptedKeys(keys: string[]) {
    this.exceptedKeys = keys;
  }

  addExceptedKeys(keys: string[]) {
    this.exceptedKeys = this.exceptedKeys.concat(keys);
  }

  componentWillUnmount() {
    clearTimeout(this.triggerScrollTimer);
    if (this.props.$filters) {
      this.unwatchFilters?.();
    }
  }

  componentDidMount() {
    void this.loadNextPage();
    if (this.props.$filters) {
      this.unwatchFilters = this.props.$filters.watch(filters => {
        this.handleFiltersChange(filters);
      });
    }
  }

  handleFiltersChange(filters: any) {
    this.setState(
      {
        filters,
        page: 0,
        dataSource: []
      },
      () => {
        void this.loadNextPage();
      }
    );
  }

  getCheckStatus(filteredItems: TransferItem[]) {
    const { checkedKeys } = this.props;
    if (checkedKeys.length === 0) {
      return "none";
    }

    if (
      filteredItems.every(
        item => checkedKeys.indexOf(item.key) >= 0 || !!item.disabled
      )
    ) {
      return "all";
    }

    return "part";
  }

  onScroll = (e: UIEvent<HTMLUListElement>) => {
    const target = e.target as HTMLUListElement;

    if (this.state.loading) return;
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 100) {
      void this.loadNextPage();
    }
  };

  async loadNextPage() {
    const { totalPages, filterValue, dataSource, filters, ...rest } =
      this.state;

    const { loadData } = this.props;
    if (!loadData) return;

    this.setExceptedKeys([]);

    if (rest.page !== 0 && rest.page >= totalPages) {
      return;
    }
    rest.page++;
    this.setState({
      loading: true
    });

    const filtersReq = {
      page: rest.page,
      search: filterValue,
      ...filters
    };

    const { data, totalPages: pages, count } = await loadData(filtersReq);

    this.setState({
      page: rest.page,
      count,
      totalPages: pages,
      dataSource: dataSource.concat(data),
      loading: false
    });
  }

  getListBody(
    prefixCls: string,
    filterValue: string,
    filteredItems: TransferItem[],
    checkedKeys: string[],
    loading?: boolean,
    showSearch?: boolean,
    disabled?: boolean
  ): ReactNode {
    const search = showSearch ? (
      <div className={`${prefixCls}-body-search-wrapper`}>
        <SearchInput
          placeholder={this.props.searchText}
          onChange={this.handleFilter}
          onClear={this.handleClear}
          value={filterValue}
          disabled={disabled}
        />
      </div>
    ) : null;

    const partialProps: PartialBy<TransferListProps, "checkedKeys"> = {
      ...this.props
    };

    delete partialProps.checkedKeys;

    const bodyContent = (
      <ListBody
        {...partialProps}
        loading={loading}
        filteredItems={filteredItems}
        onScroll={e => this.onScroll.bind(this, e)}
        selectedKeys={checkedKeys}
      />
    );

    const bodyNode: ReactNode =
      filteredItems.length || loading ? (
        bodyContent
      ) : (
        <div className={`${prefixCls}-body-not-found`}>
          {this.props.noDataText}
        </div>
      );

    return (
      <div
        className={clsx(
          showSearch
            ? `${prefixCls}-body ${prefixCls}-body-with-search`
            : `${prefixCls}-body`
        )}
      >
        {search}
        {bodyNode}
      </div>
    );
  }

  getFilteredItems(dataSource: TransferItem[]): TransferItem[] {
    if (this.exceptedKeys[0] && this.exceptedKeys[0] === "all") return [];
    const set = new Set([...this.exceptedKeys]);

    return dataSource.filter(item => !set.has(item.key));
  }

  getCheckBox(
    filteredItems: TransferItem[],
    onItemSelectAll: (dataSource: string[]) => void,
    showSelectAll?: boolean,
    disabled?: boolean
  ): ReactNode {
    const checkStatus = this.getCheckStatus(filteredItems);
    const checkedAll = checkStatus === "all";

    return (
      showSelectAll !== false && (
        <Checkbox
          disabled={disabled}
          checked={checkedAll}
          indeterminate={checkStatus === "part"}
          onChange={() => {
            const items = checkedAll
              ? []
              : filteredItems
                  .filter(item => !item.disabled)
                  .map(({ key }) => key);
            // Only select enabled items
            onItemSelectAll(items);
          }}
        />
      )
    );
  }

  handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value: filterValue }
    } = e;
    this.setState({ filterValue, dataSource: [], page: 0 }, () => {
      void this.loadNextPage();
    });
  };

  handleClear = () => {
    this.setState({ filterValue: "", dataSource: [], page: 0 }, () => {
      void this.loadNextPage();
    });
  };

  matchFilter = (item: TransferItem) => {
    const { filterValue } = this.state;
    return item.title && item.title.indexOf(filterValue) >= 0;
  };

  renderItem = (item: TransferItem): RenderedItem => {
    const { render = defaultRender } = this.props;
    const renderResult: RenderResult = render(item);
    const isRenderResultPlain = isRenderResultPlainObject(renderResult);

    return {
      item,
      renderedText: isRenderResultPlain
        ? (renderResult as RenderResultObject).value
        : (renderResult as string),
      renderedEl: isRenderResultPlain
        ? (renderResult as RenderResultObject).label
        : (renderResult as string)
    };
  };

  render() {
    const { filterValue, dataSource, loading, count } = this.state;
    const {
      prefixCls,
      titleText,
      selectedText,
      checkedKeys,
      disabled,
      showSearch,
      onItemSelectAll,
      showSelectAll,
      actions
    } = this.props;

    const totalCount =
      this.exceptedKeys[0] && this.exceptedKeys[0] === "all"
        ? 0
        : count - this.exceptedKeys.length;

    const filteredItems = this.getFilteredItems(dataSource);

    const listBody = this.getListBody(
      prefixCls,
      filterValue,
      filteredItems,
      checkedKeys,
      loading,
      showSearch,
      disabled
    );

    const checkAllCheckbox = this.getCheckBox(
      filteredItems,
      onItemSelectAll,
      showSelectAll,
      disabled
    );

    return (
      <div className={`${prefixCls}-container`}>
        <div className={`${prefixCls}-title`}>
          <span className={`${prefixCls}-title-text`}>{titleText}</span>
          <div>{actions}</div>
        </div>

        <div className={prefixCls}>
          <div className={`${prefixCls}-header`}>
            {checkAllCheckbox}
            <span className={`${prefixCls}-header-selected`}>
              {selectedText}: {checkedKeys.length} / {totalCount}
            </span>
          </div>
          {listBody}
        </div>
      </div>
    );
  }
}
