// Static regression guards for iOS-aware notification flows and readable UI.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const js=read('src.js'),html=read('index.html'),css=read('styles.css');
test('branded notifications include exact task name and category emoji',()=>{
 assert.match(js,/`M Calendar · \${emoji} \${task.name}`/);
 for(const emoji of ['📌','💊','💼','🌿'])assert.ok(js.includes(emoji));
 assert.match(js,/const content=reminderCopy\(task,dueDate\)/);
});
test('notification waits for worker and avoids unsupported iPhone constructor path',()=>{
 assert.match(js,/navigator\.serviceWorker\.ready/);
 assert.match(js,/registration\.showNotification\(title,options\)/);
 assert.match(js,/iPhone\|iPad\|iPod/);
 assert.match(js,/display-mode: standalone/);
});
test('themes moved into Settings without losing language and calendar controls',()=>{
 assert.match(html,/<details class="settings-panel"/);
 assert.match(html,/id="theme-picker"/);
 assert.match(html,/id="calendar-system"/);
 assert.match(html,/id="language"/);
 assert.match(css,/\.settings-panel\[open\] \.settings/);
});
