import {readFileSync,writeFileSync} from 'node:fs';
const {port}=JSON.parse(readFileSync('.local/select-button-browser.json','utf8'));
const targets=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise((ok,bad)=>{ws.onopen=ok;ws.onerror=bad});
let id=0;const pending=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const {ok,bad}=pending.get(m.id);pending.delete(m.id);m.error?bad(Error(m.error.message)):ok(m.result)}};
const call=(method,params={})=>new Promise((ok,bad)=>{const n=++id;pending.set(n,{ok,bad});ws.send(JSON.stringify({id:n,method,params}))});
const evaluate=async(expression)=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
try {
await call('Page.enable');await call('Runtime.enable');
await call('Emulation.setDeviceMetricsOverride',{width:1100,height:600,deviceScaleFactor:1,mobile:false});
const output=[];
for(const size of ['small','extra-small']){
 await call('Page.navigate',{url:`http://localhost:6006/iframe.html?id=components-selectbutton--${size==='small'?'small':'extra-small'}-states&viewMode=story`});
 let ready=false;
 for(let n=0;n<100;n++){
  ready=await evaluate(`document.querySelectorAll('button[aria-haspopup="listbox"]').length===5`);
  if(ready)break;await new Promise(ok=>setTimeout(ok,100));
 }
 if(!ready)throw Error('Story not ready '+size+': '+await evaluate('document.body.innerText'));
 await evaluate('document.fonts.ready.then(()=>true)');
 for(const theme of ['light','dark']){
  await evaluate(`document.documentElement.setAttribute('data-theme','${theme}'); document.querySelectorAll('[data-theme]').forEach(el=>el.setAttribute('data-theme','${theme}'))`);
  await new Promise(ok=>setTimeout(ok,200));
  const rows=await evaluate(`Array.from(document.querySelectorAll('button[aria-haspopup="listbox"]')).map((b,i)=>{const r=b.getBoundingClientRect(),s=getComputedStyle(b),label=b.firstElementChild.getBoundingClientRect(),caret=b.lastElementChild.getBoundingClientRect(),after=getComputedStyle(b,'::after');return {state:['enabled','hover','active','focus','disabled'][i],width:r.width,height:r.height,padding:[s.paddingTop,s.paddingRight,s.paddingBottom,s.paddingLeft],border:s.borderWidth,gap:s.gap,radius:s.borderRadius,lineHeight:s.lineHeight,labelHeight:label.height,labelTop:label.top-r.top,caretHeight:caret.height,caretTop:caret.top-r.top,widthMinusLabel:r.width-label.width,background:s.backgroundColor,shadow:s.boxShadow,afterContent:after.content,afterBorder:after.border,disabled:b.disabled}})`);
  output.push({size,theme,rows});
  if(process.argv[2]==='after'&&size==='small'&&theme==='light'){
    const shot=await call('Page.captureScreenshot',{format:'png'});writeFileSync('.local/select-button-after.png',Buffer.from(shot.data,'base64'));
  }
 }
}
const stage=process.argv[2]||'before';writeFileSync(`.local/select-button-${stage}-geometry.json`,JSON.stringify(output,null,2));
console.log(JSON.stringify(output.map(({size,theme,rows})=>({size,theme,heights:rows.map(r=>r.height),labelOffsets:rows.map(r=>r.labelTop),widthMinusLabel:rows.map(r=>r.widthMinusLabel),borders:rows.map(r=>r.border)})),null,2));
} finally {ws.close()}
