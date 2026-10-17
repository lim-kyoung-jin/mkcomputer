/* 사무·일상 카드의 글자를 공개 상품 테이블에서 읽어 기존 카드 틀로 표시합니다. */
(async () => {
  'use strict';
  const config = window.MK_CONFIG;
  if (!config?.supabase || !window.MK_RENDER_PRODUCTS) return;
  try {
    const response = await fetch(config.supabase.url + '/rest/v1/website_products?select=id,name,tag,description,spec1,spec2,spec3,price_text&category=eq.office&order=id.asc', {
      headers: { apikey: config.supabase.publishableKey, Accept: 'application/json' },
      cache: 'no-store', signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return;
    const rows = await response.json();
    if (!Array.isArray(rows)) return;
    const ids = new Set(['office-1', 'office-2', 'office-3']);
    const valid = rows.filter(row => ids.has(row.id) && typeof row.name === 'string' && row.name.trim());
    const products = config.products.map(product => {
      const row = valid.find(item => item.id === product.id);
      if (!row) return product;
      const text = (value, max) => typeof value === 'string' ? value.slice(0, max) : '';
      return { ...product, name: text(row.name,80), tag:text(row.tag,80), desc:text(row.description,300),
        specs:[row.spec1,row.spec2,row.spec3].map(value=>text(value,150)), price:text(row.price_text,80) };
    });
    window.MK_RENDER_PRODUCTS(products);
  } catch { /* 설정 전/연결 실패 시 기본 카드 3개를 유지합니다. */ }
})();
