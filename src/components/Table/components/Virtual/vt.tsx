/*
 * This code is taken from the following source:
 * https://github.com/wubostc/virtualized-table-for-antd/blob/master/src/vt.tsx
 *
 * It has been slightly modified for our specific needs.
 * If you want to make changes, be careful and do so at your own risk.
 */

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-refresh/only-export-components */

import Cell from "../Cell";
import React, {
  useRef,
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useImperativeHandle
} from "react";

export type CustomizeComponent = React.FC<any>;

export interface TableComponentObject {
  wrapper?: CustomizeComponent;
  row?: CustomizeComponent;
  cell?: CustomizeComponent;
}

export interface TableComponents {
  table?: CustomizeComponent;
  header?: TableComponentObject;
  body?: TableComponentObject;
}

// The events of scrolling
const SCROLL_EVENT_NULL = 0 << 0;
const SCROLL_EVENT_INIT = 1 << 0;
const SCROLL_EVENT_RECOMPUTE = 1 << 1;
const SCROLL_EVENT_NATIVE = 1 << 3;
const SCROLL_EVENT_BY_HOOK = 1 << 6;

// Any events will be `SCROLL_EVENT_BY_HOOK` if the `ctx.f_top === TOP_CONTINUE`.
const TOP_CONTINUE = 0;
const TOP_DONE = 1;

interface VirtualTableRefObject {
  scrollTo: (y: number) => void;
  scrollToIndex: (idx: number) => void;
}

export interface VirtualTableOptions {
  /**
   * A unique identifier for the virtual table instance.
   * Useful when you need to manage multiple independent tables.
   */
  id?: number | string;

  /**
   * Specifies how many extra rows (above and below the visible area) should be rendered.
   * A higher value reduces visible loading when scrolling fast, but increases DOM size.
   * @default 5
   */
  overscanRowCount?: number;

  /**
   * Defines the vertical scroll size of the table.
   */
  scroll: {
    y: number | string;
  };

  /**
   * Callback fired on wheel/scroll events (native events only).
   */
  onScroll?: ({
    left,
    top,
    isEnd
  }: {
    top: number;
    left: number;
    isEnd: boolean;
  }) => void;

  /**
   * Initial vertical scroll offset (in pixels).
   * Useful when restoring scroll position or navigating back to a table.
   */
  initTop?: number;

  /**
   * Enables debug mode, which may log internal state or render debug helpers for development.
   * @default false
   */
  debug?: boolean;

  /**
   * A ref to access virtual table instance methods.
   * Passing `-1` into exposed methods (e.g., `scrollTo`) scrolls directly to the bottom.
   */
  ref?: React.RefObject<VirtualTableRefObject>;
}

enum VT_STATE {
  INIT = 1,
  LOADED = 2,
  RUNNING = 4
}

interface VirtualTableContext extends VirtualTableOptions {
  y: number; // An actual height of the HTML element '.ant-table-body'.
  scroll_y: number | string; // This is the same as the `Table.scroll.y`.

  vt_components: TableComponents; // Virtual layer.
  components: TableComponents; // Implementation layer.
  vt_state: VT_STATE;
  possible_height_per_tr: number;

  // If `0` - no need to recalculate; `> 0` - to add; `< 0` - to subtract.
  re_computed: number;

  row_height: number[];
  row_count: number;
  prev_row_count: number;
  wrap_inst: React.RefObject<HTMLDivElement>;

  // Returns the last state.
  VirtualTableScroll?: (param?: { top: number; left: number }) => {
    top: number;
    left: number;
  };

  computed_h: number; // A cache for the wrapper height.
  wrapper_height: number; // Wrapper height
  handle_paint: number; // A handle for batch repainting.

  offset_top: number;
  offset_head: number;
  offset_tail: number;

  top: number;
  left: number;
  evt: number;
  end: boolean;

  final_top: number;
  f_final_top: number;

  update_count: number;

  on_update_wrap_style: () => void;
}

const row_idx = typeof Symbol === "function" ? Symbol.for("idx") : "$$idx";

function default_context(): VirtualTableContext {
  return {
    vt_state: VT_STATE.INIT,
    possible_height_per_tr: -1,
    computed_h: 0,
    re_computed: 0,
    row_height: [],
    row_count: 0,
    prev_row_count: 0,
    offset_top: 0 | 0,
    offset_head: 0 | 0,
    offset_tail: 0 | 1,
    wrapper_height: 0,
    top: 0,
    left: 0,
    evt: SCROLL_EVENT_NULL,
    end: false,
    final_top: 0,
    f_final_top: TOP_DONE,
    update_count: 0
  } as unknown as VirtualTableContext;
}

interface SimEvent {
  target: { scrollTop: number; scrollLeft: number };
  flag: number;
  end?: boolean;
}

// The factory function returns a `SimEvent`.
function make_evt(ne: Event): SimEvent {
  const target: any = ne.target;
  return {
    target: {
      scrollTop: target.scrollTop,
      scrollLeft: target.scrollLeft
    },
    end:
      target.scrollHeight - target.clientHeight ===
      Math.round(target.scrollTop),
    flag: SCROLL_EVENT_NATIVE
  };
}

// Default implementations.

const TableImpl = React.forwardRef<any>(function TableImpl(props, ref) {
  return <table ref={ref} {...props} />;
});

const WrapperImpl = (props: any) => {
  return <tbody {...props} />;
};

const RowImpl = React.forwardRef<any>(function RowImpl(props, ref) {
  return <tr ref={ref} {...props} />;
});

function scroll_with_offset(
  ctx: VirtualTableContext,
  top: number
): [number, number, number] {
  const { row_height, row_count, overscanRowCount } = ctx;

  ctx.scroll_y = ctx.scroll.y;

  if (typeof ctx.scroll_y === "number") {
    ctx.y = ctx.scroll_y;
  } else if (
    typeof ctx.scroll_y === "string" /* A string, like "calc(100vh - 300px)" */
  ) {
    // This `offsetHeight` may be 0!
    ctx.y = ctx.wrap_inst.current.parentElement!.offsetHeight;
  } else {
    console.assert(false, "VT: did you forget to set `scroll.y`?");
    ctx.y = ctx.wrap_inst.current.parentElement!.offsetHeight;
  }

  console.assert(ctx.y >= 0);

  // To calculate `top_value` with `row_height` and `overscan`.
  let top_value = 0,
    i = 0,
    j = 0;

  // The height to render.
  let h_to_render = 0;

  // Scroll to the bottom of the table.
  if (top === -1 && row_count > 0) {
    i = row_count;
    while (i > 0 && h_to_render < ctx.y) {
      h_to_render += row_height[--i];
    }

    return [0 | i, 0 | row_count, 0 | (ctx.computed_h - h_to_render)];
  }

  for (; i < row_count && top_value < top; ++i) {
    top_value += row_height[i];
  }

  // Start `j` from the visible area
  j = i;
  for (; j < row_count && h_to_render < ctx.y; ++j) {
    h_to_render += row_height[j];
  }

  // Keep offset row on top and bottom
  let overscan = overscanRowCount! < 0 ? 0 : overscanRowCount!;
  while (i > 0 && overscan--) {
    top_value -= row_height[--i];
  }
  j += overscanRowCount!;

  if (j > row_count) j = row_count;

  // Returns [head, tail, top].
  return [0 | i, 0 | j, 0 | top_value];
}

// Set the variables for offset top/head/tail.
function set_offset(
  ctx: VirtualTableContext,
  top: number,
  head: number,
  tail: number
): void {
  ctx.offset_top = 0 | top;
  ctx.offset_head = 0 | head;
  ctx.offset_tail = 0 | tail;
}

function set_scroll(
  ctx: VirtualTableContext,
  top: number,
  left: number,
  evt: number,
  end: boolean
): void {
  ctx.top = top;
  ctx.left = left;
  ctx.evt = evt;
  ctx.end = end;
}

function update_wrap_style(ctx: VirtualTableContext, h: number): void {
  if (ctx.wrapper_height === h) return;
  ctx.wrapper_height = h;

  const s = ctx.wrap_inst.current.style;

  s.height = h
    ? ((s.maxHeight = h + "px"), s.maxHeight)
    : ((s.maxHeight = "unset"), s.maxHeight);

  ctx.on_update_wrap_style();
}

// Scrolls the parent element to specified location.
function scroll_to(ctx: VirtualTableContext, top: number, left: number): void {
  if (!ctx.wrap_inst.current) return;
  const ele = ctx.wrap_inst.current.parentElement!;

  ele.scrollTop = top;
  ele.scrollLeft = Math.max(left, ele.scrollLeft);
}

function repainting_implementation(
  ctx: VirtualTableContext,
  ms: number
): number {
  const fn = (): void => {
    if (ctx.vt_state === VT_STATE.RUNNING && ctx.wrap_inst.current) {
      // Output to the buffer
      update_wrap_style(ctx, ctx.computed_h);
    }

    // Free this handle manually.
    ctx.handle_paint = 0;
  };

  return ms < 0 ? window.requestAnimationFrame(fn) : window.setTimeout(fn, ms);
}

// A wrapper function for `repainting_implementation`.
function repainting(ctx: VirtualTableContext): void {
  if (ctx.handle_paint > 0) return;
  ctx.handle_paint = repainting_implementation(ctx, -1);
}

function srs_expand(
  ctx: VirtualTableContext,
  len: number,
  prev_len: number,
  fill_value: number
): void {
  const s_len = len - prev_len;
  const shadow_rows = new Array(s_len).fill(fill_value);
  ctx.row_height = ctx.row_height.concat(shadow_rows);
  ctx.computed_h += s_len * fill_value;
}

function srs_shrink(
  ctx: VirtualTableContext,
  len: number,
  prev_len: number
): void {
  if (len === 0) {
    ctx.computed_h = 0;
    ctx.row_height.length = 0;
    ctx.top = 0;
    return;
  }

  const rows = ctx.row_height;

  let h2shrink = 0;
  for (let i = len; i < prev_len; ++i) {
    h2shrink += rows[i];
  }
  ctx.computed_h -= h2shrink;
}

function set_tr_cnt(ctx: VirtualTableContext, n: number): void {
  ctx.re_computed = n - ctx.row_count;
  ctx.prev_row_count = ctx.row_count;
  ctx.row_count = n;
}

interface VirtualTableProps {
  style: React.CSSProperties;
  context: React.Context<VirtualTableContext>;
  children: React.ReactNode;
}

const VirtualTable: React.ForwardRefRenderFunction<
  VirtualTableRefObject,
  VirtualTableProps
> = ({ style, context, ...rest }, ref) => {
  // Force update this `vt`.
  const force = useState(0);
  const ref_func = useRef<() => void>(() => {});

  const wrap_inst = useMemo(
    () => React.createRef() as React.RefObject<HTMLDivElement>,
    []
  );

  const ctx = useContext(context);

  useMemo(() => {
    Object.assign(ctx, default_context());

    if (ctx.wrap_inst && ctx.wrap_inst.current) {
      ctx.wrap_inst.current.parentElement!.onscroll = null;
    }

    ctx.wrap_inst = wrap_inst;
    ctx.top = ctx.initTop!;

    ctx.on_update_wrap_style = () => {
      if (ctx.y === 0 && `${ctx.scroll_y}`.length) {
        scroll_hook({
          flag: SCROLL_EVENT_BY_HOOK,
          target: {
            scrollTop: ctx.top,
            scrollLeft: ctx.left
          }
        });
      }
    };
  }, []);

  const event_queue = useRef<SimEvent[]>([]).current;
  const handle_raf = useRef(0); // Handle of `requestAnimationFrame`

  // Callback for `requestAnimationFrame`
  const raf_update_self = useCallback<FrameRequestCallback>(() => {
    if (ctx.vt_state !== VT_STATE.RUNNING) return;

    const evq = event_queue;

    if (!evq.length) {
      return;
    }

    // This always consumes the last element of the event queue.
    const e = evq.pop()!;

    const scrollLeft = e.target.scrollLeft;
    let scrollTop = e.target.scrollTop;

    const flag = e.flag;

    // Checks every height of `tr` element, which will take some time...
    const offset = scroll_with_offset(
      ctx,
      ctx.f_final_top === TOP_CONTINUE ? ctx.final_top : scrollTop
    );

    const head = offset[0];
    const tail = offset[1];
    const top = offset[2];

    const prev_head = ctx.offset_head;
    const prev_tail = ctx.offset_tail;
    const prev_top = ctx.offset_top;

    let end: boolean;

    switch (flag) {
      case SCROLL_EVENT_INIT:
        end = false;
        break;

      case SCROLL_EVENT_BY_HOOK:
        if (head === prev_head && tail === prev_tail && top === prev_top) {
          ctx.f_final_top = TOP_DONE;
          if (ctx.final_top === -1) scrollTop = ctx.computed_h - ctx.y;
          end = true;
        } else {
          if (ctx.final_top === -1) scrollTop = top;
          end = false;
        }

        break;

      case SCROLL_EVENT_RECOMPUTE:
        if (head === prev_head && tail === prev_tail && top === prev_top) {
          handle_raf.current = 0;

          if (evq.length) scroll_hook(null); // Consume the next.
          return;
        }

        end = false;
        break;

      case SCROLL_EVENT_NATIVE:
        handle_raf.current = 0;
        evq.length = 0;

        // Save scroll position by expand row
        // ctx.final_top = scrollTop;

        if (ctx.onScroll) {
          ctx.onScroll({
            top: scrollTop,
            left: scrollLeft,
            isEnd: e.end!
          });
        }

        // Update scroll position when using scroll native
        set_scroll(ctx, scrollTop, scrollLeft, flag, end!);
        if (head === prev_head && tail === prev_tail && top === prev_top) {
          return;
        }

        end = e.end!;
        break;
    }
    set_offset(ctx, top, head, tail);
    set_scroll(ctx, scrollTop, scrollLeft, flag, end!);
    force[1](++ctx.update_count);
  }, []);

  const scroll_hook = useCallback((e: SimEvent | null) => {
    if (ctx.vt_state !== VT_STATE.RUNNING) return;

    if (e) {
      event_queue.push(e);

      if (ctx.f_final_top === TOP_CONTINUE) {
        e.flag = SCROLL_EVENT_BY_HOOK;
        return raf_update_self(0);
      }
    }

    if (event_queue.length) {
      if (handle_raf.current) cancelAnimationFrame(handle_raf.current);
      handle_raf.current = requestAnimationFrame(raf_update_self);
    }
  }, []);

  const scroll_hook_native = useCallback((e: Event) => {
    scroll_hook(make_evt(e));
  }, []);

  // Expose to the parent components you are using.
  useImperativeHandle(ref, () => {
    // `y === -1` indicates you need to scroll to the bottom of the table.
    const scrollTo = (y: number) => {
      ctx.f_final_top = TOP_CONTINUE;
      ctx.final_top = y;
      scroll_hook({
        target: { scrollTop: y, scrollLeft: -1 },
        flag: SCROLL_EVENT_BY_HOOK
      });
    };

    return {
      scrollTo: y => {
        ref_func.current = () => scrollTo(y);
        ref_func.current();
      },
      scrollToIndex: idx => {
        ref_func.current = () => {
          if (idx > ctx.row_count - 1) idx = ctx.row_count - 1;
          if (idx < 0) idx = 0;
          let y = 0;
          for (let i = 0; i < idx; ++i) {
            y += ctx.row_height[i];
          }
          scrollTo(y);
        };
        ref_func.current();
      }
    };
  }, []);

  useEffect(() => {
    ctx.wrap_inst.current!.parentElement!.onscroll = scroll_hook_native;
  }, [wrap_inst]);

  // It is usually ignored by raf.
  useEffect(() => {
    scroll_hook({
      flag: SCROLL_EVENT_BY_HOOK,
      target: {
        scrollLeft: ctx.left,
        scrollTop: ctx.top
      }
    });
  }, [ctx.scroll.y]);

  // Update DOM style.
  useEffect(() => {
    switch (ctx.evt) {
      case SCROLL_EVENT_BY_HOOK:
        if (ctx.f_final_top === TOP_CONTINUE) {
          ref_func.current();
        } else {
          scroll_to(ctx, ctx.top, ctx.left);
        }
        break;

      case SCROLL_EVENT_INIT:
      case SCROLL_EVENT_RECOMPUTE:
        scroll_to(ctx, ctx.top, ctx.left);
        if (event_queue.length) raf_update_self(0); // Consume the next.
        break;
    }
  }, [force[0] /* For performance */]);

  useEffect(() => {
    switch (ctx.vt_state) {
      case VT_STATE.INIT:
        // Init `vt` without the rows.
        break;

      case VT_STATE.LOADED: // Changed by VirtualRow only.
        ctx.vt_state = VT_STATE.RUNNING;

        // Force update.
        scroll_hook({
          target: { scrollTop: ctx.top, scrollLeft: 0 },
          flag: SCROLL_EVENT_INIT
        });
        break;

      case VT_STATE.RUNNING:
        if (ctx.re_computed !== 0) {
          // Rerender
          ctx.re_computed = 0;
          scroll_hook({
            target: { scrollTop: ctx.top, scrollLeft: ctx.left },
            flag: SCROLL_EVENT_RECOMPUTE
          });
        }
        break;
    }
  });

  style.position = "relative";
  style.top = ctx.offset_top;

  const style_copy = { ...style };

  delete style_copy.width;
  delete style_copy.height;

  const tableHeight = useMemo<string | number>(() => {
    let temp: string | number = "auto";
    if (ctx.row_count && ctx.row_height.length) {
      temp = ctx.row_count * Math.max(...ctx.row_height);
    }
    return temp;
  }, [ctx.row_count, ctx.row_height]);

  // Min height for table
  const minHeight = useMemo(() => {
    if (typeof ctx.scroll.y === "number") {
      return ctx.scroll.y - 10;
    }
  }, [ctx.scroll.y]);

  const wrap_style = useMemo<React.CSSProperties>(
    () => ({
      width: "100%",
      height: tableHeight,
      minHeight,
      position: "relative",
      transform: "matrix(1, 0, 0, 1, 0, 0)"
    }),
    [tableHeight]
  );

  const Table = ctx.components.table!;

  return (
    <div className="virtuallist" ref={wrap_inst} style={wrap_style}>
      <context.Provider value={{ ...ctx }}>
        <Table {...rest} style={{ ...style_copy, minWidth: "unset" }} />
      </context.Provider>
    </div>
  );
};

interface VirtualWrapperProps {
  style: React.CSSProperties;
  ctx: VirtualTableContext;
}

const VirtualWrapper: React.FC<
  React.PropsWithChildren<VirtualWrapperProps>
> = ({ ctx, children, ...restProps }) => {
  if (!Array.isArray(children)) {
    return null;
  }

  const measureRow = children[0];
  const rows = children[1];

  const Wrapper = ctx.components.body!.wrapper!;

  // Reference https://github.com/react-component/table/blob/master/src/Body/index.tsx#L6
  let len = Array.isArray(rows) ? rows.length : 0;

  let { offset_head: head, offset_tail: tail } = ctx;

  type RowType = React.ReactElement<{
    indent: number;
    record: Record<typeof row_idx, unknown> & object;
  }>;

  let trs: RowType[] = [];

  switch (ctx.vt_state) {
    case VT_STATE.INIT:
      if (len >= 0) {
        console.assert(head === 0);
        console.assert(tail === 1);
        if (Array.isArray(rows)) {
          trs = rows.slice(head, tail);
          trs[0].props.record[row_idx] = 0;
        } else {
          trs = rows;
        }
        ctx.re_computed = len;
        ctx.prev_row_count = len;
        ctx.row_count = len;
      }
      break;

    case VT_STATE.RUNNING:
      {
        if (tail > len) {
          const offset = tail - len;
          tail -= offset;
          head -= offset;
          if (head < 0) head = 0;
          if (tail < 0) tail = 0;

          // Update the `head` and `tail`.
          set_offset(ctx, ctx.offset_top, head, tail);
        }

        if (ctx.row_count !== len) {
          set_tr_cnt(ctx, len);
        }

        len = ctx.row_count;
        const prev_len = ctx.prev_row_count;

        // Shadow rows rendering phase.
        if (len < prev_len) {
          srs_shrink(ctx, len, prev_len);
        } else if (len > prev_len) {
          const row_h = ctx.row_height;

          if (len - row_h.length > 0) {
            srs_expand(ctx, len, row_h.length, ctx.possible_height_per_tr);
          } else {
            // Calculate the total height quickly.
            row_h.fill(ctx.possible_height_per_tr, prev_len, len);
            ctx.computed_h += ctx.possible_height_per_tr * (len - prev_len);
          }
        }

        if (len) {
          let idx = head;
          trs = rows.slice(idx, tail);
          trs.forEach(el => (el.props.record[row_idx] = idx++));
        } else {
          trs = rows;
        }

        ctx.prev_row_count = ctx.row_count;
      }
      break;

    case VT_STATE.LOADED:
      console.assert(false);
      break;
  }

  return (
    <Wrapper {...restProps}>
      {measureRow}
      {trs}
    </Wrapper>
  );
};

interface VirtualRowProps {
  style: React.CSSProperties;
  ctx: VirtualTableContext;
}

const VirtualRow: React.FC<React.PropsWithChildren<VirtualRowProps>> = ({
  ctx,
  style,
  children,
  ...rest
}) => {
  const inst = React.createRef<HTMLTableRowElement>();

  if (!Array.isArray(children)) {
    return <tr {...rest}>{children}</tr>;
  }

  const row_props = children[0].props;
  const index: number = row_props.record[row_idx];
  const last_index = useRef(index);

  const expanded_cls = useMemo(
    () => `.${row_props.prefixCls}-expanded-row`,
    [row_props.prefixCls]
  );

  useEffect(() => {
    if (ctx.vt_state === VT_STATE.RUNNING) {
      repainting(ctx);
    } else {
      console.assert(ctx.vt_state === VT_STATE.INIT);
      ctx.vt_state = VT_STATE.LOADED;
      ctx.possible_height_per_tr = inst.current!.offsetHeight;
      srs_expand(ctx, ctx.row_count, 0, ctx.possible_height_per_tr);

      // Create a timeout task.
      repainting_implementation(ctx, 16);
    }

    return () => repainting(ctx);
  }, []);

  useEffect(() => {
    const rowElm = inst.current;

    // For nested (expanded) elements don't calculate height and add on cache as it's already accommodated on parent row
    // if (!rowElm.matches(".ant-table-row-level-0")) return;

    let h = rowElm!.offsetHeight;
    let sibling = rowElm!.nextSibling as HTMLTableRowElement;

    // Include heights of all expanded rows, in parent rows
    while (sibling && sibling.matches(expanded_cls)) {
      h += sibling.offsetHeight;
      sibling = sibling.nextSibling as HTMLTableRowElement;
    }

    const curr_h = ctx.row_height[index];
    const last_h = ctx.row_height[last_index.current];

    ctx.computed_h -= curr_h;
    ctx.computed_h += last_h;
    ctx.computed_h += h - last_h;
    ctx.row_height[index] = h;

    repainting(ctx);
  });

  return (
    <tr
      {...rest}
      style={{
        ...style,
        boxSizing: "border-box"
      }}
      ref={inst}
    >
      {children}
    </tr>
  );
};

export function set_components(
  ctx: VirtualTableContext,
  components: TableComponents
): void {
  const { table, body, header } = components;
  ctx.components.body = { ...ctx.components.body, ...body };

  if (body && body.cell) {
    ctx.vt_components.body!.cell = body.cell;
  }

  if (header) {
    ctx.components.header = header;
    ctx.vt_components.header = header;
  }

  if (table) {
    ctx.components.table = table;
  }
}

export function init(
  fnOpts: () => VirtualTableOptions,
  deps: React.DependencyList
): VirtualTableContext {
  const ctx = useRef(
    React.createContext<VirtualTableContext>({} as VirtualTableContext)
  ).current;
  const ctx_value = useContext(ctx);

  const default_ref: VirtualTableOptions["ref"] = useRef({
    scrollTo: (() => {}) as (y: number) => void,
    scrollToIndex: (() => {}) as (idx: number) => void
  });

  useMemo(() => {
    return Object.assign(
      ctx_value,
      {
        id: (+new Date()).toString(36).slice(4),
        initTop: 0,
        overscanRowCount: 5,
        debug: false,
        ref: default_ref
      },
      fnOpts()
    );
  }, deps);

  useMemo(() => {
    const VT = React.forwardRef(VirtualTable);

    // Set the virtual layer.
    ctx_value.vt_components = {
      table: props => <VT {...props} context={ctx} ref={ctx_value.ref} />,
      body: {
        wrapper: props => {
          return (
            <ctx.Consumer>
              {() => {
                return <VirtualWrapper {...props} ctx={ctx_value} />;
              }}
            </ctx.Consumer>
          );
        },
        row: props => <VirtualRow {...props} ctx={ctx_value} />,
        cell: props => <Cell {...props} />
      }
    };

    // Set the default implementation layer.
    ctx_value.components = {};
    set_components(ctx_value, {
      table: TableImpl,
      body: {
        wrapper: WrapperImpl,
        row: RowImpl
      }
    });

    ctx_value.vt_state = VT_STATE.INIT;
  }, []);

  return ctx_value;
}
