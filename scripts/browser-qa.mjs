import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
await mkdir('reports/screenshots',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();
const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
const results=[];
async function loadImages(){
 await page.evaluate(async()=>{
  for(const image of document.images) image.loading='eager';
  await Promise.race([Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Images did not load within 10 seconds')),10000))]);
 });
}
try{
 for(const width of [360,390,768,1024,1440]){
  await page.setViewportSize({width,height:900}); await page.goto('http://127.0.0.1:4173/');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow at '+width);
  assert.equal(await page.locator('h1').count(),1);
  if(width<850){
   await page.getByRole('button',{name:'Meniu',exact:true}).click();
   assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
   await page.keyboard.press('Escape'); assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
  }
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  assert.deepEqual(axe.violations.map(v=>v.id),[],`Axe violations at ${width}`);
  await loadImages();
  await page.screenshot({path:`reports/screenshots/home-${width}.png`,fullPage:true});
  results.push({page:'/',width,overflow:false,axeViolations:axe.violations.length});
 }
 await page.setViewportSize({width:390,height:844});
 await page.locator('#name').fill('Test local'); await page.locator('#contact-detail').fill('invalid');
 await page.locator('#service').selectOption({label:'Instalații sanitare'}); await page.locator('#message').fill('Solicitare de test local, fără trimitere.');
 await page.locator('#inquiry button[type=submit]').click(); assert(await page.locator('#draft').isHidden(),'Invalid contact accepted');
 await page.locator('#contact-detail').fill('test@example.invalid'); await page.locator('#message').fill('               ');
 await page.locator('#inquiry button[type=submit]').click(); assert(await page.locator('#draft').isHidden(),'Whitespace accepted');
 await page.locator('#message').fill('<script>alert(1)</script> Test local fără trimitere.');
 const requests=[]; page.on('request',r=>{if(r.method()==='POST')requests.push(r.url());});
 await page.locator('#inquiry button[type=submit]').click(); await page.locator('#draft').waitFor({state:'visible'});
 assert.match(await page.locator('#draft-text').inputValue(),/<script>/);
 assert((await page.locator('#email-draft').getAttribute('href')).startsWith('mailto:ramivladinstal@yahoo.ro?'));
 assert.deepEqual(requests,[],'Unexpected submission');
 assert.equal(await page.locator('a[href="tel:+40744577842"]').count()>0,true);
 for(const file of (await readdir('dist')).filter(f=>f.endsWith('.html'))){
  await page.goto('http://127.0.0.1:4173/'+file); await loadImages();
  assert(await page.evaluate(()=>[...document.images].every(i=>i.naturalWidth>0)),file+' broken image');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),file+' mobile overflow');
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  assert.deepEqual(axe.violations.map(v=>v.id),[],file+' accessibility');
  results.push({page:file,width:390,axeViolations:axe.violations.length});
 }
 await page.goto('http://127.0.0.1:4173/'); await page.keyboard.press('Tab'); assert.equal(await page.locator(':focus').textContent(),'Sari la conținut');
 const response=await page.request.get('http://127.0.0.1:4173/nonexistent'); assert.equal(response.status(),404);
 assert(response.headers()['content-security-policy'],'404 missing security headers');
 const missingHead=await page.request.head('http://127.0.0.1:4173/nonexistent'); assert.equal(missingHead.status(),404); assert.equal((await missingHead.body()).length,0);
 const post=await page.request.post('http://127.0.0.1:4173/'); assert.equal(post.status(),405);
 assert(post.headers()['content-security-policy'],'405 missing security headers');
 const asset=await page.request.get('http://127.0.0.1:4173/assets/img-logo.jpeg'); assert.equal(asset.headers()['cache-control'],'public, max-age=86400');
 const headers=(await page.request.get('http://127.0.0.1:4173/')).headers(); assert(headers['content-security-policy']);
 assert.deepEqual(errors,[],'Browser errors');
 await writeFile('reports/browser-qa.json',JSON.stringify({date:'2026-10-26',results,consoleErrors:errors,journeys:['responsive navigation + Escape','invalid contact blocked','whitespace blocked','safe email draft, no submission','all page images load','skip link','404','405','security headers']},null,2));
 console.log(`PASS: ${results.length} page/viewport checks; zero axe violations; contact validation/draft, navigation, images, skip link, 404/405 and headers.`);
}finally{await browser.close();}
