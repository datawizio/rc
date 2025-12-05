# 📘 Code Conventions

This document describes **recommendations** for writing code in the Datawiz.io React Components
Library. These are not strict rules but shared practices that make our codebase more consistent,
predictable, and easier to maintain. If you ever have a good reason to deviate, that's fine — but
always do it consciously, not accidentally.

## Imports

We recommend keeping imports clean and structured. The usual order is:

1. Wildcard imports (like `import * as ...`)
2. Default imports
3. Named (partial) imports
4. Type imports
5. Styles

Type imports should always use `import type`. This avoids polluting the runtime with unnecessary
imports.

✅ **Do**:

```ts
import * as Flags from "country-flag-icons/react/3x2";
import React from "react";
import Button from "@/components/Button";

import { useTheme } from "@/hooks/useTheme";

import type { FC } from "react";

import "./index.less";
```

❌ **Don't**:

```ts
import React, { FC } from "react";
import "./index.less";
import * as Flags from "country-flag-icons/react/3x2";
import { useTheme } from "../../hooks/useTheme";
import Button from "../Button";
```

We also recommend avoiding relative imports like `../..` in favor of the `@/` alias. This keeps
paths stable and easier to read.

When importing some utilities or types from `antd`, always use the `/es/` build (tree-shakable, modern)
instead of `/lib/` version. Use the `Ant` prefix for Ant Design components when importing them
alongside our own internal components to avoid name collisions.

✅ **Do**:

```ts
import Button from "@/components/Button";
import { Button as AntButton } from "antd/es/button";
```

❌ **Don't**:

```ts
import MyButton from "@/components/Button";
import { Button } from "antd/lib/button";
```

## Functions and Components

For consistency, components should be declared as arrow functions. They are concise, and this keeps
our code style uniform.

✅ **Do**:

```ts
const Button = () => {
  return <div>Click me</div>;
};
```

❌ **Don't**:

```ts
function Button() {
  return <div>Click me</div>;
}
```

If you use `React.memo`, wrap the component only at the point of export, not inline when declaring
the function. This keeps the component definition simple and makes memoization an explicit export
decision.

✅ **Do**:

```ts
const Button = () => {
  return <div>Click me</div>;
};

export default React.memo(Button);
```

❌ **Don't**:

```ts
const Button = React.memo(() => {
  return <div>Click me</div>;
});

export default Button;
```

Default exports are reserved only for React components. Hooks, helpers, and types should always use
named exports.

## Types

We recommend avoiding `any` because it disables type safety. If you don't know the type, prefer
`unknown` or define a proper interface.

For arrays, prefer the `T[]` shorthand because it's easier to read. The only exception is when you
need to type an array of a property, in which case `Array<T["prop"]>` is clearer.

✅ **Do**:

```ts
const numbers: number[] = [1, 2, 3];
```

✅ **Special case**:

```ts
type Values = Array<T["prop"]>;
```

React provides multiple primitives for typing items that can be rendered. In most cases, prefer `ReactNode` because it
supports text, numbers, fragments, and components. Use `ReactElement` when you want to enforce that
the item is a valid React element, and use `JSX.Element` only if absolutely needed.

All types and interfaces should be exported so they can be reused across the library. Keep them in
`types.ts` files next to the implementation or in `./src/types/` folder instead of separate `.d.ts`
files.

## Theming and Context

For theme handling, always use the `useTheme` hook instead of reading from `window.theme` or
`localStorage`. This ensures reactivity and makes the theme consistent with the React state.

✅ **Do**:

```ts
const theme = useTheme();
```

❌ **Don't**:

```ts
const theme = localStorage.getItem("theme");
```

When working with React contexts, avoid calling `useContext` directly in every component. Instead,
create a custom hook for the context. This makes code more readable and flexible if we later need to
add extra logic.

✅ **Do**:

```ts
// ConfigContext.tsx
export const useConfig = () => {
  return useContext(ConfigContext);
};

// Component.tsx
const config = useConfig();
```

❌ **Don't**:

```ts
// Component.tsx
const config = useContext(ConfigContext);
```

## Folder and File Structure

Each component should live in its own folder, and that folder should contain everything related to
the component: its internal building blocks, styles, hooks, utilities, and types. This makes the
component self-contained and easy to maintain.

A typical structure looks like this:

```
📁 components/
  📁 Table/
    📁 components/   # Subcomponents specific to Table (e.g., Row, Column)
    📁 hooks/        # Hooks used only by Table (e.g., useTableColumns)
    📁 utils/        # Utility functions for Table logic
    📄 index.tsx     # Main entry point of the Table component
    📄 index.less    # Default styles for Table
    📄 rtl.less      # Right-to-left layout overrides
    📄 types.ts      # Types and interfaces for Table
```

This structure ensures that all logic, styles, and helpers that belong to a component are colocated
inside its folder. Subcomponents stay inside the components folder, so they don't pollute the global
namespace. Hooks and utils are separated for clarity and reusability within the component itself.
Styles are kept in `.less` files, with a dedicated `rtl.less` to handle right-to-left support. The
`types.ts` file contains all exported types for the component, making it easy to find and reuse them.

> 👉 **Why this matters?** Having everything in one place keeps components modular. It makes it easier
> for new developers to find the relevant code, encourages encapsulation, and avoids scattering
> related logic across the project.

## Code Style

Prefer not to use `eslint-disable-next-line` or `@ts-expect-error` as a shortcut to silence errors.
If a rule doesn't fit, try to think of a better solution rather than hiding the problems.

Formatting is handled automatically by Prettier and ESLint, so don't worry about code style
details — just let the tools run.

Most importantly, prefer clarity over cleverness. A simple, explicit solution is always better than
a short but confusing one.

---

✅ By following these recommendations, we keep the codebase approachable for everyone. They are not
strict rules but conventions that help us collaborate more smoothly.
