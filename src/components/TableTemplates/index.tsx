import clsx from "clsx";
import Dropdown from "./components/Dropdown";
import Template from "./components/Template";

import { Select } from "antd";
import { useState, useCallback, useEffect, useMemo } from "react";
import { TagsOutlined } from "@ant-design/icons";
import { useDeepEqualMemo, useConfig } from "@/hooks";
import { useTable } from "@/components/Table/hooks/useTable";

import type { FC, MouseEvent } from "react";
import type { MaybePromise } from "@/types/utils";
import type { LiteColumn, TableTemplate } from "./types";
import type {
  IColumn,
  SortParamsPriority,
  TableState
} from "@/components/Table/types";

import "./index.less";

const pickState = (
  state: TableState,
  baseState: TableState
): TableTemplate["state"] => {
  const columnsPositions = (function rec(columns?: IColumn[]): LiteColumn[] {
    return (
      columns?.map(column => ({
        dataIndex: column.dataIndex,
        order: column.order,
        children:
          column.children && column.children.length
            ? rec(column.children)
            : undefined
      })) ?? []
    );
  })(baseState.columns);

  const sortParamsPriority: SortParamsPriority = {};
  if (state.multisorting && Object.keys(state.sortParams).length > 1) {
    for (const key in state.sortParams) {
      if (!state.columnsMap[key]) sortParamsPriority[key] = 999;

      const sorter = state.columnsMap[key].sorter;
      if (typeof sorter === "object" && sorter.multiple) {
        sortParamsPriority[key] = sorter.multiple;
      }
    }
  }

  return {
    columnsPositions,
    sortParamsPriority,
    pagination: state.pagination,
    sortParams: state.sortParams,
    columnsWidth: state.columnsWidth,
    fixedTotal: state.fixedTotal,
    filterParams: state.filterParams,
    visibleColumnsKeys: state.visibleColumnsKeys
  };
};

export interface TableTemplatesProps {
  fetchAfterApply?: boolean;
  sortFirstColumn?: boolean;
  templates?: () => MaybePromise<TableTemplate[]>;
  onDelete: (template: TableTemplate) => void;
  onSelect?: (template?: TableTemplate) => void;
  onSelectFavorite: (template: TableTemplate) => void;
  onCreate: (template: TableTemplate) => void | Promise<TableTemplate>;
}

const TableTemplates: FC<TableTemplatesProps> = ({
  fetchAfterApply = true,
  onCreate,
  onDelete,
  onSelectFavorite,
  onSelect,
  ...props
}) => {
  const { translate } = useConfig();
  const { tableState, dispatch, baseTableState, tableProps } = useTable();

  const [templates, setTemplates] = useState<TableTemplate[]>([]);

  const [selectedTemplate, setSelectedTemplate] =
    useState<TableTemplate | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const setTemplateToState = useCallback(
    (template: TableTemplate) => {
      let sortParams = template.state.sortParams;
      const columnsPositions = template.state.columnsPositions;

      if (
        props.sortFirstColumn &&
        Object.keys(sortParams ?? {}).length === 0 &&
        columnsPositions.length > 1
      ) {
        sortParams = {
          [columnsPositions[1].dataIndex]: "descend"
        };
      }
      if (fetchAfterApply) {
        template.state.forceFetch = tableState.forceFetch + 1;
      }

      if (!("columnsWidth" in template.state)) {
        template.state.columnsWidth = {};
      }

      if (!("fixedTotal" in template.state)) {
        template.state.fixedTotal = true;
      }

      dispatch({
        type: "recoveryState",
        payload: { ...template.state, sortParams, fetchAfterApply }
      });
    },
    [dispatch, fetchAfterApply, props.sortFirstColumn, tableState.forceFetch]
  );

  const handleSelect = useCallback(
    (id: number | undefined) => {
      if (!id) return;
      const template = templates.find(template => template.id === id)!;
      onSelect?.(template);

      dispatch({
        type: "update",
        payload: {
          templateSelected: true,
          columnsForceUpdate: tableState.columnsForceUpdate! + 1,
          sortParamsPriority: template.state.sortParamsPriority
        }
      });
      setSelectedTemplate(template);
      setTemplateToState(template);
    },
    [templates, onSelect, dispatch, setTemplateToState, tableState]
  );

  const handleSelectFavorite = useCallback(
    (template: TableTemplate) => {
      setTemplates(templates =>
        templates.map(item => ({
          ...item,
          favorite: item.id === template.id && !item.favorite
        }))
      );
      onSelectFavorite?.(template);
    },
    [onSelectFavorite]
  );

  const handleClear = useCallback(
    (e: MouseEvent<HTMLSpanElement> | null) => {
      e?.stopPropagation();
      e?.preventDefault();

      setSelectedTemplate(null);

      if (fetchAfterApply) {
        const state = {
          first: true,
          forceFetch: tableState.forceFetch + 1,
          visibleColumnsKeys: tableProps.visibleColumnsKeys,
          columnsWidth: {},
          columns: [],
          fixedTotal: true,
          templateSelected: false,
          columnsSwapped: false
        };

        dispatch({ type: "update", payload: state });
        return;
      }

      dispatch({ type: "filter", payload: {} });
    },
    [
      dispatch,
      fetchAfterApply,
      tableProps.visibleColumnsKeys,
      tableState.forceFetch
    ]
  );

  const handleDelete = useCallback(
    (template: TableTemplate) => {
      setTemplates(templates =>
        templates.filter(item => item.id !== template.id)
      );

      if (selectedTemplate?.id === template.id) {
        handleClear(null);
      }

      onDelete?.(template);
    },
    [handleClear, onDelete, selectedTemplate]
  );

  const handleCreate = useCallback(
    async (title: string) => {
      let template: TableTemplate = {
        title,
        favorite: false,
        state: pickState(tableState, baseTableState)
      };

      if (onCreate) {
        const createResponse = await onCreate(template);
        if (createResponse) template = createResponse;
      }

      setSelectedTemplate(template);
      dispatch({
        type: "update",
        payload: {
          templateSelected: true
        }
      });
      setTemplates(templates => templates.concat(template));
    },
    [tableState, baseTableState, onCreate, dispatch]
  );

  useEffect(() => {
    if (!tableState.templateSelected) setSelectedTemplate(null);
    // eslint-disable-next-line
  }, [useDeepEqualMemo(tableState.templateSelected)]);

  useEffect(() => {
    const setInternalTemplates = (templates: TableTemplate[]) => {
      const favorite = templates.find(template => template.favorite);

      if (favorite && favorite.state) {
        setSelectedTemplate(favorite);
        setTemplateToState(favorite);
      }

      setTemplates(templates);
    };

    if (tableState.templates) {
      setInternalTemplates(tableState.templates);
      return;
    }

    if (!props.templates) return;

    if (typeof props.templates === "function") {
      Promise.resolve(props.templates()).then(setInternalTemplates);
    } else {
      setInternalTemplates(props.templates);
    }

    // eslint-disable-next-line
  }, [props.templates, tableState.templates]);

  const className = useMemo(() => {
    return clsx("table-templates", "table-toolbar--right", {
      "table-templates--selected": Boolean(selectedTemplate)
    });
  }, [selectedTemplate]);

  return (
    <div
      className={className}
      title={translate(
        selectedTemplate ? "CHANGE_TEMPLATE_BTN_TITLE" : "TEMPLATES_BTN_TITLE"
      )}
    >
      <Select
        listHeight={150}
        onChange={value => handleSelect(value as number)}
        className="table-templates__selector"
        value={selectedTemplate?.id || translate("TEMPLATES")}
        onOpenChange={state => setIsDropdownOpen(state)}
        prefix={<TagsOutlined className="table-templates__icon" />}
        popupRender={originNode => (
          <Dropdown onCreate={handleCreate} isOpen={isDropdownOpen}>
            {originNode}
          </Dropdown>
        )}
      >
        {templates.map((template, idx) => (
          <Select.Option key={idx} value={template.id}>
            <Template
              onDelete={handleDelete}
              onSelectFavorite={handleSelectFavorite}
              isActive={Boolean(selectedTemplate?.id === template.id)}
              {...template}
            />
          </Select.Option>
        ))}
      </Select>
      {selectedTemplate && (
        <span className="table-templates__value-unselect" onClick={handleClear}>
          &times;
        </span>
      )}
    </div>
  );
};

export default TableTemplates;
