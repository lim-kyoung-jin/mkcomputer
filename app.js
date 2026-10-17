(() => {
  'use strict';
  const config = window.MK_CONFIG;
  const fallback = { address: '[임시] 실제 매장 주소 입력 예정', phone: '[임시] 전화번호 입력 예정', hours: '[임시] 영업시간 입력 예정' };
  document.querySelectorAll('[data-store]').forEach(el => { el.textContent = config.store[el.dataset.store] || fallback[el.dataset.store]; });
  if (Object.values(config.store).every(Boolean)) document.querySelector('.temporary-note').hidden = true;
  document.getElementById('year').textContent = new Date().getFullYear();
  const pc = (color, i) => `<svg viewBox="0 0 180 220" role="img" aria-label="${['사무용','게이밍','작업용'][i]} PC 예시 일러스트"><path d="m38 37 73-20 39 26-72 23Z" fill="${i === 1 ? '#526555' : '#e7e7dc'}"/><path d="m38 37 40 29v133l-40-29Z" fill="${i === 1 ? '#253d32' : '#b8beb1'}"/><path d="m78 66 72-23v133l-72 23Z" fill="${i === 1 ? '#18382a' : '#f3f2e9'}" stroke="#82917d"/><path d="m46 52 24 18v102l-24-17Z" fill="${i === 1 ? '#152c25' : '#526659'}"/><path d="m50 76 14 10v34l-14-10Z" fill="#c88d63"/><path d="m49 131 17 12v10l-17-12Z" fill="#a8b49a"/>${[92,137].map(y=>`<ellipse cx="114" cy="${y}" rx="24" ry="22" transform="skewY(-17) translate(0 34)" fill="${i === 0 ? '#e3e5db' : '#3d5341'}" stroke="${i === 1 ? '#ed9a66' : '#a4b298'}" stroke-width="4"/><ellipse cx="114" cy="${y}" rx="9" ry="8" transform="skewY(-17) translate(0 34)" fill="#778d72"/>`).join('')}<path d="m85 181 58-18" stroke="#b2bca5" stroke-width="2"/><ellipse cx="138" cy="55" rx="3" ry="2" fill="#df8e5b"/></svg>`;
  const list = document.getElementById('product-list');
  config.products.forEach((p,i) => {
    const article = document.createElement('article'); article.className = 'product'; article.dataset.category = p.category;
    const art = document.createElement('div'); art.className = 'product-art ' + p.color; art.innerHTML = '<span>MK / CUSTOM BUILD 0' + (i+1) + '</span>' + pc(p.color,i); article.append(art);
    const body = document.createElement('div'); body.className='product-body';
    const tag=document.createElement('p'); tag.className='eyebrow';tag.textContent=p.tag;
    const title=document.createElement('h3');title.textContent=p.name;
    const desc=document.createElement('p');desc.textContent=p.desc;
    const ul=document.createElement('ul');p.specs.forEach(s=>{const li=document.createElement('li');li.textContent=s;ul.append(li);});
    const bottom=document.createElement('div');bottom.className='product-bottom';const price=document.createElement('strong');price.textContent='맞춤 견적 상담';const button=document.createElement('button');button.type='button';button.dataset.consult=p.name;button.textContent='구성 상담 ↗';button.setAttribute('aria-label',p.name+' 구성 상담');bottom.append(price,button);body.append(tag,title,desc,ul,bottom);article.append(body);list.append(article);
  });
  const menu=document.querySelector('.menu'), nav=document.getElementById('navigation');
  const closeMenu=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','메뉴 열기');};
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});list.querySelectorAll('.product').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;});}));
  const dialog=document.getElementById('consult-dialog');
  document.querySelectorAll('[data-consult]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();document.getElementById('topic').value=button.dataset.consult;document.getElementById('copy-status').textContent='';dialog.showModal();}));
  document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  const form = document.getElementById('consult-form');
  let submitting = false;
  // 페이지를 열어 둔 동안만 중복을 확인하며 고객 정보를 기기에 저장하지 않습니다.
  const savedSubmissions = new Set();
  const emailedSubmissions = new Set();
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || !form.reportValidity() || form.elements._honey.value) return;
    const status = document.getElementById('copy-status');
    const payload = {
      customer_name: document.getElementById('customer-name').value.trim(),
      email: document.getElementById('customer-email').value.trim(),
      phone: document.getElementById('customer-phone').value.trim() || null,
      service: document.getElementById('topic').value,
      message: document.getElementById('message').value.trim()
    };
    if (!payload.customer_name || !payload.message) {
      status.textContent = '성함과 문의 내용을 입력해 주세요.';
      return;
    }
    const signature = JSON.stringify(payload);
    if (emailedSubmissions.has(signature)) {
      status.textContent = '이미 접수한 내용입니다. 추가 문의는 내용을 변경해 주세요.';
      return;
    }
    submitting = true;
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    try {
      if (!savedSubmissions.has(signature)) {
        status.textContent = '문의 내용을 저장하고 있습니다…';
        const response = await fetch(config.supabase.url + '/rest/v1/inquiries', {
          method: 'POST',
          headers: { apikey: config.supabase.publishableKey, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
          body: signature,
          signal: AbortSignal.timeout(20000)
        });
        if (!response.ok) {
          status.textContent = response.status === 401 || response.status === 403
            ? '저장 권한 설정을 확인해 주세요. 문의는 전송되지 않았습니다.'
            : '저장하지 못했습니다. 잠시 후 다시 시도해 주세요.';
          return;
        }
        savedSubmissions.add(signature);
      }
      status.textContent = '문의가 저장되었습니다. 이메일 알림을 요청하고 있습니다…';
      const mailResponse = await fetch('https://formsubmit.co/ajax/c72unix@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: payload.customer_name,
          email: payload.email,
          phone: payload.phone || '미입력',
          service: payload.service,
          message: payload.message,
          _subject: '[MK컴퓨터] 새로운 고객 상담 문의',
          _template: 'table',
          _url: 'https://lim-kyoung-jin.github.io/mkcomputer/'
        }),
        signal: AbortSignal.timeout(20000)
      });
      const result = await mailResponse.json();
      if (!mailResponse.ok || !(result.success === true || result.success === 'true')) {
        throw new Error('Email request rejected');
      }
      emailedSubmissions.add(signature);
      status.textContent = '문의가 저장되었고 이메일 서비스가 알림 요청을 접수했습니다. 매장에서 확인 후 답변드리겠습니다.';
    } catch (error) {
      status.textContent = savedSubmissions.has(signature)
        ? '문의는 정상 저장됐지만 이메일 알림 요청을 확인하지 못했습니다. 같은 내용으로 다시 누르면 저장을 건너뛰고 이메일만 재시도합니다. 페이지를 새로고침하지 마세요.'
        : '연결 상태를 확인하지 못했습니다. 중복 접수를 피하려면 매장에 접수 여부를 확인해 주세요.';
    } finally {
      submitting = false;
      submit.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
})();
