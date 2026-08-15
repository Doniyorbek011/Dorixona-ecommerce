import React, { useEffect } from 'react';

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  schemaJson,
}) {
  useEffect(() => {
    // 1. Set document title
    const fullTitle = title
      ? `${title} | Apteka - Online Dorixona`
      : 'Apteka - Online Dorixona | Sifatli Dori-Darmonlar';
    document.title = fullTitle;

    // 2. Set or update meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      if (!content) return;
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) {
          el.setAttribute('property', name);
        } else {
          el.setAttribute('name', name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const defaultDesc =
      'Apteka — sifatli va sertifikatlangan dori-darmonlar, vitaminlar, tibbiy texnika va kosmetika vositalarini tezkor yetkazib beruvchi zamonaviy online dorixona.';
    const metaDesc = description || defaultDesc;
    const metaImage =
      image ||
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80';
    const canonicalUrl = url || window.location.href;

    // Basic Meta
    updateMetaTag('description', metaDesc);

    // Open Graph
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', metaDesc, true);
    updateMetaTag('og:image', metaImage, true);
    updateMetaTag('og:url', canonicalUrl, true);
    updateMetaTag('og:type', type, true);

    // 3. Structured Data JSON-LD
    let scriptTag = document.getElementById('schema-json-ld');
    if (schemaJson) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'schema-json-ld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaJson);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Clean up JSON-LD on unmount
      const existingScript = document.getElementById('schema-json-ld');
      if (existingScript) existingScript.remove();
    };
  }, [title, description, image, url, type, schemaJson]);

  return null;
}
