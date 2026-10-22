"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { palette, shape } from "@aces/theme";
import { Box, FlexBox, Icon, IconButton, Skeleton, Text } from "@aces/ui";

import { ResourceLabels } from "../labels";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const MinScale = 0.5;
const MaxScale = 2.5;
const ScaleStep = 0.25;

/** Tracks an element's rendered width so PDF pages fit their container. */
const useElementWidth = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.floor(entry.contentRect.width)),
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
};

interface PdfViewerProps {
  url: string;
  labels: ResourceLabels;
  maxHeight?: number | string;
}

export const PdfViewer = ({
  url,
  labels,
  maxHeight = "80vh",
}: PdfViewerProps) => {
  const { ref, width } = useElementWidth();
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <Text.Small>{labels.preview.error}</Text.Small>;
  }

  return (
    <FlexBox flexDirection="column" width="100%" gap={3}>
      <FlexBox
        alignItems="center"
        justifyContent="space-between"
        paddingX={2}
        style={{ flexWrap: "wrap", gap: 2 }}
      >
        <FlexBox alignItems="center" gap={1}>
          <IconButton
            size="small"
            aria-label={labels.preview.previous}
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((page) => page - 1)}
          >
            <Icon icon="ArrowLeft" size={24} />
          </IconButton>
          <Text.Small>
            {`${labels.preview.page} ${numPages ? pageNumber : "–"} / ${numPages || "–"}`}
          </Text.Small>
          <IconButton
            size="small"
            aria-label={labels.preview.next}
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((page) => page + 1)}
          >
            <Icon icon="ArrowRight" size={24} />
          </IconButton>
        </FlexBox>
        <FlexBox alignItems="center" gap={1}>
          <IconButton
            size="small"
            aria-label={labels.preview.zoomOut}
            disabled={scale <= MinScale}
            onClick={() => setScale((value) => value - ScaleStep)}
          >
            <Icon icon="Remove" size={20} />
          </IconButton>
          <Text.Small>{`${Math.round(scale * 100)}%`}</Text.Small>
          <IconButton
            size="small"
            aria-label={labels.preview.zoomIn}
            disabled={scale >= MaxScale}
            onClick={() => setScale((value) => value + ScaleStep)}
          >
            <Icon icon="Add" size={20} />
          </IconButton>
        </FlexBox>
      </FlexBox>
      <Box
        ref={ref}
        borderRadius={shape.borderRadius}
        style={{
          backgroundColor: palette.grey[100],
          overflow: "auto",
          maxHeight,
          display: "flex",
          justifyContent: scale > 1 ? "flex-start" : "center",
          padding: 2,
        }}
      >
        <Document
          file={url}
          onLoadSuccess={({ numPages: total }) => setNumPages(total)}
          onLoadError={() => setHasError(true)}
          loading={<Skeleton variant="rectangular" width="100%" height={600} />}
        >
          {width > 0 && (
            <Page
              pageNumber={pageNumber}
              width={Math.max(width - 16, 200)}
              scale={scale}
              loading={
                <Skeleton
                  variant="rectangular"
                  width={width - 16}
                  height={600}
                />
              }
            />
          )}
        </Document>
      </Box>
    </FlexBox>
  );
};

interface PdfThumbnailProps {
  url: string;
  height: number;
}

/** First page of a PDF, rendered only once the card scrolls into view. */
export const PdfThumbnail = ({ url, height }: PdfThumbnailProps) => {
  const { ref, width } = useElementWidth();
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return (
    <Box
      ref={ref}
      width="100%"
      height={height}
      style={{ overflow: "hidden", display: "flex", justifyContent: "center" }}
    >
      {isVisible && width > 0 && !hasError ? (
        <Document
          file={url}
          onLoadError={() => setHasError(true)}
          loading={
            <Skeleton variant="rectangular" width={width} height={height} />
          }
        >
          <Page
            pageNumber={1}
            width={width}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={
              <Skeleton variant="rectangular" width={width} height={height} />
            }
          />
        </Document>
      ) : (
        <Skeleton variant="rectangular" width="100%" height={height} />
      )}
    </Box>
  );
};
