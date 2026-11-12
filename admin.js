/* 관리자 모드 (모든 실험실 공통)
   - 오른쪽 위 🔒 버튼 → 비밀번호 → 관리자 패널
   - 수업 화면 모드: 글자 크게 + 전체 화면 + 설명·바닥글 숨김
   - 복사 막기 풀기: 예제 코드 복사 허용 (이 브라우저에서만)
   - 카드 열기/잠그기: 첫 화면(index.html)이 패널에 스위치를 채움
   비밀번호를 바꾸려면 아래 HASH를 새 비밀번호의 SHA-256 값으로 바꾸세요. */
(()=>{
  const HASH='1bab36b66da80acacd1889a2f268a5b8e63ea53a3ee8b4d0463af608826460c9';
  const ls={get(k){try{return localStorage.getItem(k)}catch(e){return null}},
    set(k,v){try{v==null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}}};
  const root=document.documentElement;
  const PL={
    get admin(){return ls.get('pl-admin')==='1'},
    get copyFree(){return this.admin&&ls.get('pl-copyfree')==='1'},
    get present(){return this.admin&&ls.get('pl-present')==='1'}
  };
  window.PL=PL;
  const apply=()=>{root.toggleAttribute('data-admin',PL.admin);root.toggleAttribute('data-copyfree',PL.copyFree);root.toggleAttribute('data-present',PL.present);
    window.dispatchEvent(new CustomEvent('pl-change'))};
  apply();

  const css=`
  .adm-wrap{position:relative;display:inline-flex}
  .adm-btn{font:inherit;cursor:pointer;border-radius:999px;border:1px solid var(--line-strong);background:var(--panel);color:var(--muted);padding:.38em .8em;white-space:nowrap;font-size:.9rem}
  .adm-btn:hover{color:var(--ink);background:var(--accent-soft)}
  html[data-admin] .adm-btn{background:var(--ink);color:var(--bg);border-color:var(--ink);font-weight:700}
  .adm-btn:focus-visible,.adm-pop button:focus-visible,.adm-pop input:focus-visible,.adm-dlg input:focus-visible,.adm-dlg button:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
  .adm-pop{position:absolute;right:0;top:calc(100% + 8px);z-index:60;width:min(330px,calc(100vw - 32px));background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:14px;box-shadow:0 14px 36px rgba(0,0,0,.2);padding:14px;display:flex;flex-direction:column;gap:12px;font-size:.95rem;line-height:1.45}
  .adm-pop h3{margin:0;font-size:1rem}
  .adm-row{display:flex;align-items:center;justify-content:space-between;gap:10px}
  .adm-row small{display:block;color:var(--muted);font-size:.8rem}
  .adm-sw{appearance:none;-webkit-appearance:none;flex:none;width:2.6em;height:1.5em;border-radius:999px;background:var(--line-strong);position:relative;cursor:pointer;transition:background .2s;margin:0}
  .adm-sw::after{content:"";position:absolute;top:.18em;left:.18em;width:1.14em;height:1.14em;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.25)}
  .adm-sw:checked{background:var(--accent)}
  .adm-sw:checked::after{transform:translateX(1.1em)}
  .adm-sec{border-top:1px solid var(--line);padding-top:10px;display:flex;flex-direction:column;gap:8px}
  .adm-sec .gh{font-size:.78rem;font-weight:700;letter-spacing:.06em;color:var(--muted)}
  .adm-pop .adm-act{font:inherit;cursor:pointer;border-radius:8px;border:1px solid var(--line-strong);background:var(--panel);color:var(--ink);padding:.4em .8em}
  .adm-pop .adm-act.primary{background:var(--accent);color:var(--accent-ink);border-color:var(--accent);font-weight:700}
  .adm-note{font-size:.82rem;color:var(--muted);margin:0}
  .adm-dlg{border:1px solid var(--line);border-radius:14px;background:var(--panel);color:var(--ink);padding:18px;width:min(340px,calc(100vw - 32px));box-shadow:0 20px 50px rgba(0,0,0,.3)}
  .adm-dlg::backdrop{background:rgba(10,15,25,.45)}
  .adm-dlg form{display:flex;flex-direction:column;gap:10px;margin:0}
  .adm-dlg h3{margin:0}
  .adm-dlg input{font:inherit;padding:.5em .7em;border-radius:8px;border:1px solid var(--line-strong);background:var(--bg);color:var(--ink)}
  .adm-dlg .err{color:var(--false,#D93A40);font-size:.88rem;min-height:1.2em;margin:0}
  .adm-dlg .btns{display:flex;justify-content:flex-end;gap:8px}
  .adm-dlg button{font:inherit;cursor:pointer;border-radius:8px;border:1px solid var(--line-strong);background:var(--panel);color:var(--ink);padding:.4em .9em}
  .adm-dlg button.primary{background:var(--accent);color:var(--accent-ink);border-color:var(--accent);font-weight:700}
  html[data-copyfree] .nocopy{-webkit-user-select:text!important;user-select:text!important}
  html[data-present]{font-size:22px!important}
  html[data-present] .intro,html[data-present] .lead,html[data-present] .kicker,html[data-present] footer.credit{display:none!important}
  html[data-present] .wrap{max-width:none!important}
  @media (prefers-reduced-motion:reduce){.adm-sw,.adm-sw::after{transition:none}}`;
  const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  async function sha(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}

  function mount(){
    const slot=document.querySelector('[data-admin-slot]');if(!slot)return;
    slot.className='adm-wrap';
    slot.innerHTML=`<button type="button" class="adm-btn" aria-haspopup="true" aria-expanded="false"></button><div class="adm-pop" role="dialog" aria-label="관리자 패널" hidden></div>`;
    const btn=slot.querySelector('.adm-btn'),pop=slot.querySelector('.adm-pop');
    const dlg=document.createElement('dialog');dlg.className='adm-dlg';
    dlg.innerHTML=`<form method="dialog"><h3>🔒 관리자 모드</h3><label for="adm-pw">비밀번호</label><input id="adm-pw" type="password" autocomplete="current-password"><p class="err" role="alert"></p><div class="btns"><button value="cancel" formnovalidate>취소</button><button value="ok" class="primary">들어가기</button></div></form>`;
    document.body.appendChild(dlg);
    const pw=dlg.querySelector('input'),err=dlg.querySelector('.err');
    dlg.querySelector('form').addEventListener('submit',async e=>{
      if(e.submitter&&e.submitter.value==='cancel')return;
      e.preventDefault();
      if(await sha(pw.value)===HASH){ls.set('pl-admin','1');dlg.close();apply();paint();open(true)}
      else{err.textContent='비밀번호가 달라요.';pw.select()}
    });
    const paintBtn=()=>{btn.textContent=PL.admin?'🔓 관리자':'🔒 관리자';btn.setAttribute('aria-label',PL.admin?'관리자 패널 열기':'관리자 모드로 들어가기')};
    function paint(){
      paintBtn();
      if(!PL.admin){pop.hidden=true;return}
      pop.innerHTML=`<h3>🔓 관리자 모드</h3>
        <label class="adm-row"><span>수업 화면 모드<small>글자 크게 · 전체 화면 · 설명 숨김</small></span><input type="checkbox" class="adm-sw" data-k="present" ${PL.present?'checked':''}></label>
        <label class="adm-row"><span>복사 막기 풀기<small>이 브라우저에서만 예제 코드 복사 가능</small></span><input type="checkbox" class="adm-sw" data-k="copyfree" ${PL.copyFree?'checked':''}></label>
        <div class="adm-extra"></div>
        <div class="adm-sec"><button type="button" class="adm-act" data-k="logout">관리자 모드 끝내기</button></div>`;
      pop.querySelectorAll('.adm-sw').forEach(sw=>sw.onchange=()=>{
        if(sw.dataset.k==='present'){ls.set('pl-present',sw.checked?'1':null);
          try{if(sw.checked&&!document.fullscreenElement)root.requestFullscreen?.();else if(!sw.checked&&document.fullscreenElement)document.exitFullscreen()}catch(e){}}
        if(sw.dataset.k==='copyfree')ls.set('pl-copyfree',sw.checked?'1':null);
        apply()});
      pop.querySelector('[data-k="logout"]').onclick=()=>{['pl-admin','pl-present','pl-copyfree'].forEach(k=>ls.set(k,null));
        if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});apply();paint();btn.focus()};
      window.dispatchEvent(new CustomEvent('pl-admin-panel',{detail:pop.querySelector('.adm-extra')}));
    }
    function open(v){if(!PL.admin)return;pop.hidden=!v;btn.setAttribute('aria-expanded',String(v))}
    btn.onclick=()=>{if(!PL.admin){err.textContent='';pw.value='';dlg.showModal();pw.focus();return}open(pop.hidden)};
    document.addEventListener('click',e=>{if(!slot.contains(e.target)&&!pop.hidden)open(false)});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!pop.hidden){open(false);btn.focus()}});
    paint();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
