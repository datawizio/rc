import { useConfig } from "@/hooks";
import { formatDateTime } from "@/utils/date";
import type { FC } from "react";

import "./index.less";

export interface StatusDataProps {
  inProcess: boolean;
  lastUpdateDate: string | null;
}

const StatusData: FC<StatusDataProps> = ({ inProcess, lastUpdateDate }) => {
  const { t } = useConfig();

  if (inProcess) {
    return (
      <div className="status-data__container">
        <p>{t("DATA_IN_PROGRESS")}</p>
      </div>
    );
  }

  if (lastUpdateDate) {
    return (
      <div className="status-data__container">
        <p>{formatDateTime(lastUpdateDate, t)}</p>
        <p>{t("LAST_UPDATE_DATA")}</p>
      </div>
    );
  }

  return null;
};

export default StatusData;
