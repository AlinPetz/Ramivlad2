import {chromium} from 'playwright';
import {spawn,spawnSync} from 'node:child_process';
import {mkdir,cp,mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

// Build both URL environments, serve the real repository prefix, then compare
// decoded screenshots and every loaded asset with the published artifact.
const live=process.argv[2];
const expected=process.argv[3];
const temporary=await mkdtemp(path.join(tmpdir(),'ramivlad-parity-'));
const servers=[];let browser;
const output='reports/screenshots/deployment-parity';
const hash=data=>createHash('sha256').update(data).digest('hex');
const build=(base,url)=>{
 const env={...process.env,SITE_BASE_PATH:base,SITE_URL:url};
 for(const script of ['scripts/build.mjs','scripts/check.mjs']){
  const result=spawnSync(process.execPath,[script],{env,stdio:'inherit'});
  assert.equal(result.status,0,script);
 }
};
try{
 await mkdir(output,{recursive:true});
 build('','https://ramivladinstal.ro');await cp('dist',path.join(temporary,'root'),{recursive:true});
 build('/Ramivlad2','https://alinpetz.github.io/Ramivlad2');await cp('dist',path.join(temporary,'pages'),{recursive:true});
 // Keep the owner's ordinary preview working after this test.
 build('','https://ramivladinstal.ro');
 for(const [name,port,base] of [['root',4174,''],['pages',4175,'/Ramivlad2']]){
  const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PREVIEW_ROOT:path.join(temporary,name),PORT:String(port),SITE_BASE_PATH:base},stdio:['ignore','pipe','pipe']});servers.push(server);
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(new Error('Preview exited: '+code)));});
 }
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--disable-gpu','--force-color-profile=srgb']});const results=[];
 for(const width of [1440,390]){
  const screenshots={};
  for(const [label,url] of [['root','http://127.0.0.1:4174/'],['pages','http://127.0.0.1:4175/Ramivlad2/'],...(live?[['live',live]]:[])]){
   const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});const errors=[],resources=[];const pending=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('requestfailed',r=>errors.push(r.url()+': '+r.failure()?.errorText));
   page.on('response',r=>{pending.push((async()=>{assert(r.status()<400,r.url()+' '+r.status());const pathname=new URL(r.url()).pathname;if(/\.(css|js|woff2|webp|jpe?g)$/.test(pathname)){const type=r.headers()['content-type'];assert(/css|javascript|font|image/.test(type),r.url()+' MIME '+type);resources.push({path:pathname.replace(/^\/Ramivlad2/,''),hash:hash(await r.body()),type});}})());});
   await page.goto(url,{waitUntil:'networkidle'});
   await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode()));await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
   // Changing loading=lazy may start a new responsive-image request after an
   // earlier decode resolves. Wait for that request before comparing pixels.
   await page.waitForLoadState('networkidle');
   await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode()));});
   // Chrome can initially rasterize resized photographs at reduced quality
   // while scrolling/lazy loading settles; allow its final high-quality paint.
   await page.waitForTimeout(1000);
   // Visit each viewport so full-page capture does not mix previously painted
   // and newly rasterized off-screen image tiles across different hosts.
   await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=800){scrollTo(0,y);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));}scrollTo(0,0);});
   await page.waitForTimeout(1000);
   assert.equal(await page.locator('h1').innerText(),'Instalații sanitare\nși termice.');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   screenshots[label]=await page.screenshot({path:`${output}/${label}-${width}.png`,fullPage:true});
   await Promise.all(pending);assert.deepEqual(errors,[]);
   resources.sort((a,b)=>a.path.localeCompare(b.path));
   results.push({label,width,errors,resources,screenshot:hash(screenshots[label]),images:await page.locator('img').evaluateAll(images=>images.map(i=>({src:i.currentSrc,width:i.naturalWidth,height:i.naturalHeight})))});await page.close();
  }
  await writeFile(`${output}/results.json`,JSON.stringify({commit:expected,live,results},null,2));
  assert(screenshots.root.equals(screenshots.pages),`Root versus repository-prefix visual mismatch at ${width}`);
  if(live){assert(screenshots.pages.equals(screenshots.live),`Local production versus live visual mismatch at ${width}`);
   const local=results.find(r=>r.width===width&&r.label==='pages'),remote=results.find(r=>r.width===width&&r.label==='live');
   assert.deepEqual(remote.resources.map(({path,hash})=>({path,hash})),local.resources.map(({path,hash})=>({path,hash})),'Loaded asset bytes differ');}
 }
 if(live){const info=await fetch(new URL('build-info.json',live)).then(r=>r.json());assert.equal(info.commit,expected);assert.equal(info.basePath,'/Ramivlad2');}
 await writeFile(`${output}/results.json`,JSON.stringify({commit:expected,live,results},null,2));
 console.log('PASS: pixel-identical full-page screenshots at 1440 and 390; assets, MIME, fonts, console, network and repository prefix verified.');
}finally{
 await browser?.close();for(const server of servers)server.kill();await rm(temporary,{recursive:true,force:true});
}
