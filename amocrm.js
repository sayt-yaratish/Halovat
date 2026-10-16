// AmoCRM: создаёт сделку + контакт + примечание с составом заказа
// Нужны AMO_HOST (напр. mycompany.amocrm.ru) и AMO_TOKEN (долгосрочный токен приватной интеграции)
module.exports=async function(o){
  const {AMO_HOST:host,AMO_TOKEN:tk,AMO_PIPELINE_ID:pl,AMO_STATUS_ID:st}=process.env;
  if(!host||!tk)return {skipped:true};
  const h={'Content-Type':'application/json',Authorization:'Bearer '+tk},base=`https://${host}/api/v4`;
  const lead={name:`Заказ ${o.id} — ${o.name}`,price:Math.round(o.total),
    _embedded:{contacts:[{first_name:o.name,custom_fields_values:[{field_code:'PHONE',values:[{value:o.phone,enum_code:'WORK'}]}]}]}};
  if(pl)lead.pipeline_id=+pl;if(st)lead.status_id=+st;
  const r=await fetch(base+'/leads/complex',{method:'POST',headers:h,body:JSON.stringify([lead])});
  if(!r.ok)throw new Error('amo '+r.status+' '+await r.text());
  const id=(await r.json())[0].id;
  const text=`Адрес: ${o.addr}\nЯзык: ${o.lang}\n`+o.items.map(i=>`${i.name} ${i.size} × ${i.q} = ${Math.round(i.sum)}`).join('\n');
  const nr=await fetch(`${base}/leads/${id}/notes`,{method:'POST',headers:h,body:JSON.stringify([{note_type:'common',params:{text}}])});
  if(!nr.ok)throw new Error('amo note '+nr.status);
  return {ok:true,id};
};
