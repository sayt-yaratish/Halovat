// XML-фид для Meta Catalog (Commerce Manager → Data sources → Data feed → URL)
const {P}=require('../lib/products');
const x=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
module.exports=(lang='ru')=>{
  const site=(process.env.SITE_URL||'').replace(/\/$/,'');
  const items=P.map(p=>`<item><g:id>${p.id}</g:id><g:title>${x(p.n+' — Halovat')}</g:title><g:description>${x(p[lang])}</g:description><g:link>${site}/?p=${p.id}</g:link><g:image_link>${site}/${p.img||'img/placeholder.jpg'}</g:image_link><g:availability>in stock</g:availability><g:condition>new</g:condition><g:price>${p.base}.00 UZS</g:price><g:brand>Halovat</g:brand></item>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>Halovat</title><link>${site}</link><description>Halovat matraslar</description>${items}</channel></rss>`;
};
