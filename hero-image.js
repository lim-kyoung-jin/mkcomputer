/* 관리자 사진의 비율을 유지하고 여백은 부드러운 사진 배경으로 채웁니다. */
(() => {
  'use strict';
  const art = document.querySelector('.hero-art');
  if (!art) return;
  const image = new Image();
  image.alt = 'MK컴퓨터 홈페이지 대표 사진';
  image.decoding = 'async';
  image.onload = () => {
    const backdrop = document.createElement('div');
    backdrop.setAttribute('aria-hidden', 'true');
    Object.assign(backdrop.style, {
      position: 'absolute', inset: '-32px',
      backgroundImage: 'url("' + image.src + '")',
      backgroundSize: 'cover', backgroundPosition: 'center',
      filter: 'blur(24px) saturate(0.7)', opacity: '0.55', zIndex: '0'
    });
    const wash = document.createElement('div');
    wash.setAttribute('aria-hidden', 'true');
    Object.assign(wash.style, {
      position: 'absolute', inset: '0',
      background: 'linear-gradient(135deg, rgba(247,248,242,.35), rgba(24,59,51,.12))',
      zIndex: '1'
    });
    const frame = document.createElement('div');
    Object.assign(frame.style, {
      position: 'absolute', inset: '18px', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: '2'
    });
    Object.assign(image.style, {
      display: 'block', width: 'auto', height: 'auto',
      maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
      borderRadius: '14px', boxShadow: '0 12px 36px rgba(15,35,26,.2)'
    });
    for (const child of Array.from(art.children)) child.style.display = 'none';
    art.style.borderRadius = '24px';
    art.style.backgroundColor = '#e5e9de';
    frame.appendChild(image);
    art.appendChild(backdrop);
    art.appendChild(wash);
    art.appendChild(frame);
  };
  image.onerror = () => { /* 등록 전과 연결 실패 시 기본 일러스트를 유지합니다. */ };
  image.src = 'https://gmvwhsigslrywkjusxlm.supabase.co/storage/v1/object/public/website-images/hero/main.jpg?v=' + Date.now();
})();
