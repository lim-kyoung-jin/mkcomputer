/* 관리자 프로그램에서 등록한 홈페이지 대표 사진을 불러옵니다. */
(() => {
  'use strict';
  const art = document.querySelector('.hero-art');
  if (!art) return;
  const image = new Image();
  image.alt = 'MK컴퓨터 홈페이지 대표 사진';
  image.decoding = 'async';
  Object.assign(image.style, {
    position: 'absolute', inset: '0', width: '100%', height: '100%',
    objectFit: 'contain', backgroundColor: '#edf0e7', display: 'block'
  });
  image.onload = () => {
    for (const child of Array.from(art.children)) child.style.display = 'none';
    art.appendChild(image);
  };
  image.onerror = () => { /* 등록 전 또는 연결 실패 시 기존 일러스트를 유지합니다. */ };
  image.src = 'https://gmvwhsigslrywkjusxlm.supabase.co/storage/v1/object/public/website-images/hero/main.jpg?v=' + Date.now();
})();
