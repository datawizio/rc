import clsx from "clsx";
import Drawer from "@/components/Drawer";
import Button from "@/components/Button";
import Loader from "@/components/Loader";

import { useMemo, useEffect, useCallback } from "react";
import { Form } from "antd";
import { useConfig } from "@/hooks";

import type {
  ReactElement,
  ReactNode,
  PropsWithChildren,
  CSSProperties
} from "react";
import type { FormInstance, FormProps } from "antd";
import type { Observable } from "@/types/store";

export interface DrawerFormProps<Values> {
  title: string;
  visible: boolean;
  actions?: ReactElement;
  className?: string;
  form?: FormInstance<Values>;
  layout?: "horizontal" | "vertical";
  hideRequiredMark?: boolean;
  formStore?: Observable;
  loading?: boolean;
  style?: CSSProperties;
  width?: number;
  submitDisabled?: boolean;
  footer?: ReactNode;
  onClose?: () => void;
  onSubmit?: () => void;
  validateTrigger?: string | string[];
  onFieldsChange?: FormProps["onFieldsChange"];
  onValuesChange?: FormProps["onValuesChange"];
}

const DrawerForm = <T extends object = any>({
  actions,
  className,
  layout,
  title,
  style,
  visible,
  hideRequiredMark,
  children,
  form,
  formStore,
  loading,
  width = 500,
  submitDisabled,
  footer,
  onClose,
  onSubmit,
  onFieldsChange,
  onValuesChange,
  validateTrigger
}: PropsWithChildren<DrawerFormProps<T>>) => {
  const { t } = useConfig();

  const unwatchForm = useMemo(() => {
    if (!formStore || !formStore.watch) {
      return () => void 0;
    }

    return formStore.watch(state => {
      form?.setFieldsValue(state);
    });
  }, [form, formStore]);

  useEffect(() => {
    return () => {
      unwatchForm();
    };
  }, [unwatchForm]);

  const handleFormClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleFormSubmit = useCallback(async () => {
    try {
      if (form) await form.validateFields();
      onSubmit?.();
    } catch {
      // Do not submit until the form is valid
    }
  }, [form, onSubmit]);

  const internalActions = useMemo(() => {
    return actions ? (
      actions
    ) : (
      <>
        <Button onClick={handleFormClose} title={t("CANCEL_BTN_TITLE")}>
          {t("CANCEL")}
        </Button>
        <Button
          onClick={handleFormSubmit}
          type="primary"
          disabled={submitDisabled}
        >
          {t("SUBMIT")}
        </Button>
      </>
    );
  }, [actions, handleFormClose, t, handleFormSubmit, submitDisabled]);

  return (
    <Drawer
      title={title}
      style={style}
      size={window.innerWidth < width ? window.innerWidth : width}
      onClose={handleFormClose}
      open={visible}
      actions={internalActions}
      className={clsx("drawer-form", className)}
    >
      <Form
        layout={layout ?? "vertical"}
        colon={false}
        form={form}
        onFinish={handleFormSubmit}
        className="entity-form"
        requiredMark={hideRequiredMark}
        validateTrigger={validateTrigger}
        onFieldsChange={onFieldsChange}
        onValuesChange={onValuesChange}
      >
        <Loader loading={loading}>{children}</Loader>
      </Form>
      {footer}
    </Drawer>
  );
};

export default DrawerForm;
