"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ContentfulLivePreview } from "@contentful/live-preview";
import {
  ContentfulLivePreviewProvider,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";

import { defaultLocale, Locale } from "@aces/i18n";
import { useGetLocale } from "@aces/hooks";
import { RouteDirectory } from "@aces/types";
import { estimateReadTime, formatDate } from "@aces/utils";
import { palette, shape, typography } from "@aces/theme";
import {
  Box,
  Breadcrumbs,
  Container,
  Divider,
  FlexBox,
  H3,
  H6,
  Icon,
  InlineBox,
  Link,
  Text,
} from "@aces/ui";
import { CfImageCoverClient, CfRichTextRenderClient } from "@aces/cf";
import {
  ArticleFeatures,
  ArticleTags,
  AuthorBlock,
  SocialShareToolbar,
} from "@aces/features";

import { fetchArticlePageDataPreview } from "./services";

interface ArticlePreviewClientProps {
  slug: string;
}

const PreviewBreadcrumbs = ({
  article,
  lang,
}: {
  article: { slug: string; title: string };
  lang: Locale;
}) => {
  const { t, loading } = useGetLocale(lang, "common");
  if (loading || !t) return null;

  return (
    <Breadcrumbs marginY={7}>
      <InlineBox
        style={{
          fontSize: typography.caption2.fontSize,
          color: palette.primary.main,
        }}
      >
        <Link href={RouteDirectory.Homepage}>{t.breadcrumbs.home}</Link>
      </InlineBox>
      <InlineBox
        style={{
          fontSize: typography.caption2.fontSize,
          color: palette.primary.main,
        }}
      >
        <Link href={RouteDirectory.Articles} aria-current="page">
          {t.breadcrumbs.articles}
        </Link>
      </InlineBox>
      <InlineBox
        style={{
          fontSize: typography.caption2.fontSize,
          color: palette.grey[500],
          pointerEvents: "none",
        }}
      >
        <Link href={`${RouteDirectory.Articles}/${article.slug}`}>
          {article.title}
        </Link>
      </InlineBox>
    </Breadcrumbs>
  );
};

const PreviewBackToListing = ({ lang }: { lang: Locale }) => {
  const { t, loading } = useGetLocale(lang, "common");
  if (loading || !t) return null;

  return (
    <Link href={RouteDirectory.Articles} color="primary">
      <Icon icon="ChevronLeft" />
      {t.postType.backToArticleListing}
    </Link>
  );
};

const ArticlePreviewBody = ({ slug }: ArticlePreviewClientProps) => {
  const params = useParams();
  let langParam = params.lang || defaultLocale;
  if (Array.isArray(langParam)) langParam = langParam[0];
  const lang = langParam as Locale;

  const [pageData, setPageData] = useState<any>(null);
  const { t } = useGetLocale(lang, "common");

  useEffect(() => {
    if (slug) {
      fetchArticlePageDataPreview(slug, lang)
        .then(setPageData)
        .catch(console.error);
    }
  }, [slug, lang]);

  const updatedArticle = useContentfulLiveUpdates(pageData);
  const article = updatedArticle || pageData;

  if (!article) return null;

  const readTime = estimateReadTime(article.bodyCopy?.json || null);
  const templateRailsWidth = "240px";

  return (
    <Container>
      <PreviewBreadcrumbs
        article={{ slug: article.slug, title: article.title }}
        lang={lang}
      />
      {article.featuredImage?.sys?.id && (
        <CfImageCoverClient
          id={article.featuredImage.sys.id}
          lang={lang}
          preview={true}
          borderRadius={shape.borderRadius}
          coverWidth="100%"
          coverHeight={{ xs: "320px", md: "580px" }}
          nested={true}
        />
      )}
      <FlexBox flexDirection={{ xs: "column", lg: "row" }}>
        <FlexBox
          flexDirection="column"
          justifyContent="space-between"
          width={{ xs: "100%", lg: templateRailsWidth }}
          paddingTop={8}
        >
          {ArticleFeatures.ShowSocialShare && (
            <SocialShareToolbar
              url={`${process.env.NEXT_PUBLIC_SITE_URL}${RouteDirectory.Articles}/${slug}`}
              hideXTwitter
            />
          )}
          <Box display={{ xs: "none", lg: "block" }}>
            <PreviewBackToListing lang={lang} />
          </Box>
        </FlexBox>
        <Container maxWidth="md" nested style={{ flex: 1 }}>
          <Box marginTop={8}>
            <FlexBox flexDirection={{ xs: "column", sm: "row" }} gap={2}>
              <FlexBox flexDirection={{ xs: "column" }} marginBottom={5}>
                {article.author && (
                  <Box marginRight={8} marginBottom={2}>
                    <Text
                      {...ContentfulLivePreview.getProps({
                        entryId: article.sys.id,
                        fieldId: "author",
                        locale: lang,
                      })}
                    >
                      {t ? `${t.by} ` : ""} <b>{article.author.name}</b>
                    </Text>
                  </Box>
                )}
                <FlexBox>
                  <H6
                    component="p"
                    color={palette.grey[500]}
                    {...ContentfulLivePreview.getProps({
                      entryId: article.sys.id,
                      fieldId: "publishDate",
                      locale: lang,
                    })}
                  >
                    {formatDate(article.publishDate, lang)}
                  </H6>
                  <Box marginLeft={{ xs: 8 }}>
                    <H6 component="p" color={palette.grey[500]}>
                      {t
                        ? `${readTime.readTimeMinutes} ${t.postType.min} ${t.postType.read}`
                        : `${readTime.readTimeMinutes} min read`}
                    </H6>
                  </Box>
                </FlexBox>
              </FlexBox>
            </FlexBox>
            <H3
              component="h1"
              {...ContentfulLivePreview.getProps({
                entryId: article.sys.id,
                fieldId: "title",
                locale: lang,
              })}
            >
              {article.title}
            </H3>
            {article.categoriesCollection?.items && (
              <ArticleTags
                categoriesCollection={article.categoriesCollection}
                {...ContentfulLivePreview.getProps({
                  entryId: article.sys.id,
                  fieldId: "categories",
                  locale: lang,
                })}
              />
            )}
          </Box>
          <Box marginY={8}>
            {article.bodyCopy?.json && (
              <CfRichTextRenderClient
                richTextDocument={article.bodyCopy.json}
                preview={true}
                lang={lang}
                {...ContentfulLivePreview.getProps({
                  entryId: article.sys.id,
                  fieldId: "bodyCopy",
                  locale: lang,
                })}
              />
            )}
            {article.author && (
              <>
                <Divider marginY={16} marginX={{ xs: 2, md: 18 }} />
                <AuthorBlock
                  profileImage={article.author.profileImage}
                  name={article.author.name}
                  role={article.author.role}
                />
              </>
            )}
          </Box>
        </Container>
        <Box width={{ xs: "100%", lg: templateRailsWidth }}>
          <FlexBox justifyContent="center" display={{ xs: "flex", lg: "none " }}>
            <PreviewBackToListing lang={lang} />
          </FlexBox>
        </Box>
      </FlexBox>
    </Container>
  );
};

export default function ArticlePreviewClient({
  slug,
}: ArticlePreviewClientProps) {
  const params = useParams();
  let langParam = params.lang || defaultLocale;
  if (Array.isArray(langParam)) langParam = langParam[0];

  return (
    <ContentfulLivePreviewProvider locale={langParam as string}>
      <ArticlePreviewBody slug={slug} />
    </ContentfulLivePreviewProvider>
  );
}
