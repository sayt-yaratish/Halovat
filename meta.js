// Meta Conversions API (серверное событие Purchase, дедупликация по event_id с пикселем)
// Нужны META_PIXEL_ID и META_ACCESS_TOKEN; META_TEST_CODE — для вкладки «Test events»
const crypto=require('crypto');
const sha=s=>crypto.createHash('sha256').update(String(s).trim().toLowerCase()).digest('hex');
module.exports=async function(o,req){
  const {META_PIXEL_ID:px,META_ACCESS_TOKEN:tk,META_TEST_CODE:tc,META_API_VERSION:v='v21.0'}=process.env;
  if(!px||!tk)return {skipped:true};
  const ev={event_name:'Purchase',event_time:Math.floor(Date.now()/1000),event_id:o.eventId,action_source:'website',event_source_url:o.url,
    user_data:{ph:[sha(o.phone.replace(/\D/g,''))],fn:[sha(o.name.split(' ')[0])],country:[sha('uz')],
      client_ip_address:req.ip,client_user_agent:req.get('user-agent'),...(o.fbp&&{fbp:o.fbp}),...(o.fbc&&{fbc:o.fbc})},
    custom_data:{currency:'UZS',value:o.total,content_type:'product',contents:o.items.map(i=>({id:String(i.id),quantity:i.q,item_price:i.sum/i.q}))}};
  const body={data:[ev]};if(tc)body.test_event_code=tc;
  const r=await fetch(`https://graph.facebook.com/${v}/${px}/events?access_token=${tk}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!r.ok)throw new Error('meta '+r.status+' '+await r.text());
  return {ok:true};
};
