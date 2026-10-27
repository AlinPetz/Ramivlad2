import {chromium} from 'playwright';
import {mkdir,readdir} from 'node:fs/promises';
const phase=process.argv[2] || 'after';
if(!/^[a-z0-9-]+$/.test(phase))throw new Error('Use a simple phase name.');
const directory='reports/premium/screenshots';
await mkdir(directory,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({reducedMotion:'reduce'});
const page=await context.newPage();
const pages=(await readdir('dist')).filter(file=>file.endsWith('.html')&&file!=='404.html');
try{
  for(const [device,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844]]){
    await page.setViewportSize({width,height});
    for(const file of pages){
      await page.goto('http://127.0.0.1:4173/'+file);
      await page.evaluate(async()=>{
        for(const image of document.images)image.loading='eager';
        await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));
        await document.fonts.ready;
      });
      await page.screenshot({path:`${directory}/${phase}-${device}-${file.replace('.html','')}.png`,fullPage:true});
      if(file==='index.html'){
        await page.screenshot({path:`${directory}/${phase}-${device}-viewport.png`});
        for(const section of ['servicii','proiecte','contact'])await page.locator('#'+section).screenshot({path:`${directory}/${phase}-${device}-${section}-section.png`});
      }
    }
    console.log(`Captured ${device}: ${pages.length} full pages and homepage sections.`);
  }
}finally{await browser.close();}
