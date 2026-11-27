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
await call('Page.navigate',{url:'http://localhost:6006/iframe.html?id=components-selectbutton--default&viewMode=story'});
for(let n=0;n<100;n++){if(await evaluate(`document.querySelectorAll('button[aria-haspopup="listbox"]').length===1`))break;await new Promise(ok=>setTimeout(ok,100))}
await evaluate('document.fonts.ready.then(()=>true)');
const result={};
await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9,nativeVirtualKeyCode:9});
await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9,nativeVirtualKeyCode:9});
await new Promise(ok=>setTimeout(ok,200));
result.focus=await evaluate(`(()=>{const b=document.querySelector('button[aria-haspopup="listbox"]'); return {focused:document.activeElement===b,visible:b.matches(':focus-visible'),height:b.getBoundingClientRect().height,shadow:getComputedStyle(b).boxShadow}})()`);
const rect=await evaluate(`(()=>{const r=document.querySelector('button[aria-haspopup="listbox"]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
await call('Input.dispatchMouseEvent',{type:'mouseMoved',...rect});await new Promise(ok=>setTimeout(ok,200));
result.hover=await evaluate(`(()=>{const b=document.querySelector('button[aria-haspopup="listbox"]');return {hovered:b.matches(':hover'),height:b.getBoundingClientRect().height,background:getComputedStyle(b).backgroundColor}})()`);
await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...rect});
await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...rect});
result.open=await evaluate(`(()=>{const b=document.querySelector('button[aria-haspopup="listbox"]');return {expanded:b.getAttribute('aria-expanded'),height:b.getBoundingClientRect().height}})()`);
const option=await evaluate(`(()=>{const b=Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='Attribute 2');if(!b)throw Error('Missing option');const r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...option});
await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...option});
result.selection=await evaluate(`(()=>{const b=document.querySelector('button[aria-haspopup="listbox"]');return {expanded:b.getAttribute('aria-expanded'),text:b.textContent,height:b.getBoundingClientRect().height}})()`);
if(!result.focus.focused||!result.focus.visible||result.focus.height!==32||!result.focus.shadow.includes('2px')||!result.hover.hovered||result.hover.height!==32||result.open.expanded!=='true'||result.selection.expanded!=='false'||result.selection.text!=='Attribute 2'||result.selection.height!==32)throw Error(JSON.stringify(result));
writeFileSync('.local/select-button-browser-interaction.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
} finally {ws.close()}
