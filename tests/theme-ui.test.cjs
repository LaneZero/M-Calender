// Guard against losing theme settings, translation keys, or PWA offline styles.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const root=path.join(__dirname,'..');
const get=file=>fs.readFileSync(path.join(root,file),'utf8');
const js=get('src.js'),html=get('index.html'),css=get('themes.css'),sw=get('sw.js');
test('all five themes are selectable, keyboard accessible, and stored in existing app state',()=>{
 const themes=[...html.matchAll(/data-set-theme="([^"]+)"/g)].map(x=>x[1]);
 assert.deepEqual(themes,['mist','sage','lavender','peach','midnight']);
 assert.match(js,/const STORAGE = 'ritmo-data-v1'/);
 assert.match(js,/theme:THEMES\.includes\(value\.theme\)\?value\.theme:'mist'/);
 assert.match(js,/state\.theme=selected;persist\(\);applyTheme\(\)/);
 assert.match(js,/theme:THEMES\.includes\(json\.theme\)\?json\.theme:'mist'/);
 assert.match(html,/aria-pressed="true"/);
});
test('slogans are bilingual, appearance is independent of calendar selection',()=>{
 assert.match(js,/برنامه‌ات روشن، ذهنت آسوده/);
 assert.match(js,/Plan with ease\. Stay on track\./);
 assert.match(html,/id="footer-slogan"/);
 assert.match(js,/document\.documentElement\.dataset\.theme=theme/);
 assert.match(js,/\$\('calendar-system'\)\.addEventListener\('change'/);
});
test('theme styles are cached with versioned service worker and include mobile accessibility',()=>{
 assert.match(html,/href="\.\/themes\.css"/);
 assert.match(sw,/m-calendar-shell-v0\.2\.3/);
 assert.match(sw,/'\.\/themes\.css'/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/min-height:44px/);
 assert.match(css,/focus-visible/);
});
