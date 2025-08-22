import { useContext } from "react";
import { TableContext } from "@/components/Table/context";

export const useTable = () => {
  const ctx = useContext(TableContext);

  if (!ctx) {
    throw new Error("The hook call occurs outside of TableContext.Provider");
  }

  return ctx;
};
