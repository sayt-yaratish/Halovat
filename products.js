// Единый источник товаров: читаем public/js/data.js (цены правим только там)
const fs=require('fs'),vm=require('vm'),path=require('path');
const code=fs.readFileSync(path.join(__dirname,'../../public/js/data.js'),'utf8');
const {SIZES,P}=vm.runInNewContext(code+';({SIZES,P})');
const price=(p,size)=>p.t==='top'?p.base:p.base*((SIZES.find(z=>z.s===size)||{}).k||1);
module.exports={SIZES,P,price};
