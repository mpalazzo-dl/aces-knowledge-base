"use client";

import { useState, useEffect, useRef } from "react";

import { useGetLocale, useQueryParam } from "@aces/hooks";
import { useArticlesState } from "@aces/store";
import { defaultLocale, Locale } from "@aces/i18n";
import { CfCollectionItems } from "@aces/types";
import { toSingleValueArray } from "@aces/utils";
import { Box, Col, Row, Text } from "@aces/ui";

import { fetchArticles } from "./services";
import { ArticleListingSkeleton } from "./skeleton";

import {
  ArticleCard,
  ArticleListCard,
  ArticleCardProps,
} from "../article-card";
import { ArticleListingFilters } from "../article-filters";
import { ArticleListingConfig, OrderTypes, Query } from "../config";
import { LoadMore } from "../../pagination";

export interface ArticleListingProps {
  initialArticles: any[];
  initialTotal: number;
  categoriesCollection: CfCollectionItems;
  allArticlesTotal: number;
  excludedSlugs: string[];
  preview?: boolean;
  lang?: Locale;
}

export const ArticleListing = ({
  initialArticles,
  initialTotal,
  categoriesCollection,
  allArticlesTotal,
  excludedSlugs,
  preview = false,
  lang = defaultLocale,
}: ArticleListingProps) => {
  const { getQueryParam } = useQueryParam();
  const { articleListingDisplay } = useArticlesState();

  const { t, loading } = useGetLocale(lang, "common");

  const [articles, setArticles] = useState(initialArticles);
  const [total, setTotal] = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadingRef = useRef(false);

  const fetchUpdatedArticles = async () => {
    const categoriesParam = getQueryParam(Query.categories)
      ? getQueryParam(Query.categories)
      : null;
    const orderParam = getQueryParam(Query.order)
      ? getQueryParam(Query.order)
      : ArticleListingConfig.DefaultOrder;

    const categories = toSingleValueArray(categoriesParam);
    const order = orderParam as OrderTypes;

    setIsLoading(true);

    try {
      const { items: newArticles, total: updatedTotal } = await fetchArticles(
        categories,
        ArticleListingConfig.ArticlesLimit,
        0,
        order,
        excludedSlugs,
        preview,
        lang,
      );

      setArticles(newArticles);
      setTotal(updatedTotal);
      setHasMore(newArticles.length > 0);
    } catch (error) {
      console.error("Error fetching updated articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdatedArticles();
  }, [getQueryParam(Query.categories), getQueryParam(Query.order)]);

  const loadMoreArticles = async () => {
    if (loadingRef.current || articles.length >= total || !hasMore) return;

    loadingRef.current = true;
    setIsLoadingMore(true);

    try {
      const offset = articles.length;
      const categoriesParam = getQueryParam(Query.categories)
        ? getQueryParam(Query.categories)
        : null;
      const orderParam = getQueryParam(Query.order)
        ? getQueryParam(Query.order)
        : ArticleListingConfig.DefaultOrder;

      const categories = toSingleValueArray(categoriesParam);
      const order = orderParam as OrderTypes;

      const { items: newArticles, total: updatedTotal } = await fetchArticles(
        categories,
        ArticleListingConfig.ArticlesLimit,
        offset,
        order,
        excludedSlugs,
        preview,
        lang,
      );

      setArticles((prev) => [...prev, ...newArticles]);
      setTotal(updatedTotal);
      setHasMore(newArticles.length > 0);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      loadingRef.current = false;
      setIsLoadingMore(false);
    }
  };

  return (
    <Box marginY={8}>
      <ArticleListingFilters
        categoriesCollection={categoriesCollection}
        total={allArticlesTotal}
        lang={lang}
      />
      <Row columnSpacing={5} rowSpacing={7} marginTop={8}>
        {isLoading ? (
          <ArticleListingSkeleton limit={4} />
        ) : (
          <>
            {articles.length ? (
              <>
                {articles.map((item: ArticleCardProps) => (
                  <Col
                    key={item.slug}
                    size={
                      articleListingDisplay === "grid"
                        ? { xs: 12, sm: 6, md: 4, lg: 3 }
                        : { xs: 12 }
                    }
                    style={{ display: "flex" }}
                  >
                    {articleListingDisplay === "grid" ? (
                      <ArticleCard
                        featuredImage={item.featuredImage}
                        title={item.title}
                        excerpt={item.excerpt}
                        bodyCopy={item.bodyCopy}
                        publishDate={item.publishDate}
                        slug={item.slug}
                        lang={lang}
                        preview={preview}
                      />
                    ) : (
                      <ArticleListCard
                        featuredImage={item.featuredImage}
                        title={item.title}
                        excerpt={item.excerpt}
                        bodyCopy={item.bodyCopy}
                        publishDate={item.publishDate}
                        slug={item.slug}
                        lang={lang}
                        preview={preview}
                      />
                    )}
                  </Col>
                ))}
              </>
            ) : (
              <Text.Subtitle marginTop={8} marginBottom={4}>
                {!loading ? t.postType.noResults : ""}
              </Text.Subtitle>
            )}
          </>
        )}
      </Row>
      {isLoadingMore && <ArticleListingSkeleton limit={4} />}
      {total > ArticleListingConfig.ArticlesLimit && (
        <LoadMore
          handleLoadMore={loadMoreArticles}
          currentNumber={articles.length}
          total={total}
          lang={lang}
        />
      )}
    </Box>
  );
};
