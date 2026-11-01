import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = 'SunPropMart | Real Estate & Construction in Greater Noida & Delhi NCR';
const DEFAULT_DESCRIPTION =
  'SunPropMart is a premier corporate real estate and heavy civil construction firm offering verified residential apartments, luxury villas, commercial plots, and government public works in Greater Noida and Delhi NCR.';
const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80';
const SITE_NAME = 'SunPropMart Real Estate & Construction';
const BASE_URL = 'https://sunpropmart.in';

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  publishedTime,
  modifiedTime,
  author,
  structuredData,
}) => {
  useEffect(() => {
    // 1. Update Document Title
    const fullTitle = title
      ? title.includes('SunPropMart')
        ? title
        : `${title} | SunPropMart`
      : DEFAULT_TITLE;
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to update or create link tags
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 3. Canonical URL
    const canonical = canonicalUrl || (typeof window !== 'undefined' ? window.location.href.split('?')[0] : BASE_URL);
    setLinkTag('canonical', canonical);

    // 4. OpenGraph Tags
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:url', canonical);

    if (publishedTime) setMetaTag('property', 'article:published_time', publishedTime);
    if (modifiedTime) setMetaTag('property', 'article:modified_time', modifiedTime);
    if (author) setMetaTag('property', 'article:author', author);

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. JSON-LD Structured Data
    const scriptId = 'sunpropmart-jsonld-dynamic';
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }

    // Default Organization & Website Schema
    const baseSchemas: Array<Record<string, any>> = [
      {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        '@id': `${BASE_URL}/#organization`,
        name: 'SunPropMart Real Estate & Construction',
        url: BASE_URL,
        logo: `${BASE_URL}/assets/aistudio/WhatsApp_Image_2026-10-30_at_6.24.56_PM_70f77bb9.jpeg`,
        image: DEFAULT_OG_IMAGE,
        description: DEFAULT_DESCRIPTION,
        telephone: '+91 98730 83899',
        email: 'info@sunpropmart.in',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'F-2, Krishna Plaza, Upper HDFC Bank, Alpha-I Commercial Belt',
          addressLocality: 'Greater Noida',
          addressRegion: 'Uttar Pradesh',
          postalCode: '201310',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 28.4744,
          longitude: 77.504,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:00',
            closes: '19:00',
          },
        ],
        priceRange: '₹₹₹',
        areaServed: ['Greater Noida', 'Greater Noida West', 'Noida', 'Yamuna Expressway', 'Ghaziabad', 'Delhi NCR'],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'SunPropMart',
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE_URL}/properties?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ];

    if (structuredData) {
      if (Array.isArray(structuredData)) {
        baseSchemas.push(...structuredData);
      } else {
        baseSchemas.push(structuredData);
      }
    }

    scriptElement.textContent = JSON.stringify(baseSchemas);
  }, [
    title,
    description,
    canonicalUrl,
    ogImage,
    ogType,
    noIndex,
    publishedTime,
    modifiedTime,
    author,
    structuredData,
  ]);

  return null;
};
