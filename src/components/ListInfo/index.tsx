import React, { useState } from "react";
import ExpandButton from "@/components/ExpandButton";

export interface ListInfoProps<T> {
  label: string;
  items?: T[] | null;
  delim?: string;
  linkFn?: (id: string) => string;
  renderItem?: (item: T) => React.ReactNode;
  LinkComponent?: React.ComponentType<
    React.PropsWithChildren<{
      to: string;
      target: string;
      [key: string]: any;
    }>
  >;
  showExpandButton?: boolean;
  expandButton?: React.ReactNode;
  maxLength?: number;
  onlyLabel?: boolean;
}

export interface IInfoListItem {
  id: string;
  name: string;
}

const LIST_LENGTH_LIMIT = 5;

const ListInfo = <T = IInfoListItem,>({
  label,
  items = [],
  delim = ", ",
  linkFn,
  renderItem,
  LinkComponent,
  showExpandButton = true,
  expandButton,
  maxLength = LIST_LENGTH_LIMIT,
  onlyLabel = false
}: ListInfoProps<T>) => {
  const [showAll, setShowAll] = useState(false);

  if ((!items || items.length === 0) && !onlyLabel) {
    return null;
  }

  const shouldCutList = items && items.length !== 0 && items.length > maxLength;
  const visibleItems = showAll ? items : items?.slice(0, maxLength);

  const defaultExpandButton = (
    <ExpandButton listOpen={showAll} setListOpen={setShowAll} />
  );

  const expandBtnElement = expandButton ?? defaultExpandButton;

  const renderListItem = (item: T | IInfoListItem) => {
    if (renderItem) return renderItem(item as T);
    const { id, name } = item as IInfoListItem;

    if (linkFn && LinkComponent) {
      return (
        <LinkComponent key={id} to={linkFn(id)} target="_blank">
          {name}
        </LinkComponent>
      );
    }
    return name;
  };

  const renderedList = visibleItems
    ?.map<React.ReactNode>(renderListItem)
    ?.reduce<React.ReactNode[]>((acc, curr, idx) => {
      if (idx > 0) acc.push(delim);
      acc.push(curr);
      return acc;
    }, []);

  return (
    <div>
      <span className="card-header-info-label">
        {label}
        {!onlyLabel && <span className="colon">:</span>}
      </span>
      {!onlyLabel && (
        <span>
          {renderedList}
          {showExpandButton && shouldCutList && expandBtnElement}
          {!showExpandButton && shouldCutList && ", ..."}
        </span>
      )}
    </div>
  );
};

export default React.memo(ListInfo) as typeof ListInfo;
