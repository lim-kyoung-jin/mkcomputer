/* 추천 PC의 사진만 교체하며 기존 상품 문구와 배경은 유지합니다. */
(() => {
  'use strict';
  const slots = { office: 'product-office', gaming: 'product-gaming', creator: 'product-creator' };
  const base = 'https://gmvwhsigslrywkjusxlm.supabase.co/storage/v1/object/public/website-images/hero/';
  window.MK_APPLY_PRODUCT_IMAGES = () => {
  document.querySelectorAll('.product[data-category]').forEach(card => {
    if (card.dataset.imageRequested) return;
    const id = card.dataset.productId;
    const slot = id === 'office-2' ? 'product-office-2' : id === 'office-3' ? 'product-office-3' : slots[card.dataset.category];
    const art = card.querySelector('.product-art');
    const original = art && art.querySelector('svg');
    if (!slot || !original) return;
    card.dataset.imageRequested = 'true';
    const image = new Image();
    image.alt = (card.querySelector('h3')?.textContent || '추천 조립PC') + ' 제품 이미지';
    image.decoding = 'async';
    Object.assign(image.style, {
      position: 'relative', zIndex: '1', display: 'block',
      width: 'auto', height: 'auto', maxWidth: '82%', maxHeight: '190px', objectFit: 'contain',
      filter: 'drop-shadow(8px 12px 8px rgba(32,52,41,.16))'
    });
    image.onload = () => {
      original.style.display = 'none';
      art.insertBefore(image, original);
    };
    image.onerror = () => { /* 등록하지 않은 상품은 원래 일러스트를 사용합니다. */ };
    image.src = base + slot + '.png?v=' + Date.now();
  });
  };
  window.MK_APPLY_PRODUCT_IMAGES();
})();
