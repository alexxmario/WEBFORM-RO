import { readFile, writeFile } from 'node:fs/promises';
import { createElement as h } from 'react';
import { ImageResponse } from 'next/og.js';

// Render the existing WebForm artwork without substituting a generated logo.
const logo = `data:image/png;base64,${(await readFile(new URL('../public/logo.png', import.meta.url))).toString('base64')}`;
const mark = `data:image/png;base64,${(await readFile(new URL('../public/apple-touch-icon.png', import.meta.url))).toString('base64')}`;
async function render(file, width, height, element) {
  const response = new ImageResponse(element, { width, height });
  await writeFile(new URL(`../public/${file}`, import.meta.url), Buffer.from(await response.arrayBuffer()));
}
await render('og-image.png', 1200, 630, h('div', { style: { width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between', background:'#222220', color:'#f7f5ef', padding:'72px 80px', fontFamily:'sans-serif' } },
  h('img', { src:logo, width:520, height:144, alt:'WebForm' }),
  h('div', { style: { display:'flex', flexDirection:'column', gap:20 } },
    h('div', { style:{ fontSize:58, fontWeight:700, lineHeight:1.1, maxWidth:1000 } }, 'Site-ul tău, fără bătăi de cap.'),
    h('div', { style:{ fontSize:27, color:'#d6d4cd' } }, 'Design, găzduire și administrare. De la 180 lei/lună.')),
  h('div', { style:{ fontSize:23, color:'#f5bd3c' } }, 'ro.joinwebform.com')));
await render('og-square.png', 600, 600, h('div',{style:{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#222220'}},h('img',{src:logo,width:500,height:138,alt:'WebForm'})));
for (const size of [192,512]) await render(`webform-icon-${size}.png`,size,size,h('div',{style:{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#222220'}},h('img',{src:mark,width:Math.round(size*.72),height:Math.round(size*.72),alt:'WebForm'})));
// The old favicon.ico was a PNG with an ICO extension; wrap that same artwork in a real ICO container.
const png = await readFile(new URL('../public/favicon-32x32.png', import.meta.url));
const header=Buffer.alloc(22);header.writeUInt16LE(1,2);header.writeUInt16LE(1,4);header[6]=32;header[7]=32;header.writeUInt16LE(1,10);header.writeUInt16LE(32,12);header.writeUInt32LE(png.length,14);header.writeUInt32LE(22,18);
await writeFile(new URL('../public/favicon.ico', import.meta.url),Buffer.concat([header,png]));
console.log('WebForm social images, app icons and favicon generated.');
