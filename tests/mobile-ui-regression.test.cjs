// Source-level regression guards; real-device browser checks are still required.
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
test('task save resets list filter and schedules repaint after modal close', () => {
  assert.match(source, /\$\('task-filter'\)\.value='all';[\s\S]*?activeView='tasks';persist\(\);\$\('editor'\)\.close\(\);render\(\)/);
  assert.match(source, /card\?\.scrollIntoView/);
});
test('reminder offsets are visible radio controls and retain existing minute values', () => {
  const choices = [...html.matchAll(/name="reminder-offset" value="(\d+)"/g)].map(m=>Number(m[1]));
  assert.deepEqual(choices, [0, 5, 15, 30, 60]);
  assert.match(css, /\.reminder-choice:has\(input:checked\)/);
  assert.doesNotMatch(source, /\$\('reminder-offset'\)\.options\.forEach/);
  assert.match(source, /offsetMinutes:getReminderOffset\(\)/);
  assert.match(source, /setReminderOffset\(task\?\.reminder\?\.offsetMinutes\?\?0\)/);
});
