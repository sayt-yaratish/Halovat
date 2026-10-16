require('dotenv').config();
const express=require('express'),path=require('path');
const {P,price}=require('./lib/products');
const tg=require('./services/telegram'),amo=require('./services/amocrm'),meta=require('./services/meta'),feed=require('./services/feed');
const app=express();app.set('trust proxy',true);app.use(express.json({limit:'50kb'}));

app.get('/feed/meta.xml',(q,r)=>r.type('application/xml').send(feed(q.query.lang==='uz'?'uz':'ru')));

app.post('/api/order',async(req,res)=>{
  const b=req.body||{},phone=String(b.phone||'').replace(/[^\d+]/g,'');
  if(String(b.name||'').trim().length<2||phone.replace(/\D/g,'').length<12||!Array.isArray(b.items))return res.status(400).json({ok:false});
  const items=[];
  for(const i of b.items.slice(0,30)){ // цены считаем на сервере, клиенту не верим
    const p=P.find(x=>x.id===+i.id),q=Math.min(Math.max(+i.q||1,1),50);
    if(p)items.push({id:p.id,name:p.n,size:String(i.size),q,sum:price(p,i.size)*q});
  }
  if(!items.length)return res.status(400).json({ok:false});
  const o={id:'H'+Date.now().toString().slice(-7),eventId:String(b.event_id||''),name:String(b.name).trim().slice(0,80),phone,
    addr:String(b.addr||'').slice(0,300),lang:b.lang==='uz'?'uz':'ru',items,total:items.reduce((a,i)=>a+i.sum,0),fbp:b.fbp,fbc:b.fbc,url:b.url};
  const names=['telegram','amocrm','meta'];
  (await Promise.allSettled([tg(o),amo(o),meta(o,req)])).forEach((r,i)=>r.status==='rejected'&&console.error(names[i],r.reason.message));
  res.json({ok:true,id:o.id}); // заказ принят, даже если одна из интеграций упала
});

app.use(express.static(path.join(__dirname,'../public')));
const port=process.env.PORT||3000;app.listen(port,()=>console.log('Halovat: http://localhost:'+port));
