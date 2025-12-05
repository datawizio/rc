import clsx from "clsx";
import React, { useMemo } from "react";
import Loader from "@/components/Loader";
import { Skeleton, Row, Col, Space } from "antd";

export interface SkeletonTableProps {
  loading: boolean;
  skeleton: boolean;
}

const SkeletonTable: React.FC<React.PropsWithChildren<SkeletonTableProps>> = ({
  loading,
  skeleton,
  children
}) => {
  const tableColumns = Array.from(Array(8).keys());
  const tableRows = Array.from(Array(10).keys());

  const className = useMemo(
    () => clsx("skeleton-container", skeleton && "skeleton-container--loading"),
    [skeleton]
  );

  return (
    <div className={className}>
      {skeleton && (
        <Space direction="vertical">
          <Row gutter={8}>
            {tableColumns.map((_, index) => (
              <Col key={index} span={3}>
                <Skeleton.Input active={true} />
              </Col>
            ))}
          </Row>

          {tableRows.map((_, index) => (
            <Row key={index} gutter={8}>
              {tableColumns.map((_, index) => (
                <Col key={index} span={3}>
                  <Skeleton.Input active={true} />
                </Col>
              ))}
            </Row>
          ))}
        </Space>
      )}
      <Loader loading={Boolean(loading) && !skeleton}>{children}</Loader>
    </div>
  );
};

export default React.memo(SkeletonTable);
