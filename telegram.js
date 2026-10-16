// Отправка заказа в Telegram. Нужны TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const n=x=>Math.round(x).toLocaleString('ru-RU');
module.exports=async function(o){
  const {TELEGRAM_BOT_TOKEN:t,TELEGRAM_CHAT_ID:c}=process.env;
  if(!t||!c)return {skipped:true};
  const text=`🛏 <b>Новый заказ ${o.id}</b>\n👤 ${esc(o.name)}\n📞 ${esc(o.phone)}\n📍 ${esc(o.addr)}\n🌐 ${o.lang.toUpperCase()}\n\n`+
    o.items.map(i=>`• ${esc(i.name)} ${esc(i.size)} × ${i.q} = ${n(i.sum)}`).join('\n')+`\n\n<b>Итого: ${n(o.total)} сум</b>`;
  const r=await fetch(`https://api.telegram.org/bot${t}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:c,text,parse_mode:'HTML'})});
  if(!r.ok)throw new Error('telegram '+r.status+' '+await r.text());
  return {ok:true};
};
