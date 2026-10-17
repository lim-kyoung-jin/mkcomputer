/* 원래 히어로 프레임과 모든 문구를 유지하고 컴퓨터 그림만 교체합니다. */
(() => {
  'use strict';
  const art = document.querySelector('.hero-art');
  const original = art && art.querySelector('svg.pc-hero');
  if (!original) return;
  const image = new Image();
  image.alt = 'MK컴퓨터 조립 컴퓨터';
  image.decoding = 'async';
  image.className = 'pc-hero managed-pc-photo';
  Object.assign(image.style, {
    position: 'absolute', left: '12%', top: '15%',
    width: '76%', height: '74%', objectFit: 'contain',
    filter: 'drop-shadow(0 15px 12px rgba(48,77,51,.16))', zIndex: '0'
  });
  const base = 'https://gmvwhsigslrywkjusxlm.supabase.co/storage/v1/object/public/website-images/hero/';
  let triedLegacy = false;
  image.onload = () => {
    original.style.display = 'none';
    art.insertBefore(image, original);
    // 카드와 레이블은 기존 위치에서 항상 사진 위에 표시합니다.
    art.querySelectorAll('.floating-tag, .art-label, .art-number').forEach(el => {
      el.style.zIndex = '2';
    });
  };
  image.onerror = () => {
    if (!triedLegacy) {
      triedLegacy = true;
      image.src = base + 'main.jpg?v=' + Date.now();
    }
    // 아직 등록된 사진이 없으면 원래 컴퓨터 일러스트를 유지합니다.
  };
  image.src = base + 'main.png?v=' + Date.now();
})();
