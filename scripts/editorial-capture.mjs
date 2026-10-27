import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const directory='reports/editorial/screenshots';
await mkdir(directory,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({reducedMotion:'reduce'});
const page=await context.newPage();
async function ready(){
  await page.evaluate(async()=>{
    for(const image of document.images)image.loading='eager';
    await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));
    await document.fonts.ready;
  });
}
try{
  for(const [name,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844]]){
    await page.setViewportSize({width,height});
    await page.goto('http://127.0.0.1:4173/');await ready();
    await page.screenshot({path:`${directory}/after-${name}.png`,fullPage:true});
    await page.screenshot({path:`${directory}/after-${name}-viewport.png`});
    for(const section of ['servicii','proiecte','contact'])await page.locator('#'+section).screenshot({path:`${directory}/after-${name}-${section}.png`});
  }
  await page.locator('#name').fill('Test local');
  await page.locator('#contact-detail').fill('invalid');
  await page.locator('#service').selectOption({label:'Instalații sanitare'});
  await page.locator('#message').fill('Verificare locală a formularului, fără trimitere.');
  await page.locator('#inquiry button[type=submit]').click();
  await page.locator('#inquiry').screenshot({path:`${directory}/form-invalid.png`});
  await page.locator('#contact-detail').fill('test@example.invalid');
  await page.locator('#inquiry button[type=submit]').click();
  await page.locator('#draft').screenshot({path:`${directory}/form-draft.png`});
  console.log('Captured desktop/tablet/mobile overview and service, portfolio, contact sections; invalid and draft form states. No email sent.');
}finally{await browser.close();}
