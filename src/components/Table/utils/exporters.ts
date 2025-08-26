import ExcelJS from "exceljs";
import { defineCellType } from "./utils";
import type { TableState, ISheet, IColumn } from "../types";

const getDeepMaxLevel = (columns?: IColumn[]) => {
  let maxLevel = 1;

  (function rec(columns, level = 1) {
    columns?.forEach(column => {
      if (column.children && column.children.length)
        rec(column.children, level + 1);
      if (level > maxLevel) maxLevel = level;
    });
  })(columns);

  return maxLevel;
};

const getDeepChildren = (columns?: IColumn[]) => {
  const deepChildren: IColumn[] = [];

  (function rec(columns) {
    columns?.forEach(column => {
      if (column.children && column.children.length) rec(column.children);
      else deepChildren.push(column);
    });
  })(columns);

  return deepChildren;
};

const aroundBorderCell = (cell: ExcelJS.Cell) => {
  cell.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  };
};

const alignCenterCellText = (cell: ExcelJS.Cell) => {
  cell.alignment = {
    horizontal: "center",
    vertical: "middle"
  };
};

const fillBackgroundCell = (cell: ExcelJS.Cell, color: string) => {
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: color },
    bgColor: { argb: color }
  };
};

export const exportTableToXLSX = async (
  tableState: TableState | null,
  filename: string,
  sheetName?: string,
  cellRenderProps?: string,
  additionalSheet?: ISheet
): Promise<BlobPart> => {
  const { columns, columnsMap, dataSource, dTypesConfig } = tableState ?? {};

  const formattedSheetName = (sheetName || filename)
    .replace(/[`~!@#$%^&*()|+\-=?;:'",<>{}[]\\\/]/gi, "")
    .replace(".xlsx", "");

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(formattedSheetName);

  (function addAdditionalSheet(sheet) {
    if (!sheet?.name || !sheet?.state) return;
    const newSheet = wb.addWorksheet(sheet.name);
    const columns = Object.keys(sheet.state);

    newSheet.columns = columns.map(columnName => {
      return { header: columnName, key: columnName, width: 20 };
    });

    columns.forEach(columnKey => {
      const col = newSheet.getColumn(columnKey);
      col.values = [columnKey, ...sheet.state[columnKey]];
    });

    newSheet.eachRow(Row => {
      Row.eachCell(Cell => {
        Cell.alignment = { wrapText: true };
      });
    });

    newSheet.getRow(1).eachCell(cell => {
      aroundBorderCell(cell);
      alignCenterCellText(cell);
      fillBackgroundCell(cell, "efefef");
    });
  })(additionalSheet);

  const columnsMaxLevel = getDeepMaxLevel(columns);
  const defaultValues: Record<string, number> = {};

  // Recursive draw columns
  (function drawColumns(columns, rowIdx = 1, colIdx = 1) {
    columns?.forEach(column => {
      const row = ws.getRow(rowIdx);
      const cell = row.getCell(colIdx);

      // Set column title
      cell.value = column.title as ExcelJS.CellValue;

      aroundBorderCell(cell);
      alignCenterCellText(cell);
      fillBackgroundCell(cell, "efefef");

      const dType =
        dTypesConfig?.[defineCellType({}, columnsMap?.[column.dataIndex])];

      if (dType && typeof dType.defaultValue !== "undefined") {
        defaultValues[column.dataIndex] = 0;
      }

      // Check children for correct merge cells width
      if (column.children && column.children.length) {
        const childrenCount = getDeepChildren(column.children).length;
        const nextCellIdx = colIdx + (childrenCount - 1);
        const nextCell = row.getCell(nextCellIdx);

        ws.mergeCells(`${cell.address}:${nextCell.address}`);
        drawColumns(column.children, rowIdx + 1, colIdx);

        colIdx = colIdx + childrenCount;
      } else {
        // If not child stretch height of cell to max children level of columns
        const letter = (cell as any)._column.letter;
        ws.mergeCells(`${cell.address}:${letter}${columnsMaxLevel}`);
        ++colIdx;
      }
    });
  })(columns);

  // Add columns
  ws.columns = getDeepChildren(columns).map(({ dataIndex, width }) => ({
    key: dataIndex,
    width: Number(width || 200) / 10
  }));

  // Recursive add row for tree table
  (function drawRows(rows, level = 0) {
    rows?.forEach(rowData => {
      const { children, key, ...restRowData } = rowData;
      const margin = "  ".repeat(level);
      const firstColumn = ws.getColumn(1).key;

      // To string by dType
      const rowToDraw = Object.entries(restRowData).reduce(
        (acc, [columnKey, cellValue]) => {
          const dType =
            dTypesConfig?.[defineCellType(cellValue, columnsMap?.[columnKey])];

          acc[columnKey] = "unknown";

          if (dType) {
            acc[columnKey] = dType.toExcel
              ? dType.toExcel(cellValue, rowData, columnKey, cellRenderProps)
              : dType.toString(cellValue);
          }
          return acc;
        },
        {} as Record<string, string>
      );

      const firstColumnObject = firstColumn
        ? { [firstColumn]: margin + rowToDraw[firstColumn] }
        : {};

      const row = ws.addRow({
        ...defaultValues,
        ...rowToDraw,
        key,
        ...firstColumnObject
      });

      row.hidden = level !== 0;
      row.outlineLevel = level;

      row.eachCell(cell => {
        aroundBorderCell(cell);
      });

      if (children) drawRows(children, level + 1);
    });
  })(dataSource);

  return await wb.xlsx.writeBuffer();
};
