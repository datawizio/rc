import { useCallback, type FC } from "react";
import { Result } from "antd";
import { useConfig } from "@/hooks";
import { ForbiddenIcon } from "@/components/Icons/ForbiddenIcon";
import Button from "@/components/Button";

export interface ForbiddenProps {
  backUrl: string;
  btnText?: string;
}

const Forbidden: FC<ForbiddenProps> = ({ backUrl, btnText }) => {
  const { translate } = useConfig();

  const handleButtonClick = useCallback(() => {
    window.location.href = backUrl;
    window.localStorage.removeItem("datawiz_auth_refresh_token");
    window.localStorage.removeItem("datawiz_auth_access_token");
  }, [backUrl]);

  return (
    <div className="result-container">
      <Result
        icon={<ForbiddenIcon />}
        subTitle={translate("SERVICE_FORBIDDEN")}
        extra={
          <Button type="primary" onClick={handleButtonClick}>
            {btnText ?? translate("BACK_TO_ACCOUNT")}
          </Button>
        }
      />
    </div>
  );
};

export default Forbidden;
