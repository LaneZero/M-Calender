// Ensure the shipped bilingual documentation describes the tested iPhone setup.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const get = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
test('in-app guidance covers Home Screen installation and notification verification in both languages', () => {
 const source = get('src.js');
 assert.match(source, /Add to Home Screen/);
 assert.match(source, /ارسال اعلان آزمایشی/);
 assert.match(source, /Test notification/);
 assert.match(source, /iOS 16\.4/);
 assert.match(source, /هنگام اجرای برنامه/);
});
test('public README documents verified test and background limitation', () => {
 const readme = get('README.md');
 assert.match(readme, /Safari/);
 assert.match(readme, /Home Screen/);
 assert.match(readme, /اعلان آزمایشی/);
 assert.match(readme, /Real-device observation/);
 assert.match(readme, /background delivery/);
});
