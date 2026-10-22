import { Box, Skeleton } from "@aces/ui";

export const ResourceEmbedSkeleton = () => (
  <Box maxWidth={420} marginY={4}>
    <Skeleton variant="rectangular" height={320} />
  </Box>
);
