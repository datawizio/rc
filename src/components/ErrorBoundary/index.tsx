import Button from "@/components/Button";
import ConfigContext from "@/components/ConfigProvider/context";
import { Component } from "react";
import { Result } from "antd";
import { OopsIcon } from "@/components/Icons/OopsIcon";
import { RefreshIcon } from "@/components/Icons/RefreshIcon";
import { openChat } from "@/utils/chat";

import type { PropsWithChildren } from "react";
import type { ConfigContextValue } from "@/components/ConfigProvider/context";

export type ErrorBoundaryState = {
  hasError: boolean;
  eventId: string;
  error: any;
  errorInfo: any;
  chunkError: boolean;
};

export type ErrorBoundaryProps = PropsWithChildren<{
  onError: (error: any, errorInfo: any) => Promise<string>;
  onReportFeedbackClick?: (eventId: string) => void;
}>;

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      eventId: "",
      error: "",
      errorInfo: "",
      chunkError: false
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  async componentDidCatch(error: any, errorInfo: any) {
    if (
      error.toString().includes("ChunkLoadError") ||
      error.toString().includes("Loading CSS chunk") ||
      error.toString().includes("Failed to fetch")
    ) {
      this.setState({ chunkError: true });
      return;
    }
    const eventId = await this.props.onError(error, errorInfo);
    this.setState({ eventId, error, errorInfo });
  }

  handlerButtonClick = () => {
    openChat(
      this.state.error.stack,
      this.state.errorInfo.componentStack,
      this.state.error.eventId
    );

    this.props.onReportFeedbackClick?.(this.state.eventId);
  };

  handlerRefreshClick = () => {
    window.location.reload();
  };

  render() {
    const ctx = this.context as ConfigContextValue;

    if (this.state.chunkError) {
      return (
        <Result
          icon={<RefreshIcon />}
          title={ctx.t("NEED_REFRESH")}
          extra={
            <Button type="primary" onClick={this.handlerRefreshClick}>
              {ctx.t("REFRESH")}
            </Button>
          }
        />
      );
    }
    if (this.state.hasError) {
      return (
        <Result
          icon={<OopsIcon />}
          title={ctx.t("SOMETHING_WENT_WRONG")}
          extra={
            <Button type="primary" onClick={this.handlerButtonClick}>
              {ctx.t("REPORT_FEEDBACK")}
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.contextType = ConfigContext;
