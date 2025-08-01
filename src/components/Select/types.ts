import type { FC, ReactNode } from "react";
import type { Select as AntSelect, SelectProps as AntSelectProps } from "antd";
import type { SelectValue } from "antd/lib/select";

export interface SelectProps<T> extends AntSelectProps<T> {
  /**
   * Asynchronous function to load data based on the search value and page.
   * Can return either an array of options or an object with options and a next page token.
   *
   * @param searchValue - The search string entered by the user.
   * @param page - The current page number for pagination.
   * @returns A promise resolving to an array of options or an object with `options` and `next` (page token or null).
   */
  loadData?: <R = any>(
    searchValue: string,
    page: number
  ) => Promise<R[] | { options: R[]; next: string | null }>;

  /**
   * Enable asynchronous data loading mode.
   * Useful for remote search or paginated data fetching.
   * @default false
   */
  asyncData?: boolean;

  /**
   * Custom rendering function for options in the dropdown.
   *
   * @param option - The option object to render.
   * @returns A React node or element to display.
   */
  optionRender?: <P = any>(option: P) => ReactNode;

  /**
   * Text or content to display while loading options.
   * @default "LOADING"
   */
  loadingContent?: string;

  /**
   * Text or content to display when no options are found.
   * @default "NO_DATA"
   */
  notFoundContent?: string;

  /**
   * Enable loading asynchronous data with pagination in the dropdown.
   * @default false
   */
  withPagination?: boolean;

  /**
   * Use a custom function to render tags (selected values).
   */
  useCustomTagRender?: boolean;
}

export type SelectComponent = FC<SelectProps<SelectValue>>;

export interface SelectCompoundComponent extends SelectComponent {
  Option: typeof AntSelect.Option;
  OptGroup: typeof AntSelect.OptGroup;
}
