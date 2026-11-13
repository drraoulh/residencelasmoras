import { useEffect } from 'react';
import { SITE, absoluteUrl } from '../config/seo';

export interface PageMetaInput {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function removeJsonLd(id: string) {
  document.getElementById(id)?.remove();
}

function injectJsonLd(id: string, data: Record<string, unknown> | Record<string, unknown>[]) {
  removeJsonLd(id);
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export function usePageMeta({
  title,
  description,
  path,
  ogImage = SITE.ogImage,
  noIndex = false,
  jsonLd,
}: PageMetaInput) {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    document.title = title;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    upsertMeta('name', 'keywords', SITE.keywords);

    const canonical = path ? absoluteUrl(path) : absoluteUrl(window.location.pathname);
    upsertLink('canonical', canonical);

    const imageUrl = ogImage.startsWith('http') ? ogImage : absoluteUrl(ogImage);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE.name);
    upsertMeta('property', 'og:locale', SITE.locale);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', imageUrl);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', imageUrl);

    const jsonLdId = 'page-json-ld';
    if (jsonLd) {
      injectJsonLd(jsonLdId, jsonLd);
    } else {
      removeJsonLd(jsonLdId);
    }

    return () => {
      document.title = SITE.defaultTitle;
      upsertMeta('name', 'description', SITE.defaultDescription);
      upsertMeta('name', 'robots', 'index, follow');
      upsertLink('canonical', absoluteUrl('/'));
      removeJsonLd(jsonLdId);
    };
  }, [title, description, path, ogImage, noIndex, jsonLdKey, jsonLd]);
}
