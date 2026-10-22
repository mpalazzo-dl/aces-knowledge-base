import { Col, FlexBox, Skeleton } from "@aces/ui";

export const ResourceCardSkeleton = () => (
  <FlexBox flexDirection="column" width="100%" gap={2}>
    <Skeleton variant="rectangular" height={200} />
    <Skeleton variant="text" width="40%" />
    <Skeleton variant="text" width="90%" />
    <Skeleton variant="text" width="70%" />
  </FlexBox>
);

export const ResourceListingSkeleton = ({ limit = 8 }: { limit?: number }) => (
  <>
    {Array.from({ length: limit }).map((_, index) => (
      <Col key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <ResourceCardSkeleton />
      </Col>
    ))}
  </>
);
