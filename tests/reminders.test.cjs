const assert=require('node:assert/strict');
const test=require('node:test');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
// Import the pure module via a data URI to keep this project dependency-free.
const code=fs.readFileSync(path.join(__dirname,'..','reminders.js'),'utf8');
test('reminder scheduling, deduplication and input validation',async()=>{
 const mod=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
 const at=mod.reminderTimestamp('2026-11-08','09:00',15);
 assert.equal(new Date(at).getHours(),8);
 assert.equal(new Date(at).getMinutes(),45);
 assert.equal(mod.shouldDispatch(at,at,undefined),true);
 assert.equal(mod.shouldDispatch(at+10*60000,at,undefined),true);
 assert.equal(mod.shouldDispatch(at+11*60000,at,undefined),false);
 assert.equal(mod.shouldDispatch(at-1000,at,undefined),false);
 const log=mod.markDispatched({},'activity-1',at);
 assert.equal(mod.shouldDispatch(at,at,log['activity-1']),false);
 assert.equal(mod.reminderTimestamp('2026-02-30','09:00',0),NaN);
 assert.equal(mod.reminderTimestamp('2026-11-08','25:00',0),NaN);
 assert.equal(mod.reminderTimestamp('2026-11-08','09:00',999),NaN);
 assert.equal(new Date(mod.reminderTimestamp('2026-11-09','00:30',60)).getDate(),8);
 assert.deepEqual(mod.recentDispatches({'old':at-36*86400000,'new':at},at),{'new':at});
});
