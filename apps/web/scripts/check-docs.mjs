import fs from 'fs';
import path from 'path';

function parseFM(raw){
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if(!m) return null;
  const data={};
  for(const line of m[1].split(/\r?\n/)){
    const mm = line.match(/^(\w+):\s*(.*)$/);
    if(mm){ let v=mm[2].trim(); v=v.replace(/^["']|["']$/g,''); data[mm[1]]=v; }
  }
  return data;
}

const root = process.cwd();
const reg = fs.readFileSync(path.join(root,'lib/tool-registry.ts'),'utf8');
const names = [...reg.matchAll(/name:\s*"([^"]+)",\s*slug:\s*"([^"]+)"/g)].map(m=>({name:m[1],slug:m[2]}));
const nameSet = new Set(names.map(n=>n.name));
const slugByName = new Map(names.map(n=>[n.name,n.slug]));
const iconsDir = path.join(root,'public/assets/daily-ai-lab/icons');
const haveSvg = new Set(fs.readdirSync(iconsDir).filter(f=>f.endsWith('.svg')).map(f=>f.replace('.svg','')));
const docsRoot = path.join(root,'content/docs');
const tools = JSON.parse(fs.readFileSync(path.join(docsRoot,'_tools.json'),'utf8'));

let errors=[], warns=[];
for (const {name,slug} of names){
  if (tools[name]===undefined) continue;
  const dir = path.join(docsRoot,slug);
  if(!fs.existsSync(dir)){ errors.push(`MISSING FOLDER: ${name} -> content/docs/${slug}/`); continue;}
  const mds = fs.readdirSync(dir).filter(f=>f.endsWith('.md'));
  if(mds.length===0) errors.push(`NO .md FILES: content/docs/${slug}/`);
  for(const f of mds){
    const raw=fs.readFileSync(path.join(dir,f),'utf8');
    const fm=parseFM(raw);
    if(!fm){ errors.push(`BAD/NO FRONTMATTER: ${slug}/${f}`); continue;}
    if(!fm.title) errors.push(`NO title: ${slug}/${f}`);
    if(!fm.tool) errors.push(`NO tool: ${slug}/${f}`);
    else if(!nameSet.has(fm.tool)) errors.push(`TOOL NOT IN REGISTRY: ${slug}/${f}: "${fm.tool}"`);
    else if(slugByName.get(fm.tool)!==slug) errors.push(`TOOL/SLUG MISMATCH: ${slug}/${f}: tool="${fm.tool}" expects "${slugByName.get(fm.tool)}"`);
    if(fm.order===undefined) warns.push(`no order: ${slug}/${f}`);
    if(fm.icon && !haveSvg.has(fm.icon)) warns.push(`icon svg missing (cosmetic): ${slug}/${f}: ${fm.icon}`);
  }
}
for(const k of Object.keys(tools)) if(!nameSet.has(k)) errors.push(`_tools.json key not in registry: "${k}"`);
for(const m of reg.matchAll(/type:\s*"svg",\s*file:\s*"([^"]+)"/g)) if(!haveSvg.has(m[1])) errors.push(`REGISTRY svg icon missing: ${m[1]}.svg`);

const docFolders = fs.readdirSync(docsRoot,{withFileTypes:true}).filter(d=>d.isDirectory()).length;
console.log(`Registry tools: ${names.length} | _tools.json keys: ${Object.keys(tools).length} | doc folders: ${docFolders}`);
console.log(`\n=== ERRORS (${errors.length}) ===`); errors.forEach(e=>console.log('  X',e));
console.log(`\n=== WARNINGS (${warns.length}) ===`); warns.forEach(w=>console.log('  -',w));
console.log(errors.length===0?'\nALL DOCS VALID':'\nFIX ERRORS ABOVE');
