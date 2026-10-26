import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
const pages=(await readdir('dist')).filter(f=>f.endsWith('.html'));
const titles=new Set(); let links=0;
const basePath=(process.env.SITE_BASE_PATH || '').replace(/\/$/,'');
const origin=(process.env.SITE_URL || 'https://ramivladinstal.ro').replace(/\/$/,'');
for(const file of pages){
 const html=await readFile('dist/'+file,'utf8');
 assert.match(html,/<html lang="ro">/); assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file+' H1');
 const title=html.match(/<title>(.*?)<\/title>/)[1]; assert(!titles.has(title),'Duplicate title'); titles.add(title);
 assert.match(html,/<meta name="description" content="[^"]+">/); assert.match(html,/<link rel="canonical"/);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.equal(schema['@context'],'https://schema.org');
 assert(!JSON.stringify(schema).match(/aggregateRating|review|openingHours|address/),'Unverified business properties');
 for(const m of html.matchAll(/(?:href|src)="([^"?]+)"/g)){
  const href=m[1]; if(/^(https?:|tel:|mailto:)/.test(href)) continue;
  let [url,anchor]=href.split('#');
  if(url && basePath){assert(url.startsWith(basePath+'/'),`${file}: link missing deployment base ${href}`);url=url.slice(basePath.length);}
  const target=url?path.join('dist',url==='/'?'index.html':url):'dist/'+file;
  assert((await stat(target)).isFile(),`${file}: missing ${href}`);
  if(anchor&&target.endsWith('.html')) assert((await readFile(target,'utf8')).includes(`id="${anchor}"`),`${file}: missing anchor ${href}`);
  links++;
 }
 for(const match of html.matchAll(/srcset="([^"]+)"/g))for(const entry of match[1].split(',')){
  let asset=entry.trim().split(/\s+/)[0];if(basePath){assert(asset.startsWith(basePath+'/'));asset=asset.slice(basePath.length);}
  assert((await stat(path.join('dist',asset))).isFile(),`${file}: missing responsive image ${asset}`);
 }
}
assert(!(await readdir('dist/assets')).some(f=>f.endsWith('.html')),'Legacy HTML leaked to assets');
const sitemap=await readFile('dist/sitemap.xml','utf8'); assert(!sitemap.includes('404.html'));
const home=await readFile('dist/index.html','utf8');
const options=home.match(/<select id="service"[\s\S]*?<\/select>/)[0];
assert.equal((options.match(/<option[ >]/g)||[]).length,7,'All six services must be selectable');
assert.equal((options.match(/<\/option>/g)||[]).length,7,'Malformed select options');
for(const file of pages.filter(f=>f!=='404.html'))assert(sitemap.includes(file==='index.html'?origin+'/':origin+'/'+file));
console.log(`PASS: ${pages.length} pages, ${links} local links/assets, unique metadata, Romanian language, H1s, schema and sitemap.`);
const info=JSON.parse(await readFile('dist/build-info.json','utf8'));assert.equal(info.basePath,basePath);
await stat('dist/.nojekyll');
