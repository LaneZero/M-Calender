// Pure local-time reminder calculations, shared by the app and tests.
// dateISO is a Gregorian YYYY-MM-DD date; JS Date is intentionally constructed in local time.
export function reminderTimestamp(dateISO, hhmm, offsetMinutes = 0) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(hhmm) || ![0,5,15,30,60].includes(offsetMinutes)) return NaN;
  const [year, month, day] = dateISO.split('-').map(Number);
  const [hours, minutes] = hhmm.split(':').map(Number);
  const scheduled = new Date(2000, month - 1, day, hours, minutes);
  scheduled.setFullYear(year);
  if (scheduled.getFullYear() !== year || scheduled.getMonth() !== month-1 || scheduled.getDate() !== day) return NaN;
  return scheduled.getTime() - offsetMinutes * 60000;
}
// At most ten minutes late: avoid outdated alerts when a sleeping tab resumes.
export function shouldDispatch(now, target, sentAt, graceMs = 10 * 60000) {
  return Number.isFinite(target) && Number.isFinite(now) && !sentAt && now >= target && now - target <= graceMs;
}
export function markDispatched(log, key, timestamp) { return {...log, [key]: timestamp}; }
export function recentDispatches(log, now) {
  return Object.fromEntries(Object.entries(log).filter(([,at]) => Number.isFinite(at) && at >= now - 35*86400000 && at <= now + 86400000).slice(-5000));
}
