import clsx from "clsx";
import { useCallback } from "react";
import { StarOutlined, StarFilled, DeleteOutlined } from "@ant-design/icons";
import { useConfig } from "@/hooks";

import type { FC, MouseEvent } from "react";
import type { TableTemplate } from "../types";

export interface TemplateProps extends TableTemplate {
  isActive: boolean;
  onDelete: (template: TableTemplate) => void;
  onSelectFavorite: (template: TableTemplate) => void;
}

const Template: FC<TemplateProps> = ({
  onDelete,
  onSelectFavorite,
  isActive,
  ...template
}) => {
  const { t } = useConfig();

  const handleFavoriteClick = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation();
      onSelectFavorite(template);
    },
    [template, onSelectFavorite]
  );

  const handleDeleteClick = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation();
      onDelete(template);
    },
    [template, onDelete]
  );

  const className = clsx("table-templates__template-title", {
    "table-templates__template-title--selected": isActive
  });

  return (
    <div className="table-templates__template">
      {!template.favorite && (
        <StarOutlined
          onClick={handleFavoriteClick}
          title={t("DEFAULT")}
          className="table-templates__icon table-templates__icon--favorite"
        />
      )}
      {template.favorite && (
        <StarFilled
          onClick={handleFavoriteClick}
          title={t("DEFAULT")}
          className="table-templates__icon table-templates__icon--favorite-active"
        />
      )}
      <span title={template.title} className={className}>
        {template.title}
      </span>
      <DeleteOutlined
        onClick={handleDeleteClick}
        className="table-templates__icon--delete"
      />
    </div>
  );
};

export default Template;
