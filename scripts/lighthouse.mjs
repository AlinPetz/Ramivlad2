import lighthouse from 'lighthouse';
import {launch} from 'chrome-launcher';
import {writeFile} from 'node:fs/promises';
const chrome=await launch({chromeFlags:['--headless','--no-sandbox']});
try{
 const results=[];
 for(const [name,pathname] of [['home','/'],['service','/instalatii-termice.html']]){
  const run=await lighthouse('http://127.0.0.1:4173'+pathname,{port:chrome.port,output:['json','html'],onlyCategories:['performance','accessibility','best-practices','seo'],formFactor:'mobile',screenEmulation:{mobile:true,width:390,height:844,deviceScaleFactor:1,disabled:false}});
  await writeFile(`reports/lighthouse-${name}.json`,run.report[0]); await writeFile(`reports/lighthouse-${name}.html`,run.report[1]);
  const lhr=run.lhr;
  results.push({page:pathname,scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].map(k=>[k,lhr.audits[k].displayValue])),failed:Object.values(lhr.audits).filter(a=>a.score!==null&&a.score<1&&a.details?.type!=='opportunity').map(a=>({id:a.id,title:a.title,score:a.score}))});
 }
 await writeFile('reports/lighthouse-summary.json',JSON.stringify(results,null,2)); console.log(JSON.stringify(results,null,2));
} finally {await chrome.kill();}
