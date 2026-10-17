/* 기존 상단 틀과 문구를 유지하면서 공개 상품 사진을 순환합니다. */
(() => {
  'use strict';
  const art = document.querySelector('.hero-art');
  const original = art && art.querySelector('svg.pc-hero');
  if (!original) return;
  const layer = document.createElement('div');
  layer.className = 'managed-pc-layer';
  Object.assign(layer.style, {
    position: 'absolute', left: '12%', top: '15%', width: '76%', height: '74%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '0'
  });
  art.insertBefore(layer, original);
  art.querySelectorAll('.floating-tag, .art-label, .art-number').forEach(el => { el.style.zIndex = '2'; });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const transitionMs = 1400;
  const slideIntervalMs = 5500;
  const base = 'https://gmvwhsigslrywkjusxlm.supabase.co/storage/v1/object/public/website-images/hero/';
  const edgeMask = 'linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)';
  let active = null;
  let currentSource = '';
  let requestId = 0;
  const photos = () => {
    const seen = new Set();
    return [...document.querySelectorAll('.product[data-category] .product-art img')]
      .filter(img => img.complete && img.naturalWidth > 0)
      .filter(img => { const key = img.src.split('?')[0]; if (seen.has(key)) return false; seen.add(key); return true; });
  };
  function show(src, alt, fallback = false) {
    if (src === currentSource) return;
    const token = ++requestId;
    const image = new Image();
    image.alt = alt;
    image.decoding = 'async';
    image.className = 'managed-pc-photo';
    Object.assign(image.style, {
      position: 'absolute', display: 'block', width: 'auto', height: 'auto',
      maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', opacity: '0',
      transition: reducedMotion.matches ? 'none' : 'opacity ' + transitionMs + 'ms cubic-bezier(.4, 0, .2, 1)',
      willChange: 'opacity', pointerEvents: 'none',
      maskImage: edgeMask, maskSize: '100% 100%', maskRepeat: 'no-repeat', maskComposite: 'intersect',
      webkitMaskImage: edgeMask, webkitMaskSize: '100% 100%', webkitMaskRepeat: 'no-repeat', webkitMaskComposite: 'source-in'
    });
    image.onload = async () => {
      // 디코딩과 첫 화면 준비가 끝난 다음 전환해야 첫 프레임이 튀지 않습니다.
      try { await image.decode(); } catch { /* 이미 로드된 이미지는 그대로 표시합니다. */ }
      if (token !== requestId || (fallback && photos().length)) return;
      const previous = active;
      active = image;
      currentSource = src;
      layer.appendChild(image);
      original.style.display = 'none';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (active !== image) return;
          image.style.opacity = '1';
          if (previous) previous.style.opacity = '0';
          if (previous) setTimeout(() => previous.remove(), reducedMotion.matches ? 0 : transitionMs + 100);
        });
      });
    };
    image.onerror = () => {
      if (token === requestId && fallback && src.includes('main.png')) show(base + 'main.jpg?v=' + Date.now(), alt, true);
    };
    image.src = src;
  }
  function advance() {
    if (document.hidden) return;
    const items = photos();
    if (!items.length) return;
    const index = items.findIndex(img => img.src === currentSource);
    const next = items[(index + 1) % items.length];
    show(next.src, next.alt);
  }
  show(base + 'main.png?v=' + Date.now(), 'MK컴퓨터 조립 컴퓨터', true);
  // 카드의 필터 선택과 관계없이 모든 공개 상품의 등록 사진을 순환합니다.
  document.addEventListener('mk-product-image-ready', () => {
    if (!photos().some(img => img.src === currentSource)) advance();
  });
  setInterval(advance, slideIntervalMs);
})();


