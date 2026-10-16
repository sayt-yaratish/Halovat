/* ===== УТИЛИТЫ ===== */
const ck=n=>(document.cookie.match(new RegExp("(?:^|; )"+n+"=([^;]*)"))||[])[1]||"";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let lang="ru",cat="all",cart=[];
try{lang=localStorage.getItem("hl")||(navigator.language||"").startsWith("uz")?"uz":"ru";lang=localStorage.getItem("hl")||lang;cart=JSON.parse(localStorage.getItem("hc")||"[]")}catch(e){}
const fmt=n=>Math.round(n).toLocaleString("ru-RU").replace(/,/g," ")+" "+T[lang].sum;
const pr=(p,s)=>p.base*(p.t==="top"?1:SIZES.find(z=>z.s===s).k);
const bedSvg=(c="#8c8be8")=>`<svg viewBox="0 0 400 260"><ellipse cx="200" cy="228" rx="170" ry="16" fill="#0003"/><path d="M40 150l40-50h240l40 50v50H40z" fill="${c}"/><rect x="40" y="150" width="320" height="58" rx="8" fill="#fff"/><path d="M40 150l40-50h240l40 50z" fill="#f4f3ff"/>${[70,110,150,190,230,270,310].map(x=>`<path d="M${x} 168q6 8 0 16t0 16" stroke="#c9c8ee" stroke-width="3" fill="none"/>`).join("")}<rect x="40" y="196" width="320" height="12" rx="6" fill="#f2b45a"/></svg>`;
const ph=p=>p.img?`<img src="${p.img}" alt="${p.n}" loading="lazy">`:bedSvg();
/* ===== РЕНДЕР ===== */
function render(){
  const t=T[lang];document.documentElement.lang=lang;
  $$("[data-i]").forEach(e=>e.textContent=t[e.dataset.i]);
  $$(".lang button").forEach(b=>b.classList.toggle("on",b.dataset.l===lang));
  $("#h1").innerHTML=t.h1.map((w,i)=>`<span style="animation-delay:${.15*i}s">${w}</span> `).join("");
  $("#heroSvg").innerHTML=bedSvg().replace(/<\/?svg[^>]*>/g,"");
  $("#mq").innerHTML=[...t.mq,...t.mq,...t.mq,...t.mq].map(x=>`<span>✦ ${x}</span>`).join("");
  $("#feats").innerHTML=t.f.map((f,i)=>`<div class="f rv" style="transition-delay:${i*.1}s"><i>${f[0]}</i><h4>${f[1]}</h4><p>${f[2]}</p></div>`).join("");
  $("#chips").innerHTML=["all","lux","eco","orto","top"].map(c=>`<button class="chip ${c===cat?"on":""}" data-c="${c}">${t[c]}</button>`).join("");
  grid();renderCart();observe();
}
function grid(){
  const t=T[lang];
  $("#grid").innerHTML=P.filter(p=>cat==="all"||p.t===cat).map((p,i)=>`<article class="card" data-id="${p.id}" style="transition-delay:${i*.06}s"><div class="ph"><span class="badge">${t.warr}: ${p.w} ${t.yrs}</span><span class="sel-b"></span>${ph(p)}</div><div class="cb"><h3>${p.n}</h3><p>${p[lang]}</p><div class="row"><span class="pr">${t.from} ${fmt(p.base)}</span><button class="add" data-add="${p.id}" aria-label="${t.add}">+</button></div></div></article>`).join("");
  observe();
}
function observe(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);if(e.target.dataset.n)count(e.target)}}),{threshold:.12});
  $$(".card:not(.in),.rv:not(.in)").forEach(e=>io.observe(e));
  $$("[data-n]").forEach(e=>{if(!e.dataset.done)io.observe(e)});
}
function count(e){e.dataset.done=1;const n=+e.dataset.n,s=performance.now();(function f(x){const k=Math.min((x-s)/1400,1);e.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(s)}
/* ===== КОРЗИНА ===== */
function marks(){$$(".card").forEach(c=>{const id=+c.dataset.id,q=cart.filter(x=>x.id===id).reduce((a,x)=>a+x.q,0);c.classList.toggle("sel",q>0);c.querySelector(".sel-b").textContent=q||""})}
function bumpCard(id){const b=document.querySelector(`.card[data-id="${id}"] .sel-b`);if(!b)return;b.classList.remove("pop");void b.offsetWidth;b.classList.add("pop")}
const save=()=>{try{localStorage.setItem("hc",JSON.stringify(cart))}catch(e){}};
function addCart(id,size){
  const p=P.find(x=>x.id===id);size=size||(p.t==="top"?"—":SIZES[0].s);
  const ex=cart.find(c=>c.id===id&&c.size===size);ex?ex.q++:cart.push({id,size,q:1});
  save();renderCart();bumpCard(id);const b=$("#cnt");b.classList.remove("bump");void b.offsetWidth;b.classList.add("bump");
  track("AddToCart",{content_ids:[String(id)],content_name:p.n,value:pr(p,size==="—"?SIZES[0].s:size),currency:CFG.CURRENCY});
}
const total=()=>cart.reduce((a,c)=>{const p=P.find(x=>x.id===c.id);return a+pr(p,c.size==="—"?SIZES[0].s:c.size)*c.q},0);
function renderCart(){
  const t=T[lang];$("#cnt").textContent=cart.reduce((a,c)=>a+c.q,0);marks();
  $("#drawer").innerHTML=`<div class="dh"><h2 style="margin:0;font-size:24px">${t.cart}</h2><button class="x" data-close>✕</button></div>`+(cart.length?`<div class="items">${cart.map((c,i)=>{const p=P.find(x=>x.id===c.id);return `<div class="it"><div class="th">${ph(p)}</div><div class="in2"><b>${p.n}</b><small>${c.size}</small><div class="q"><button data-q="${i}" data-d="-1">−</button>${c.q}<button data-q="${i}" data-d="1">+</button></div></div><b style="font-size:14px">${fmt(pr(p,c.size==="—"?SIZES[0].s:c.size)*c.q)}</b></div>`}).join("")}</div><div class="tot"><span>${t.total}</span><span>${fmt(total())}</span></div><button class="btn am" id="goCheck">${t.order}</button>`:`<p style="color:var(--mut);margin-top:30px">${t.empty}</p>`);
}
function openD(on){$("#drawer").classList.toggle("on",on);$("#ov").classList.toggle("on",on);if(on&&!document.querySelector(".chk")){}}
function checkout(){
  const t=T[lang];track("InitiateCheckout",{value:total(),currency:CFG.CURRENCY,num_items:cart.length});
  $("#drawer").innerHTML=`<div class="dh"><h2 style="margin:0;font-size:24px">${t.order}</h2><button class="x" data-close>✕</button></div><form id="f" novalidate><input name="name" placeholder="${t.name}" autocomplete="name"><input name="phone" placeholder="${t.phone}" inputmode="tel" autocomplete="tel" value="+998 "><textarea name="addr" rows="3" placeholder="${t.addr}"></textarea><div class="pm"><label><input type="radio" name="pay" value="cash" checked>${t.cash}</label><label style="opacity:.5"><input type="radio" name="pay" value="online" disabled>${t.card}</label></div><div class="tot"><span>${t.total}</span><span>${fmt(total())}</span></div><button class="btn am" type="submit">${t.send}</button></form>`;
  $("#f").onsubmit=async e=>{
    e.preventDefault();const f=e.target,d=Object.fromEntries(new FormData(f));let bad=0;
    ["name","phone","addr"].forEach(k=>{const el=f[k],ok=k==="phone"?d.phone.replace(/\D/g,"").length>=12:d[k].trim().length>2;el.classList.remove("err");if(!ok){void el.offsetWidth;el.classList.add("err");bad=1}});
    if(bad)return;
    const order={...d,fbp:ck("_fbp"),fbc:ck("_fbc"),url:location.href,lang,items:cart.map(c=>({...c,name:P.find(p=>p.id===c.id).n})),total:total(),event_id:"o"+Date.now(),at:new Date().toISOString()};
    try{if(CFG.ORDER_URL)await fetch(CFG.ORDER_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(order)});else localStorage.setItem("ho"+order.event_id,JSON.stringify(order))}catch(x){}
    track("Purchase",{value:order.total,currency:CFG.CURRENCY},{eventID:order.event_id});
    cart=[];save();renderCart();
    $("#drawer").innerHTML=`<div class="ok"><svg viewBox="0 0 60 60" fill="none" stroke="#2fb67c" stroke-width="4" stroke-linecap="round"><circle cx="30" cy="30" r="26"/><path d="M18 31l8 8 16-17"/></svg><h2 style="margin:16px 0 6px">${t.okt}</h2><p style="color:var(--mut);margin-bottom:24px">${t.okp}</p><button class="btn" data-close>${t.back}</button></div>`;
    confetti();
  };
}
function confetti(){for(let i=0;i<60;i++){const c=document.createElement("i");c.className="conf";c.style.cssText=`left:${Math.random()*100}%;background:${["#f2b45a","#8c8be8","#2fb67c","#fff"][i%4]};animation-delay:${Math.random()*.6}s;animation-duration:${1.8+Math.random()*1.4}s`;document.body.appendChild(c);setTimeout(()=>c.remove(),3500)}}
/* ===== МОДАЛКА ТОВАРА ===== */
function openM(id){
  const p=P.find(x=>x.id===id),t=T[lang];let sz=SIZES[0].s;track("ViewContent",{content_ids:[String(id)],content_name:p.n,currency:CFG.CURRENCY});
  const draw=()=>{$("#modal").innerHTML=`<div class="mb"><div class="ph">${ph(p)}</div><div class="mi"><button class="x" data-mclose>✕</button><h2 style="margin-right:40px">${p.n}</h2><p style="color:var(--mut)">${p[lang]}</p><div class="spec"><div>${t.warr}<b>${p.w} ${t.yrs}</b></div><div>${t.par}<b>${p.pa}</b></div><div>${t.spr}<b>${p.sp||"—"}</b></div><div>${t.tie}<b>${p.ti||"—"}</b></div></div>${p.t==="top"?"":`<b style="font-size:13px">${t.size}</b><div class="sz">${SIZES.map(z=>`<button class="chip ${z.s===sz?"on":""}" data-sz="${z.s}">${z.s}</button>`).join("")}</div>`}<div class="row"><span class="pr" style="font-size:22px">${fmt(pr(p,sz))}</span><button class="cta" style="padding:13px 24px;animation:none" data-madd>${t.add}</button></div></div></div>`};
  draw();$("#modal").classList.add("on");$("#ov").classList.add("on");
  $("#modal").onclick=e=>{const s=e.target.closest("[data-sz]");if(s){sz=s.dataset.sz;draw()}
    if(e.target.closest("[data-madd]")){addCart(id,p.t==="top"?"—":sz);closeM();openD(true)}
    if(e.target.closest("[data-mclose]")||e.target===$("#modal"))closeM()};
}
function closeM(){$("#modal").classList.remove("on");if(!$("#drawer").classList.contains("on"))$("#ov").classList.remove("on")}
/* ===== СОБЫТИЯ ===== */
document.addEventListener("click",e=>{
  const g=s=>e.target.closest(s);
  if(g("[data-l]")){lang=g("[data-l]").dataset.l;try{localStorage.setItem("hl",lang)}catch(x){}render()}
  else if(g("[data-c]")){cat=g("[data-c]").dataset.c;$$(".chip").forEach(c=>c.classList.toggle("on",c.dataset.c===cat));grid();marks()}
  else if(g("[data-add]")){e.stopPropagation();addCart(+g("[data-add]").dataset.add)}
  else if(g(".card")){openM(+g(".card").dataset.id)}
  else if(g("#cartBtn")){renderCart();openD(true)}
  else if(g("[data-close]")||e.target.id==="ov"){openD(false);closeM()}
  else if(g("[data-q]")){const c=cart[+g("[data-q]").dataset.q];c.q+=+g("[data-q]").dataset.d;if(c.q<1)cart.splice(+g("[data-q]").dataset.q,1);save();renderCart()}
  else if(g("#goCheck"))checkout();
});
/* звёзды + параллакс луны */
for(let i=0;i<45;i++){const s=document.createElement("i");s.className="star";s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s`;$("#hero").appendChild(s)}
addEventListener("scroll",()=>{$(".moon").style.marginTop=Math.min(scrollY*.25,120)+"px"},{passive:true});
render();

const dl=new URLSearchParams(location.search).get("p");if(dl)setTimeout(()=>openM(+dl),700);
