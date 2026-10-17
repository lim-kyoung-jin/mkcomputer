/* 공개 상품을 DB에서 읽어 기존 카드 틀로 표시합니다. */
(async () => {
  'use strict';
  const config = window.MK_CONFIG;
  if (!config?.supabase || !window.MK_RENDER_PRODUCTS) return;
  const categories = new Set(['office', 'gaming', 'creator']);
  const text = (value, max) => typeof value === 'string' ? value.slice(0, max) : '';
  try {
    const rows = [];
    for (let offset = 0; ; offset += 1000) {
      const response = await fetch(config.supabase.url + '/rest/v1/website_products?select=id,category,name,tag,description,spec1,spec2,spec3,price_text,image_slot&is_public=eq.true&order=sort_order.asc,created_at.asc,id.asc&limit=1000&offset=' + offset, {
        headers: { apikey: config.supabase.publishableKey, Accept: 'application/json' },
        cache: 'no-store', signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) return;
      const page = await response.json();
      if (!Array.isArray(page)) return;
      rows.push(...page);
      if (page.length < 1000) break;
    }
    const products = rows.filter(row => categories.has(row.category) && typeof row.name === 'string' && row.name.trim()).map(row => ({
      id: text(row.id,80), category: row.category, name:text(row.name,80), tag:text(row.tag,80), desc:text(row.description,300),
      specs:[row.spec1,row.spec2,row.spec3].map(value=>text(value,150)), price:text(row.price_text,80), imageSlot:text(row.image_slot,80),
      color: row.category === 'gaming' ? 'green' : row.category === 'creator' ? 'peach' : 'sand'
    }));
    window.MK_RENDER_PRODUCTS(products);
  } catch { /* 설정 전 또는 연결 실패 시 기존 예시 카드를 유지합니다. */ }
})();

