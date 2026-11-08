// Functional regression tests for the actual pure scheduling functions from src.js.
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const test=require('node:test');const assert=require('node:assert/strict');
const src=fs.readFileSync(path.join(__dirname,'..','src.js'),'utf8');
const names=['localISO','fromISO','plusDays','daysBetween','parts','dateParts','firstOfMonth','shiftMonth','monthDates','monthDue','recurrenceAnchor','getDue','latestScheduled','taskStatus'];
const blocks=names.map(name=>{const at=src.indexOf('function '+name+'(');assert.ok(at>=0,name);let open=src.indexOf('{',at),depth=0,inString=null,escape=false;for(let i=open;i<src.length;i++){const c=src[i];if(inString){if(escape)escape=false;else if(c==='\\')escape=true;else if(c===inString)inString=null;continue;}if(c==='"'||c==="'"||c==='`'){inString=c;continue;}if(c==='{')depth++;if(c==='}'&&--depth===0)return src.slice(at,i+1);}throw Error(name);});
const context=vm.createContext({Intl,Date,Math,Number,String,state:{calendar:'persian'}});
vm.runInContext(blocks.join('\n')+`\nthis.testStatus=taskStatus;`,context);
const task=(start,history=[],end=null)=>({start,history,end,every:2,unit:'day',mode:'fixed',calendar:'persian'});
test('today is Today, not Overdue',()=>{const r=context.testStatus(task('2026-11-08'), '2026-11-08');assert.equal(r.kind,'today');assert.equal(r.last,'2026-11-08');});
test('past due completion advances next occurrence rather than marking oldest ever',()=>{const a=task('2026-10-25');let r=context.testStatus(a,'2026-11-08');assert.equal(r.kind,'today');assert.equal(r.last,'2026-11-08');a.history.push(r.last);r=context.testStatus(a,'2026-11-08');assert.equal(r.kind,'done');assert.equal(r.next,'2026-11-10');});
test('overdue badge only when actionable due is in the past',()=>{const a=task('2026-11-07');assert.equal(context.testStatus(a,'2026-11-08').kind,'overdue');a.history.push('2026-11-07');assert.equal(context.testStatus(a,'2026-11-08').kind,'done');});
test('end date stops future occurrences',()=>{const a=task('2026-11-08',['2026-11-08'],'2026-11-12');assert.equal(context.testStatus(a,'2026-11-13').kind,'ended');});
