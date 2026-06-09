/* TabiPack 共通JS（SSG版・SPAルーティングは廃止し、各ページは独立HTML） */

// モバイルメニュー
function openMobMenu(){ var m=document.getElementById('mob-menu'); if(m){ m.classList.add('open'); document.body.style.overflow='hidden'; } }
function closeMobMenu(){ var m=document.getElementById('mob-menu'); if(m){ m.classList.remove('open'); document.body.style.overflow=''; } }

// 目次のスムーズスクロール
function scrollToId(id){ var el=document.getElementById(id); if(el){ window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 80, behavior:'smooth'}); } }

document.addEventListener('DOMContentLoaded', function(){
  // FAQ アコーディオン
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var ans = btn.nextElementSibling;
      var isOpen = btn.classList.contains('open');
      document.querySelectorAll('.faq-q.open').forEach(function(b){ b.classList.remove('open'); b.nextElementSibling.classList.remove('open'); });
      if(!isOpen){ btn.classList.add('open'); ans.classList.add('open'); }
    });
  });

  // チェックリスト（localStorage保存）
  document.querySelectorAll('.cl-item input[type="checkbox"]').forEach(function(cb){
    var key='cb_'+cb.dataset.key;
    if(localStorage.getItem(key)==='1') cb.checked=true;
    function upd(){ cb.closest('.cl-item').style.opacity=cb.checked?'0.5':'1'; cb.closest('.cl-item').style.textDecoration=cb.checked?'line-through':''; }
    cb.addEventListener('change', function(){ localStorage.setItem(key, cb.checked?'1':'0'); upd(); });
    upd();
  });

  // カテゴリの絞り込みボタン
  document.querySelectorAll('.filter-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.filter-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;
      document.querySelectorAll('#cat-art-grid .art-card').forEach(function(card){
        if(filter==='all'){ card.style.display=''; return; }
        card.style.display = card.dataset.cats.split(',').includes(filter) ? '' : 'none';
      });
    });
  });

  // スマホ用の目次クローン（本文の最初のh2の前に挿入）
  (function(){
    if(window.innerWidth > 900) return;
    var sb = document.querySelector('.sidebar .sw');
    var body = document.querySelector('.art-body');
    if(sb && body){
      var firstH2 = body.querySelector('h2');
      if(firstH2){ var clone = sb.cloneNode(true); clone.classList.add('toc-mobile'); firstH2.parentNode.insertBefore(clone, firstH2); }
    }
  })();

  // MailerLite「新着記事を受け取る」フォーム
  (function(){
    var ACTION = 'https://assets.mailerlite.com/jsonp/2418629/forms/189766619489109859/subscribe';
    var ifr = document.createElement('iframe');
    ifr.name='ml_sub_iframe'; ifr.setAttribute('aria-hidden','true');
    ifr.style.cssText='position:absolute;width:0;height:0;border:0;left:-9999px;';
    document.body.appendChild(ifr);
    function valid(e){ return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e); }
    document.querySelectorAll('input[type="email"][placeholder="メールアドレス"]').forEach(function(input){
      var box=input.parentNode; var btn=box.querySelector('button'); if(!btn) return;
      var note=document.createElement('p');
      note.style.cssText='font-size:10px;color:rgba(255,255,255,.7);margin:6px 0 0;line-height:1.5;';
      note.textContent='※配信はいつでも解除できます';
      box.appendChild(note);
      btn.addEventListener('click', function(ev){
        ev.preventDefault();
        var email=(input.value||'').trim();
        if(!valid(email)){ input.focus(); input.style.boxShadow='0 0 0 2px #ffd54f'; return; }
        var f=document.createElement('form'); f.action=ACTION; f.method='post'; f.target='ml_sub_iframe'; f.style.display='none';
        function add(n,v){ var i=document.createElement('input'); i.type='hidden'; i.name=n; i.value=v; f.appendChild(i); }
        add('fields[email]', email); add('ml-submit','1'); add('anticsrf','true');
        document.body.appendChild(f); f.submit(); setTimeout(function(){ f.remove(); }, 1500);
        box.innerHTML='<p style="font-size:14px;font-weight:700;color:white;margin:0 0 6px;">✅ 登録ありがとうございます！</p><p style="font-size:12px;color:rgba(255,255,255,.85);margin:0;line-height:1.6;">新着記事が出たらメールでお知らせします。</p>';
      });
    });
  })();

  // カテゴリのサブページ（/category/<cat>）：絞り込み表示を適用
  var CAT_DISPLAY = {
    'workholi': {name:'ワーホリ',     desc:'ビザ申請・渡航準備・現地での仕事や生活・お金の管理まで、ワーキングホリデーに役立つ情報を実体験をもとにまとめています。'},
    'travel':   {name:'旅行',         desc:'国内・海外の旅行準備、持ち物、おすすめスポットなど、旅をもっと楽しむためのヒントを紹介します。'},
    'gadget':   {name:'ガジェット',   desc:'eSIM・モバイルバッテリー・変換プラグなど、旅とワーホリで本当に役立ったガジェットを実体験レビューで紹介します。'},
    'money':    {name:'お金・決済',   desc:'海外送金・クレジットカード・両替のコツ。Wiseなど手数料の安いサービスの使い方をわかりやすく解説します。'}
  };
  (function(){
    var m = location.pathname.match(/^\/category\/([a-z]+)\/?$/);
    if(!m) return;
    var f = m[1]; var d = CAT_DISPLAY[f]; if(!d) return;
    var hub = document.getElementById('cat-hub'); if(hub) hub.style.display='none';
    var head = document.getElementById('cat-head');
    if(head){ head.style.display=''; var nm=document.getElementById('cat-head-name'); var ds=document.getElementById('cat-head-desc'); if(nm) nm.textContent=d.name+'の記事'; if(ds) ds.textContent=d.desc; }
    document.querySelectorAll('#cat-art-grid .art-card').forEach(function(card){ card.style.display = card.dataset.cats.split(',').includes(f) ? '' : 'none'; });
    var other = document.getElementById('cat-other'); if(other) other.style.display='none';
  })();
});
