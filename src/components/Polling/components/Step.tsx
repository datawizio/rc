import Text from "../templates/Text";
import Marks from "../templates/Marks.tsx";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Col } from "antd";

import type { FC } from "react";
import type { StepProps } from "../types";

const Step: FC<StepProps> = ({ step, ...props }) => {
  const { t } = useTranslation();

  const template = useMemo(() => {
    switch (step.feedback_type) {
      case "mark":
        return <Marks step={step} {...props} />;
      case "text":
        return <Text step={step} {...props} />;
      default:
        return null;
    }
  }, [props, step]);

  return (
    <>
      <Col xs={24} lg={12} xl={8}>
        <p className="polling-question">{t(step.question_key)}</p>
      </Col>
      <Col xs={24} lg={12} xl={16}>
        <div className="polling-form">{template}</div>
      </Col>
    </>
  );
};

export default Step;
