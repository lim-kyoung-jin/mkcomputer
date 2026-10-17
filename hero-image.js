/* 원래 문구와 카드를 유지하고 사진 가장자리를 배경에 부드럽게 섞습니다. */
(() => {
  'use strict';
  const art = document.querySelector('.hero-art');
  const original = art && art.querySelector('svg.pc-hero');
  if (!original) return;
  const image = new Image();
  image.alt = 'MK컴퓨터 조립 컴퓨터';
  image.decoding = 'async';
  image.className = 'managed-pc-photo';
  const edgeMask = 'linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)';
  Object.assign(image.style, {
    display: 'block', width: 'auto', height: 'auto',
    maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
    maskImage: edgeMask, maskSize: '100% 100%', maskRepeat: 'no-repeat',
    maskComposite: 'intersect',
    webkitMaskImage: edgeMask, webkitMaskSize: '100% 100%',
    webkitMaskRepeat: 'no-repeat', webkitMaskComposite: 'source-in'
  });
  const base = 'https://gmvwhsigslrywkjusxlm.supabase.co/storage/v1/object/public/website-images/hero/';
  let triedLegacy = false;
  image.onload = () => {
    const layer = document.createElement('div');
    layer.className = 'managed-pc-layer';
    Object.assign(layer.style, {
      position: 'absolute', left: '12%', top: '15%', width: '76%', height: '74%',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '0'
    });
    layer.appendChild(image);
    original.style.display = 'none';
    art.insertBefore(layer, original);
    art.querySelectorAll('.floating-tag, .art-label, .art-number').forEach(el => {
      el.style.zIndex = '2';
    });
  };
  image.onerror = () => {
    if (!triedLegacy) {
      triedLegacy = true;
      image.src = base + 'main.jpg?v=' + Date.now();
    }
  };
  image.src = base + 'main.png?v=' + Date.now();
})();
