const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(require('path').join(__dirname,'..','src.js'),'utf8');
const cut=src.replace(/^import .*\n/, '').split('function node(')[0];
const context={Intl,Date,Math,Number,String,JSON,structuredClone,localStorage:{getItem:()=>null},document:{getElementById:()=>null},console};vm.createContext(context);vm.runInContext(cut,context);
const evalExpr=expr=>vm.runInContext(expr,context);
function isoNear(end,cal,yr,mo){let iso='2024-01-01';for(let i=0;i<1300;i++){const p=evalExpr(`dateParts('${iso}','${cal}')`);if(p.year===yr&&p.month===mo)return iso;iso=evalExpr(`plusDays('${iso}',1)`);}throw Error('not found')}
function task(start,end,cal='gregory',unit='day',every=2){return {start,end,calendar:cal,unit,every,mode:'fixed',history:[]}}
assert.equal(evalExpr("endOfMonth('2024-02-03','gregory')"),'2024-02-29');
assert.equal(evalExpr("endOfMonth('2025-02-03','gregory')"),'2025-02-28');
assert.equal(evalExpr("endOfYear('2024-06-01','gregory')"),'2024-12-31');
for(const year of [1403,1404,1405]){const start=isoNear('','persian',year,12);const mEnd=evalExpr(`endOfMonth('${start}','persian')`);const yEnd=evalExpr(`endOfYear('${start}','persian')`);assert.equal(mEnd,yEnd);const next=evalExpr(`plusDays('${mEnd}',1)`);assert.equal(evalExpr(`dateParts('${next}','persian').year`),year+1);console.log('Persian year',year,'ends',yEnd,'month length',evalExpr(`dateParts('${mEnd}','persian').day`))}
context.task=task('2024-02-27','2024-02-29');assert.equal(evalExpr("getDue(task,'2024-02-27')"),'2024-02-27');assert.equal(evalExpr("getDue(task,'2024-02-28')"),'2024-02-29');assert.equal(evalExpr("getDue(task,'2024-03-01')"),null);assert.equal(evalExpr("dueOn(task,'2024-03-02')"),false);assert.equal(evalExpr("dueUntil(task,'2024-03-01')"),true);
context.task=task('2024-12-31','2024-12-31');assert.equal(evalExpr("getDue(task,'2025-01-01')"),null);
console.log('All calendar and end-date tests passed');
