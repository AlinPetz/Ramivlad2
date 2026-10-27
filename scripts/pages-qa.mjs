import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=new URL(process.argv[2] || 'https://alinpetz.github.io/Ramivlad2/');
if(!base.pathname.endsWith('/')) base.pathname+='/';
const expected=process.argv[3];
const infoResponse=await fetch(new URL('build-info.json',base),{cache:'no-store'});
assert(infoResponse.ok,'Missing deployment build-info.json');
const info=await infoResponse.json(); if(expected)assert.equal(info.commit,expected,'Published commit mismatch');
assert.equal(info.basePath,base.pathname.replace(/\/$/,''),'Published base path mismatch');
const sitemapResponse=await fetch(new URL('sitemap.xml',base)); assert(sitemapResponse.ok);
const sitemap=await sitemapResponse.text();
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.equal(urls.length,12); assert(urls.every(url=>url.startsWith(base.href)),'Sitemap must use Pages URL');
await mkdir('reports/screenshots',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();const page=await context.newPage();const errors=[];
page.on('pageerror',error=>errors.push(error.message));const results=[];
async function images(){await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});assert(await page.evaluate(()=>[...document.images].every(i=>i.naturalWidth>0)),'Broken image');}
try{
 for(const width of [360,390,768,1440]){
  await page.setViewportSize({width,height:900});const response=await page.goto(base.href);assert.equal(response.status(),200);
  assert.match(await page.title(),/Instalații sanitare și termice/);assert.match(await page.locator('h1').innerText(),/Instalații sanitare/);assert.match(await page.locator('h1').innerText(),/termice/);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow');
  await images();
  if(width<850){await page.getByRole('button',{name:'Meniu',exact:true}).click();await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');}
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(axe.violations.map(v=>v.id),[]);
  await page.screenshot({path:`reports/screenshots/pages-${width}.png`,fullPage:true});results.push({url:base.href,width,axeViolations:0});
 }
 await page.setViewportSize({width:390,height:844});
 for(const url of urls){
  const response=await page.goto(url);assert.equal(response.status(),200,url);await images();
  assert.equal(await page.locator('h1').count(),1);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),url+' overflow');
  const refs=await page.locator('a[href],link[rel="stylesheet"],script[src]').evaluateAll(elements=>elements.map(e=>e.href||e.src).filter(Boolean));
  for(const ref of refs.filter(ref=>ref.startsWith(base.origin)&&!ref.startsWith(base.href)))assert.fail('Escaped repository path: '+ref);
  results.push({url,width:390,images:'loaded',overflow:false});
 }
 const css=await fetch(new URL('styles.css',base));assert(css.ok);assert.match(css.headers.get('content-type'),/text\/css/);
 const js=await fetch(new URL('script.js',base));assert(js.ok);assert.match(await js.text(),/validateContact/);
 const missing=await fetch(new URL('missing-page-qa.html',base));assert.equal(missing.status,404);
 assert.deepEqual(errors,[]);
 await writeFile('reports/pages-qa.json',JSON.stringify({url:base.href,commit:info.commit,results,consoleErrors:errors,checks:['latest hero design','12 published pages','responsive menu','all images decoded','CSS/JS fetched','repository path navigation','axe on homepage at four widths','404','deployment commit']},null,2));
 console.log(`PASS: published commit ${info.commit}; ${results.length} page/viewport checks; images, CSS, JavaScript, navigation, mobile layouts and accessibility.`);
}finally{await browser.close();}
