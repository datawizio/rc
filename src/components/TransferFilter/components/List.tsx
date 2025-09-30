import i18n from "i18next";
import clsx from "clsx";
import Checkbox from "@/components/Checkbox";
import Select from "@/components/Select";
import SearchInput from "@/components/LiteSearchInput";
import ListBody from "./ListBody";

import { createRef, isValidElement, PureComponent } from "react";
import { isLocalDataSource, searchByArticle } from "../helper";

import type { ChangeEvent, ReactElement, ReactNode } from "react";
import type { DataNode } from "antd/lib/tree";
import type { SelectValue } from "antd/lib/tree-select";
import type { EventDataNode } from "rc-tree/es/interface";
import type { PaginationType } from "antd/es/transfer/interface";
import type { Observable, Subscription } from "@/types/store";
import type { PartialBy } from "@/types/utils";
import type {
  ICheckedItem,
  RenderResult,
  RenderResultObject,
  TransferDirection,
  TransferFilterItem,
  TransferFilterLoadDataParams,
  TransferFilterLoadDataResponse,
  TransferFilterValue
} from "../types";

const defaultRender = () => null;

function isRenderResultPlainObject(result: RenderResult) {
  return (
    result &&
    !isValidElement(result) &&
    Object.prototype.toString.call(result) === "[object Object]"
  );
}

export interface RenderedItem {
  renderedText: string;
  renderedEl: ReactNode;
  item: TransferFilterItem;
}

export interface TransferListProps {
  checkedKeys: string[];
  dataSource: TransferFilterItem[];
  direction: TransferDirection;
  noDataText: string;
  prefixCls: string;
  selectedText: string;
  searchText: string;
  titleText: string;
  type: "tree" | "list";
  value: TransferFilterValue;
  actions?: ReactElement;
  disabled?: boolean;
  local?: boolean;
  pagination?: PaginationType;
  showSearch?: boolean;
  showSelectAll?: boolean;
  $filters?: Observable;
  render?: (item: TransferFilterItem) => RenderResult;
  filterOption?: (filterText: string, item: TransferFilterItem) => boolean;
  loadData?: (
    params: TransferFilterLoadDataParams
  ) => Promise<TransferFilterLoadDataResponse>;
  loadDataByIds?: (params: any) => Promise<any>;
  onItemSelect: (item: ICheckedItem, check: boolean) => void;
  onItemsSelect?: (items: ICheckedItem[], check: boolean) => void;
  disableRoots?: boolean;
}

interface TransferListState {
  /** Filter input value */
  filters: { [key: string]: any };
  filterValue: string;
  page: number;
  count: number;
  totalPages: number;
  dataSource: TransferFilterItem[];
  loading: boolean;
  expandedKeys: string[];
  levels: number[] | null;
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

  bodyRef: any;
  triggerScrollTimer: number | undefined = undefined;
  unwatchFilters: Subscription | null = null;

  constructor(props: TransferListProps) {
    super(props);

    this.state = {
      filters: {},
      filterValue: "",
      page: 1,
      totalPages: 1,
      count: 0,
      dataSource: [],
      loading: false,
      expandedKeys: [],
      levels: []
    };

    this.bodyRef = createRef();
  }

  componentDidUpdate(prevProps: TransferListProps) {
    if (prevProps.value.include !== this.props.value.include) {
      if (this.props.direction === "right") {
        if (this.props.value.include === null) {
          this.setState({ dataSource: [] });
          return;
        }
        if (
          this.props.value.include.length === 0 &&
          (prevProps.value.include === null ||
            prevProps.value.include.length > 0)
        ) {
          void this.loadPage();
        }
      }
    }

    if (this.props.direction === "right") {
      if (
        this.props.value.include !== null &&
        this.props.value.include.length === 0 &&
        this.props.value.exclude !== prevProps.value.exclude
      ) {
        void this.loadPage();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.triggerScrollTimer);
    if (this.props.$filters) {
      this.unwatchFilters?.();
    }
  }

  componentDidMount() {
    if (this.props.direction === "left") {
      void this.loadPage();
      return;
    }

    if (Array.isArray(this.props.value.include)) {
      if (this.props.value.include.length === 0) {
        void this.loadPage();
        return;
      }
      void this.loadDataByIds();
    }

    if (this.props.$filters) {
      this.unwatchFilters = this.props.$filters.watch(filters => {
        this.handleFiltersChange(filters);
      });
    }
  }

  addItems = (items: TransferFilterItem[]) => {
    const { direction, local } = this.props;
    const { dataSource, page, ...rest } = this.state;

    if (
      !isLocalDataSource(this.props.value.include, direction, local) &&
      this.props.value.include !== null
    ) {
      return;
    }

    const data = dataSource.concat(items);

    this.setState({
      ...rest,
      dataSource: data,
      page: page ? page : 1,
      count: data.length,
      totalPages: Math.ceil(data.length / 100)
    });
  };

  removeItems = (items: string[]) => {
    const { direction, local } = this.props;
    const { dataSource, page, ...rest } = this.state;

    if (
      !isLocalDataSource(this.props.value.include, direction, local) &&
      this.props.value.include !== null
    ) {
      return;
    }
    const set = new Set(items);
    const data = dataSource.filter(item => !set.has(item.key));
    const totalPages = Math.ceil(data.length / 100);
    const newPage = totalPages < page ? totalPages : page;
    this.bodyRef.current.onPageChange(newPage);

    this.setState({
      ...rest,
      dataSource: data,
      page: newPage ? newPage : 1,
      count: data.length,
      totalPages: Math.ceil(data.length / 100)
    });
  };

  isAllDisabled(filteredItems: TransferFilterItem[]) {
    if (!filteredItems.length) return true;
    const disabledKeys = this.getDisabledKeys(filteredItems);
    const { include, exclude } = this.props.value;

    if (this.props.direction === "left") {
      if (include === null || disabledKeys.size === filteredItems.length)
        return true;
      if (exclude.length >= 100 && filteredItems.length) {
        return filteredItems.every(item => exclude.includes(item.key));
      }
    }
  }

  getDisabledKeys = (filteredItems: TransferFilterItem[]) => {
    const { include, exclude } = this.props.value;
    const { direction, disableRoots } = this.props;

    const shouldDisable = (item: TransferFilterItem) => {
      if (direction === "left") {
        if (exclude?.length) {
          return (
            exclude.includes(item.key) || (disableRoots && item.pId === null)
          );
        }

        if (include?.length) {
          return (
            !include.includes(item.key) || (disableRoots && item.pId === null)
          );
        }
      }

      return disableRoots && item.pId === null;
    };

    const disabledKeys = filteredItems
      .filter(shouldDisable)
      .map(item => item.key);

    return new Set(disabledKeys);
  };

  getCheckStatus(filteredItems: TransferFilterItem[]) {
    let items = filteredItems;
    const disableAll = this.isAllDisabled(filteredItems);
    const disabledKeys = this.getDisabledKeys(filteredItems);
    const { checkedKeys } = this.props;
    const checkedSet = new Set(checkedKeys);
    if (checkedKeys.length === 0 || disableAll) {
      return "none";
    }

    if (this.props.direction === "right" && filteredItems.length > 100) {
      const page = this.state.page ? this.state.page - 1 : 0;
      items = items.slice(page * 100, (page + 1) * 100);
    }

    if (
      items.every(
        item => checkedSet.has(item.key) || disabledKeys.has(item.key)
      )
    ) {
      return "all";
    }
    return "part";
  }

  getCheckBox(
    filteredItems: TransferFilterItem[],
    onItemSelectAll: (dataSource: ICheckedItem[], check: boolean) => void,
    showSelectAll?: boolean,
    _disabled?: boolean // eslint-disable-line
  ): false | ReactElement {
    const checkStatus = this.getCheckStatus(filteredItems);
    const checkedAll = checkStatus === "all";
    const disableAll = this.isAllDisabled(filteredItems);
    const disabledKeys = this.getDisabledKeys(filteredItems);

    return (
      showSelectAll !== false && (
        <Checkbox
          disabled={disableAll}
          checked={checkedAll}
          indeterminate={checkStatus === "part"}
          onChange={() => {
            let items: ICheckedItem[] = checkedAll
              ? []
              : filteredItems
                  .filter(item => !disabledKeys.has(item.key))
                  .map(({ key, title, article }) => ({
                    key,
                    title: title!,
                    ...(article ? { article } : {})
                  }));

            // Only select enabled items
            if (this.props.direction === "right") {
              if (filteredItems.length > 100) {
                const page = this.state.page ? this.state.page - 1 : 0;
                items = items.slice(page * 100, (page + 1) * 100);
              }
              onItemSelectAll(items, !checkedAll);
              return;
            }
            onItemSelectAll(items, !checkedAll);
          }}
        />
      )
    );
  }

  handleFiltersChange(filters: any) {
    this.setState(
      {
        filters,
        page: 0,
        dataSource: []
      },
      () => {
        void this.loadPage();
      }
    );
  }

  loadDataByIds = async () => {
    if (!this.props.loadDataByIds) return;

    this.setState({
      loading: true,
      dataSource: []
    });

    const { data } = await this.props.loadDataByIds({
      ids: this.props.value.include
    });

    const state: any = {
      count: data.length,
      totalPages: Math.ceil(data.length / 100),
      dataSource: data,
      loading: false
    };

    this.setState(state);
  };

  loadTreeData = async (treeNode: EventDataNode<DataNode>) => {
    const { loadData, value, type } = this.props;

    if (!loadData || (treeNode.children && treeNode.children.length > 0))
      return;

    const { data } = await loadData({
      type,
      expanded: treeNode.key as string,
      ...value
    });

    const { dataSource } = this.state;

    const state: any = {
      dataSource: dataSource.concat(data)
    };

    this.setState(state);
  };

  async loadPage(paginationPage = 1) {
    const { loadData, value, type, direction } = this.props;

    if (!loadData) return;

    const { totalPages, filterValue, filters } = this.state;
    const page = paginationPage ?? 1;

    if (direction === "right" && value.include === null) return;

    if (page !== 1 && page > totalPages) return;

    this.setState({
      loading: true,
      dataSource: []
    });

    const filtersReq = {
      page,
      type,
      search: filterValue,
      ...value,
      ...filters,
      full: direction === "right"
    };

    const {
      data,
      totalPages: pages,
      count,
      expanded,
      levels
    } = await loadData(filtersReq);

    const state: any = {
      page,
      count,
      levels,
      totalPages: pages,
      dataSource: data,
      loading: false
    };

    const expandedKeys = this.getExpandedKeys(
      expanded ?? [],
      this.getFilteredItems(data)
    );

    if (expandedKeys) state.expandedKeys = expandedKeys;

    this.setState(state);
  }

  getExpandedKeys(expanded: string[], filteredItems?: TransferFilterItem[]) {
    if (!this.props.disableRoots) {
      return expanded;
    }

    return filteredItems
      ?.filter(item => item.pId === null)
      .map(item => item.key);
  }

  getListBody(
    prefixCls: string,
    filterValue: string,
    filteredItems: TransferFilterItem[],
    expandedKeys: string[],
    checkedKeys: string[],
    loading?: boolean,
    showSearch?: boolean,
    disabled?: boolean,
    type?: "tree" | "list"
  ): ReactNode {
    const { include, exclude } = this.props.value;
    const isLeftDirection = this.props.direction === "left";

    const levels =
      this.state.levels?.length && isLeftDirection ? (
        <div className={`${prefixCls}-body-levels-wrapper`}>
          <Select
            value={this.state.filters.level || 1}
            options={this.generateLevelOptions(this.state.levels)}
            onChange={this.handleLevelChange.bind(this)}
            className="drawer-tree-select-levels"
          />
        </div>
      ) : null;

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

    const rootsToDisable = this.props.disableRoots
      ? filteredItems.filter(item => item.pId === null).map(item => item.key)
      : [];

    const partialProps: PartialBy<TransferListProps, "checkedKeys" | "type"> = {
      ...this.props
    };

    delete partialProps.checkedKeys;
    delete partialProps.type;

    const bodyContent = (
      <ListBody
        ref={this.bodyRef}
        {...partialProps}
        expandedKeys={expandedKeys} // Expand tree roots if they are all disabled
        filteredItems={filteredItems}
        loading={loading}
        type={type}
        disableAll={isLeftDirection && (include === null || include.length > 0)}
        disabledKeys={(isLeftDirection ? exclude : []).concat(rootsToDisable)}
        enabledKeys={isLeftDirection && include !== null ? include : []}
        checkedKeys={checkedKeys}
        totalItemsCount={this.getTotalCount(filteredItems)}
        loadTreeData={this.loadTreeData}
        onPageChange={this.handlePageChange}
      />
    );

    // BODY NODE
    const bodyNode =
      filteredItems.length || loading ? (
        bodyContent
      ) : (
        <div className={`${prefixCls}-body-not-found`}>
          {this.props.noDataText}
        </div>
      );

    // CLASSES
    const className = clsx(
      `${prefixCls}-body`,
      showSearch && `${prefixCls}-body-with-search`,
      this.props.pagination &&
        type !== "tree" &&
        `${prefixCls}-body-with-pagination`
    );

    // RETURN
    return (
      <div className={className}>
        {levels}
        {search}
        {bodyNode}
      </div>
    );
  }

  generateLevelOptions(levels: number[] = []) {
    return levels.map(level => ({
      value: level,
      label: i18n.t("LEVEL_N", { level })
    }));
  }

  handleLevelChange(value: SelectValue = 1) {
    this.setState(
      (prevState: TransferListState) => {
        return {
          ...prevState,
          filterValue: "",
          filters: {
            ...prevState.filters,
            level: value
          }
        };
      },
      () => {
        void this.loadPage(1);
      }
    );
  }

  getFilteredItems(dataSource: TransferFilterItem[]): TransferFilterItem[] {
    const { direction, value, local } = this.props;

    if (isLocalDataSource(value.include, direction, local)) {
      return dataSource.filter(item => this.matchFilter(item));
    }

    return dataSource;
  }

  handleFilter = ({
    target: { value: filterValue }
  }: ChangeEvent<HTMLInputElement>) => {
    const { direction, value, local } = this.props;

    if (this.bodyRef.current) {
      this.bodyRef.current.resetPage();
    }

    if (isLocalDataSource(value.include, direction, local)) {
      this.setState({ filterValue, page: 1 });
      return;
    }
    this.setState({ filterValue, dataSource: [], page: 0 }, () => {
      void this.loadPage();
    });
  };

  handleClear = () => {
    const { direction, value, local } = this.props;
    if (isLocalDataSource(value.include, direction, local)) {
      this.setState({ filterValue: "", page: 1 });
      return;
    }
    this.setState({ filterValue: "", dataSource: [], page: 0 }, () => {
      void this.loadPage();
    });
  };

  handlePageChange = (page: number) => {
    const { direction, value, local } = this.props;

    if (isLocalDataSource(value.include, direction, local)) {
      this.setState({ page });
      return;
    }

    void this.loadPage(page);
  };

  matchFilter = (item: TransferFilterItem) => {
    const { filterValue } = this.state;

    return (
      (item.title &&
        item.title.toLowerCase().indexOf(filterValue.trim().toLowerCase()) >=
          0) ||
      searchByArticle(filterValue, item)
    );
  };

  getTotalCount(filteredItems: any[]) {
    const { value, direction, local } = this.props;
    const { count } = this.state;

    if (isLocalDataSource(value.include, direction, local))
      return filteredItems.length;

    if (direction === "left") return count;

    if (value.include === null) return 0;
    if (value.include.length === 0) return count;

    return value.include.length;
  }

  renderItem = (item: TransferFilterItem): RenderedItem => {
    const { render = defaultRender } = this.props;
    const renderResult: RenderResult = render(item);
    const isRenderResultPlain = isRenderResultPlainObject(renderResult);

    return {
      renderedText: isRenderResultPlain
        ? (renderResult as RenderResultObject).value
        : (renderResult as string),
      renderedEl: isRenderResultPlain
        ? (renderResult as RenderResultObject).label
        : (renderResult as ReactElement),
      item
    };
  };

  render() {
    const { filterValue, dataSource, expandedKeys, loading } = this.state;
    const {
      prefixCls,
      titleText,
      selectedText,
      checkedKeys,
      disabled,
      showSearch,
      actions,
      showSelectAll,
      type,
      onItemsSelect
    } = this.props;

    // Get filtered, checked item list

    const filteredItems = this.getFilteredItems(dataSource);
    const totalCount =
      type === "list" ? this.getTotalCount(filteredItems) : null;

    // List Body

    const listBody = this.getListBody(
      prefixCls,
      filterValue,
      filteredItems,
      expandedKeys,
      checkedKeys,
      loading,
      showSearch,
      disabled,
      type
    );

    // List Footer

    const checkAllCheckbox = this.getCheckBox(
      filteredItems,
      onItemsSelect!,
      showSelectAll,
      disabled
    );

    // Render

    return (
      <div className={`${prefixCls}-container`}>
        {/* Title */}
        <div className={`${prefixCls}-title`}>
          <span className={`${prefixCls}-title-text`}>{titleText}</span>
          <div>{actions}</div>
        </div>
        <div className={prefixCls}>
          {/* Header */}
          <div className={`${prefixCls}-header`}>
            {checkAllCheckbox}
            <span className={`${prefixCls}-header-selected`}>
              {selectedText}: {checkedKeys.length}
              {totalCount !== null && ` / ${totalCount}`}
            </span>
          </div>

          {/* Body */}
          {listBody}
        </div>
      </div>
    );
  }
}
