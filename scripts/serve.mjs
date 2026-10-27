import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(process.env.PREVIEW_ROOT || 'dist');
const basePath = (process.env.SITE_BASE_PATH || '').replace(/\/$/,'');
const port = Number(process.env.PORT || 4173);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json', '.svg':'image/svg+xml', '.webp':'image/webp', '.jpeg':'image/jpeg', '.jpg':'image/jpeg', '.pdf':'application/pdf', '.woff2':'font/woff2', '.xml':'application/xml', '.txt':'text/plain; charset=utf-8' };
http.createServer(async (req,res) => {
  const headers = {
    'Cache-Control':'no-cache',
    'X-Content-Type-Options':'nosniff',
    'Referrer-Policy':'strict-origin-when-cross-origin',
    'X-Frame-Options':'DENY',
    'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'"
  };
  for(const [name,value] of Object.entries(headers)) res.setHeader(name,value);
  try {
    let pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(basePath){
      if(pathname === basePath){res.writeHead(308,{Location:basePath+'/'});return res.end();}
      if(!pathname.startsWith(basePath+'/')){res.writeHead(404);return res.end();}
      pathname = pathname.slice(basePath.length);
    }
    const file = path.resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, {Allow:'GET, HEAD'}); return res.end(); }
    const data = await readFile(file);
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':pathname.startsWith('/assets/')?'public, max-age=86400':'no-cache'});
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    const data = await readFile(path.join(root,'404.html')).catch(()=> 'Not found');
    res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'}); res.end(req.method === 'HEAD' ? undefined : data);
  }
}).listen(port,'127.0.0.1',()=> console.log(`Local: http://127.0.0.1:${port}${basePath}/`));
