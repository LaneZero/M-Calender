import { reminderTimestamp, shouldDispatch, markDispatched, recentDispatches } from './reminders.js';
// M Calendar v0.2.2: no external dependencies, no accounts, no network storage.
const $ = id => document.getElementById(id);
// Retain the old storage key so existing users keep their tasks after rebranding.
const STORAGE = 'ritmo-data-v1';
const APP_VERSION = 'v0.2.2';
let activeView = 'tasks';
const today = () => localISO(new Date());
function localISO(date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
function fromISO(iso) { const [y,m,d]=iso.split('-').map(Number);const result=new Date(2000,m-1,d,12);result.setFullYear(y);return result; }
function plusDays(iso,n) { const d=fromISO(iso);d.setDate(d.getDate()+n);return localISO(d); }
function daysBetween(a,b) { return Math.round((Date.UTC(...parts(b))-Date.UTC(...parts(a)))/86400000); }
function parts(iso) { const [y,m,d]=iso.split('-').map(Number);return [y,m-1,d]; }
const strings={
 fa:{tagline:'کارهای تکراری، بدون فراموشی',language:'زبان',calendar:'تقویم',eyebrow:'برنامه‌ریزی ساده',heading:'هر کاری، سر وقت خودش',subtitle:'فعالیت‌های تکرارشونده را تعریف کن و سابقه انجامشان را نگه دار.',add:'+ فعالیت جدید',all:'همه',due:'سررسید',upcoming:'آینده',tasks:'فعالیت‌ها',calendarTitle:'تقویم فعالیت‌ها',doneStat:'انجام‌شده امروز',dueStat:'سررسید تا امروز',totalStat:'فعالیت‌های فعال',export:'دریافت پشتیبان',import:'بازیابی پشتیبان',privacy:'اطلاعات فقط در همین مرورگر ذخیره می‌شوند.',hint:'نقطه سبز یعنی یک یا چند فعالیت در آن روز سررسید دارند.',empty:'هنوز فعالیتی در این بخش وجود ندارد.',edit:'ویرایش',remove:'حذف',complete:'انجام شد',undo:'بازگردانی',next:'نوبت بعد',overdue:'عقب‌افتاده',dueToday:'امروز',done:'انجام‌شده',every:'هر',day:'روز',week:'هفته',month:'ماه',fixed:'زمان‌بندی ثابت',completion:'پس از آخرین انجام',general:'عمومی',health:'سلامت',work:'کار',personal:'شخصی',dialog:'افزودن فعالیت',editDialog:'ویرایش فعالیت',name:'نام فعالیت',category:'دسته‌بندی',repeat:'فاصله تکرار',mode:'نوع زمان‌بندی',start:'تاریخ شروع',time:'ساعت (اختیاری)',explain:'در حالت ثابت، تأخیر در انجام، زمان نوبت‌های آینده را تغییر نمی‌دهد.',cancel:'انصراف',save:'ذخیره',deleteConfirm:'این فعالیت و سوابقش حذف شود؟',importConfirm:'اطلاعات فعلی با فایل پشتیبان جایگزین شود؟',invalid:'فایل پشتیبان معتبر نیست.',completed:'سابقه انجام ثبت شد.',noDue:'فعلاً سررسیدی ندارد.',selected:'روز انتخاب‌شده',never:'هنوز انجام نشده',monthWarning:'برای روزهای انتهایی ماه، سررسید در آخرین روز ماه کوتاه‌تر قرار می‌گیرد.',end:'تاریخ پایان (اختیاری)',noEnd:'بدون تاریخ پایان',endOfMonth:'تا پایان ماه',endOfYear:'تا پایان سال',chooseEnd:'انتخاب تاریخ',endBeforeStart:'تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد.',ended:'پایان‌یافته',endInfo:'آخرین روز مجاز برای زمان‌بندی فعالیت',navTasks:'فعالیت‌ها',navHelp:'راهنما',navDonate:'حمایت مالی',helpHeading:'راهنمای استفاده',helpIntro:'در چند مرحله ساده فعالیت‌های تکراری خودت را مدیریت کن.',donateHeading:'حمایت از M Calendar',donateIntro:'M Calendar رایگان است. حمایت داوطلبانه به توسعه و نگهداری آن کمک می‌کند.',donatePending:'روش پرداخت هنوز تعریف نشده است. تا پیش از افزودن لینک رسمی، هیچ پرداختی از داخل برنامه انجام نمی‌شود.',donateThanks:'همین که از برنامه استفاده کنی و بازخورد بدهی، به بهتر شدن آن کمک می‌کنی.'},
 en:{tagline:'Recurring tasks, remembered',language:'Language',calendar:'Calendar',eyebrow:'Simple scheduling',heading:'Stay on your rhythm',subtitle:'Plan repeating activities and track when you finish them.',add:'+ New task',all:'All',due:'Due',upcoming:'Upcoming',tasks:'Activities',calendarTitle:'Activity calendar',doneStat:'Completed today',dueStat:'Due through today',totalStat:'Active tasks',export:'Export backup',import:'Import backup',privacy:'Your data stays in this browser.',hint:'A green dot indicates one or more scheduled activities.',empty:'No activities in this view yet.',edit:'Edit',remove:'Delete',complete:'Mark done',undo:'Undo',next:'Next due',overdue:'Overdue',dueToday:'Today',done:'Done',every:'Every',day:'day(s)',week:'week(s)',month:'month(s)',fixed:'Fixed schedule',completion:'After last completion',general:'General',health:'Health',work:'Work',personal:'Personal',dialog:'Add activity',editDialog:'Edit activity',name:'Activity name',category:'Category',repeat:'Repeat every',mode:'Schedule mode',start:'Start date',time:'Time (optional)',explain:'A fixed schedule never shifts future occurrences after a late completion.',cancel:'Cancel',save:'Save',deleteConfirm:'Delete this activity and its history?',importConfirm:'Replace existing activities with this backup?',invalid:'Invalid backup file.',completed:'Completion saved.',noDue:'No upcoming due date.',selected:'Selected day',never:'Never completed',monthWarning:'For end-of-month dates, shorter months use their last day.',end:'End date (optional)',noEnd:'No end date',endOfMonth:'Until month end',endOfYear:'Until year end',chooseEnd:'Choose date',endBeforeStart:'End date cannot be before start date.',ended:'Ended',endInfo:'Last allowed day for scheduled occurrences',navTasks:'Activities',navHelp:'Help',navDonate:'Donate',helpHeading:'How to use M Calendar',helpIntro:'Manage recurring activities in a few simple steps.',donateHeading:'Support M Calendar',donateIntro:'M Calendar is free. Voluntary donations can support development and maintenance.',donatePending:'No payment method has been configured yet. No payments can be made in the app until an official link is added.',donateThanks:'Using the app and sharing feedback already helps make it better.'}
};
const defaults={lang:'fa',calendar:'persian',tasks:[]};
let state=load();let editId=null;let startDate=today();let selectedDate=today();let visibleMonth=today();let pickerMonth=today();let endDate=null;let pickerTarget="start";
function load(){try{const value=JSON.parse(localStorage.getItem(STORAGE));if(value&&Array.isArray(value.tasks))return {...defaults,...value};}catch{}return structuredClone(defaults);}
function persist(){localStorage.setItem(STORAGE,JSON.stringify(state));}
const reminderStrings={
 fa:{enableNotice:'فعال‌کردن اعلان‌ها',permissionGranted:'اعلان فعال است. برای بررسی عملکرد، «ارسال اعلان آزمایشی» را بزن. یادآوری زمان‌بندی‌شده فقط هنگام اجرای برنامه کار می‌کند.',permissionDenied:'مجوز اعلان مسدود شده است؛ آن را در تنظیمات مرورگر تغییر بده.',permissionPrompt:'برای هشدارهای زمان‌بندی‌شده، ابتدا مجوز اعلان را فعال کن. سپس با اعلان آزمایشی آن را بررسی کن.',permissionUnsupported:'این مرورگر اعلان وب را پشتیبانی نمی‌کند.',reminderEnabled:'یادآوری این فعالیت فعال باشد',reminderOffset:'زمان یادآوری',atTime:'در ساعت مقرر',minutesBefore:'دقیقه قبل',hourBefore:'۱ ساعت قبل',reminderHint:'اعلان فقط وقتی برنامه باز و در حال اجراست بررسی می‌شود؛ برای هشدار حیاتی به آن تکیه نکن.',notificationTitle:'یادآوری M Calendar',notificationBody:'زمان انجام فعالیت فرا رسیده است.',notificationError:'مرورگر نتوانست مجوز اعلان را فعال کند.',notificationOn:'یادآوری روشن'},
 en:{enableNotice:'Enable notifications',permissionGranted:'Notifications enabled. Use Test notification to verify delivery. Scheduled reminders work only while the app is running.',permissionDenied:'Notifications are blocked. Change permission in browser settings.',permissionPrompt:'Enable notifications, then test delivery. Scheduled reminders require the app to be running.',permissionUnsupported:'This browser does not support web notifications.',reminderEnabled:'Enable reminders for this activity',reminderOffset:'Reminder time',atTime:'At scheduled time',minutesBefore:'minutes before',hourBefore:'1 hour before',reminderHint:'Notifications are checked only while the app is open and running. Do not rely on them for critical alerts.',notificationTitle:'M Calendar reminder',notificationBody:'Your activity is due.',notificationError:'Unable to enable notification permission.',notificationOn:'Reminder on'}
};
function t(key){return reminderStrings[state.lang][key]??strings[state.lang][key];}
function dateParts(iso, calendar=state.calendar){const f=new Intl.DateTimeFormat('en-US',{calendar,numberingSystem:'latn',year:'numeric',month:'numeric',day:'numeric'});const result={};for(const part of f.formatToParts(fromISO(iso)))if(['year','month','day'].includes(part.type))result[part.type]=Number(part.value);return result;}
function dateFmt(iso, options={day:'numeric',month:'long',year:'numeric'}){return new Intl.DateTimeFormat(state.lang==='fa'?'fa-IR':'en-US',{...options,calendar:state.calendar}).format(fromISO(iso));}
function num(value){return new Intl.NumberFormat(state.lang==='fa'?'fa-IR':'en-US').format(value);}
function firstOfMonth(iso, calendar=state.calendar){const c=dateParts(iso,calendar);let cur=iso;for(let i=0;i<32&&dateParts(cur,calendar).month===c.month&&dateParts(cur,calendar).year===c.year;i++){const prior=plusDays(cur,-1),p=dateParts(prior,calendar);if(p.month!==c.month||p.year!==c.year)return cur;cur=prior;}return cur;}
function shiftMonth(iso,delta,calendar=state.calendar){const start=firstOfMonth(iso,calendar);return firstOfMonth(plusDays(start,delta>0?35:-1),calendar);}
function monthDates(iso,calendar=state.calendar){const first=firstOfMonth(iso,calendar);const next=shiftMonth(first,1,calendar);const values=[];for(let day=first;day<next;day=plusDays(day,1))values.push(day);return values;}
// Calendar-aware monthly due dates. Clamp missing dates (e.g. day 31) to month end.
function monthDue(anchor,index,calendar=state.calendar){let first=firstOfMonth(anchor,calendar);if(index>0){for(let n=0;n<index;n++)first=shiftMonth(first,1,calendar);}const days=monthDates(first,calendar);const anchorDay=dateParts(anchor,calendar).day;return days[Math.min(anchorDay,days.length)-1];}
// Presets refer to the month/year of the chosen start date in the TASK calendar.
// Store canonical Gregorian ISO dates regardless of the display calendar.
function endOfMonth(iso,calendar){const days=monthDates(iso,calendar);return days[days.length-1];}
function endOfYear(iso,calendar){const year=dateParts(iso,calendar).year;let cursor=iso;for(let i=0;i<371;i++){const next=plusDays(cursor,1);if(dateParts(next,calendar).year!==year)return cursor;cursor=next;}throw Error('Unsupported calendar year');}
function taskCalendar(){const old=state.tasks.find(task=>task.id===editId);return old?.calendar||state.calendar;}
function updateEndControls(){
 $('pick-end').textContent=endDate?dateFmt(endDate):t('noEnd');
 $('end-summary').textContent=endDate?`${t('endInfo')}: ${dateFmt(endDate)}`:t('noEnd');
 for(const [id,active] of [['end-none',!endDate],['end-month',endDate===endOfMonth(startDate,taskCalendar())],['end-year',endDate===endOfYear(startDate,taskCalendar())]])$(''+id).setAttribute('aria-pressed',String(active));
}
function setEnd(value){endDate=value;if(endDate&&endDate<startDate){endDate=null;}updateEndControls();}
function recurrenceAnchor(task){if(task.mode!=='completion'||!task.history.length)return task.start;return task.history.reduce((a,b)=>a>b?a:b);}
function getDue(task,after=today()){if(task.end&&after>task.end)return null;const withinEnd=due=>due&&(!task.end||due<=task.end)?due:null;const anchor=recurrenceAnchor(task),every=Number(task.every),step=every*(task.unit==='week'?7:1);if(task.mode==='completion'&&task.history.length){if(task.unit==='month')return withinEnd(monthDue(anchor,every,task.calendar||"gregory"));return withinEnd(plusDays(anchor,step));}
if(task.unit==='month'){for(let k=0;k<1200;k+=every){const due=monthDue(anchor,k,task.calendar||"gregory");if(task.end&&due>task.end)return null;if(due>=after&&!task.history.includes(due))return due;}return null;}
const elapsed=Math.max(0,daysBetween(anchor,after));let k=Math.max(0,Math.floor(elapsed/step));for(let i=0;i<5000;i++,k++){const due=plusDays(anchor,k*step);if(task.end&&due>task.end)return null;if(due>=after&&!task.history.includes(due))return due;}return null;}
function dueOn(task,iso){if(iso<task.start||(task.end&&iso>task.end))return false;if(task.mode==='completion'&&task.history.length)return getDue(task,'0001-01-01')===iso;if(task.unit==='month'){for(let k=0;k<360;k+=task.every){const d=monthDue(task.start,k,task.calendar||"gregory");if(d===iso)return true;if(d>iso)return false;}return false;}const divisor=task.every*(task.unit==='week'?7:1);return daysBetween(task.start,iso)%divisor===0;}
function dueUntil(task,iso=today()){const anchor=recurrenceAnchor(task);if(task.end&&iso>task.end)iso=task.end;if(anchor>iso)return false;if(task.mode==='completion'&&task.history.length){return getDue(task,'0001-01-01')<=iso;}if(task.unit==='month'){let count=0;for(let k=0;k<360;k+=task.every){const d=monthDue(task.start,k,task.calendar||"gregory");if(d>iso)break;if(!task.history.includes(d))count++;}return count>0;}
const elapsed=daysBetween(task.start,iso),step=task.every*(task.unit==='week'?7:1);return Math.floor(elapsed/step)+1>task.history.filter(h=>h<=iso&&dueOn(task,h)).length;}
// Determine the most recent scheduled occurrence at/before today. Older missed
// occurrences never make a newly completed task look permanently overdue.
function latestScheduled(task, day=today()) {
 const limit=task.end&&task.end<day?task.end:day;
 if(limit<task.start)return null;
 if(task.mode==='completion'&&task.history.length){
  const next=getDue(task,'0001-01-01');
  return next&&next<=limit?next:null;
 }
 if(task.unit==='month'){
  let last=null;
  for(let k=0;k<1200;k+=Number(task.every)){
   const due=monthDue(task.start,k,task.calendar||'gregory');
   if(due>limit)break;
   last=due;
  }
  return last;
 }
 const interval=Number(task.every)*(task.unit==='week'?7:1);
 return plusDays(task.start,Math.floor(daysBetween(task.start,limit)/interval)*interval);
}
function taskStatus(task, day=today()) {
 const last=latestScheduled(task,day);
 const completed=last!==null&&task.history.includes(last);
 const ended=!!task.end&&task.end<day;
 const pending=!!last&&!completed&&!ended;
 // On the due calendar date, classify as 'today', not overdue, irrespective of the clock time.
 const kind=pending?(last===day?'today':'overdue'):ended?'ended':completed?'done':'upcoming';
 const next=pending?last:getDue(task,plusDays(day,1));
 return {last,pending,completed,ended,kind,next};
}
function displayMessage(message){
 const box=$('action-feedback');box.textContent=message;box.hidden=false;
}
function node(tag,classes='',text=''){const el=document.createElement(tag);if(classes)el.className=classes;if(text)el.textContent=text;return el;}
// Help content is built with textContent, never user-supplied HTML.
const helpCopy = {
 fa: [
  ['۱. ایجاد فعالیت','از «فعالیت جدید» استفاده کن؛ نام، دسته‌بندی، تاریخ شروع و ساعت دلخواه را مشخص کن.'],
  ['۲. تنظیم تکرار','بازه را انتخاب کن: مثلاً هر ۲ روز، هر ۱ هفته یا هر ۱ ماه.'],
  ['۳. انتخاب زمان‌بندی','در حالت «ثابت»، دیر انجام دادن نوبت، نوبت‌های بعدی را جابه‌جا نمی‌کند. در حالت «پس از آخرین انجام»، نوبت بعد از ثبت انجام محاسبه می‌شود.'],
  ['۴. تعیین تاریخ پایان','فعالیت می‌تواند بدون پایان باشد یا تا پایان ماه، تا پایان سال یا تا تاریخ دلخواه ادامه پیدا کند. محاسبه بر اساس تقویم فعالیت است.'],
  ['۵. ثبت و مشاهده','«انجام شد» را بزن تا سابقه ثبت شود. از تقویم برای دیدن روزهای دارای فعالیت و از فیلترها برای نمایش سررسیدها استفاده کن.'],
  ['۶. تغییر زبان و تقویم','از بالای صفحه زبان فارسی/انگلیسی و نمایش تاریخ شمسی/میلادی را مستقل از یکدیگر انتخاب کن.'],
  ['۷. نگهداری اطلاعات','از «دریافت پشتیبان» فایل JSON بگیر و با «بازیابی پشتیبان» برگردان. بازیابی، داده‌های فعلی را جایگزین می‌کند.']
 ],
 en: [
  ['1. Add an activity','Select “New task”, then enter a name, category, start date and optional time.'],
  ['2. Choose a recurrence','Set an interval such as every 2 days, every week or every month.'],
  ['3. Choose scheduling behavior','“Fixed schedule” keeps future dates unchanged if you finish late. “After last completion” recalculates from the recorded completion.'],
  ['4. Set an end date','Choose no end date, end of month, end of year or a custom date. The activity’s calendar controls the calculation.'],
  ['5. Track your progress','Use “Mark done” to record a completion. Use the calendar to view scheduled days and the filters to find due activities.'],
  ['6. Switch language and calendar','Choose Persian/English language and Solar Hijri/Gregorian calendar independently in the header.'],
  ['7. Back up your data','Use “Export backup” to save a JSON file, or “Import backup” to restore it. Import replaces current data.']
 ]
};
// Donation destinations are public, user-provided receiving addresses.
// No wallet connection, blockchain API, or payment processing occurs.
const donationWallets = Object.freeze([
 {id:'btc',symbol:'₿',name:'Bitcoin',network:'Bitcoin',address:'bc1q5tl36qpk27hf7upl8l753xa0gcm57adrvmwgkz'},
 {id:'usdt',symbol:'₮',name:'Tether (USDT)',network:'TRON / TRC20',address:'TA5pibChqS7CeHiDvfP7V3uQVMynk6SxLq'},
 {id:'evm',symbol:'Ξ',name:'EVM',network:'Ethereum · BNB Smart Chain · Polygon',address:'0x6634E26BA0e323182B7A9a89278E9a7BbCa9aF70'},
 {id:'sol',symbol:'◎',name:'Solana',network:'Solana',address:'91kuBFEZAnRk8ixsuzAQnAVvtzLAsQpPFRsfe285ZKUC'}
]);
const donateText={
 fa:{network:'شبکه',copy:'کپی آدرس',copied:'کپی شد ✓',copyFail:'کپی خودکار ممکن نشد؛ آدرس را به‌صورت دستی انتخاب و کپی کن.',warning:'⚠️ قبل از انتقال رمزارز، آدرس کامل کیف پول و شبکه بلاکچین را بررسی کن. تراکنش‌های رمزارزی معمولاً برگشت‌پذیر نیستند.',disclaimer:'M Calendar به کیف پول متصل نمی‌شود، پرداختی پردازش یا انتقالی آغاز نمی‌کند، تراکنش‌ها را ردیابی نمی‌کند و اطلاعات مالی جمع‌آوری نمی‌کند.',thanks:'حمایت کاملاً اختیاری است. از همراهی شما سپاسگزاریم.'},
 en:{network:'Network',copy:'Copy address',copied:'Copied ✓',copyFail:'Automatic copy failed; select and copy the address manually.',warning:'⚠️ Always verify the complete wallet address and blockchain network before sending cryptocurrency. Cryptocurrency transactions generally cannot be reversed.',disclaimer:'M Calendar does not connect to wallets, process payments, initiate transfers, monitor transactions, or collect financial information.',thanks:'Donations are optional. Thank you for supporting the project.'}
};
function renderDonation(){
 const host=$('donate-details'),i18n=donateText[state.lang];host.replaceChildren();
 const cards=node('div','wallet-grid');
 for(const wallet of donationWallets){
  const card=node('article','wallet-card');
  const header=node('div','wallet-heading');
  const logo=node('span',`wallet-logo wallet-${wallet.id}`,wallet.symbol);logo.setAttribute('aria-hidden','true');
  const title=node('div','wallet-title');title.append(node('h2','',wallet.name),node('p','',`${i18n.network}: ${wallet.network}`));header.append(logo,title);
  const address=node('code','wallet-address',wallet.address);address.dir='ltr';address.tabIndex=0;
  const copy=node('button','secondary wallet-copy',i18n.copy);copy.type='button';copy.dataset.wallet=wallet.id;
  copy.setAttribute('aria-label',`${i18n.copy}: ${wallet.name}`);
  card.append(header,address,copy);cards.append(card);
 }
 host.append(cards,node('p','info-note donation-warning',i18n.warning),node('p','info-note',i18n.disclaimer),node('p','donate-thanks',i18n.thanks));
}
// Copy is handled via delegation so re-rendering for language switches stays safe.
$('donate-details').addEventListener('click',async e=>{
 const button=e.target.closest('button[data-wallet]');if(!button)return;
 const wallet=donationWallets.find(w=>w.id===button.dataset.wallet);if(!wallet)return;
 try{await navigator.clipboard.writeText(wallet.address);button.textContent=donateText[state.lang].copied;}
 catch{button.closest('.wallet-card').querySelector('.wallet-address').focus();alert(donateText[state.lang].copyFail);}
});
const helpWarnings={
 fa:['حریم خصوصی: اطلاعات فقط در حافظه همین مرورگر هستند. پاک‌کردن داده‌های سایت یا تغییر دستگاه می‌تواند آن‌ها را از بین ببرد؛ مرتب نسخه پشتیبان بگیر.','اعلان مرورگر فقط هنگام اجرای برنامه بررسی می‌شود. در زمان بسته‌بودن برنامه، اعلان تضمین نمی‌شود؛ اتصال مستقیم به Google Calendar هنوز وجود ندارد.','برای زمان‌بندی مصرف دارو، همواره دستور پزشک را ملاک قرار بده و زمان مصرف را خودسرانه تغییر نده.'],
 en:['Privacy: data is saved only in this browser. Clearing site data or changing devices can erase it; export backups regularly.','Reminders are checked only while the app is running. Background delivery is not supported; Google Calendar sync is not yet available.','For medication schedules, follow your clinician’s instructions and do not independently shift prescribed doses.']
};
function renderInformation(){
 $('app-version').textContent=APP_VERSION;
 for(const [id,key] of [['nav-tasks','navTasks'],['nav-help','navHelp'],['nav-donate','navDonate'],['help-heading','helpHeading'],['help-intro','helpIntro'],['donate-heading','donateHeading'],['donate-intro','donateIntro']])$(id).textContent=t(key);
 const steps=$('help-steps');steps.replaceChildren();
 for(const [heading,description] of helpCopy[state.lang]){const section=node('article','info-item');section.append(node('h2','',heading),node('p','',description));steps.append(section);}
 const notes=$('help-notes');notes.replaceChildren();
 for(const warning of helpWarnings[state.lang])notes.append(node('p','info-note',warning));
 renderDonation();
 for(const view of ['tasks','help','donate']){$(`view-${view}`).hidden=view!==activeView;const button=$(`nav-${view}`);button.classList.toggle('selected',view===activeView);if(view===activeView)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');}
}
for(const button of document.querySelectorAll('.nav-button'))button.addEventListener('click',()=>{activeView=button.dataset.view;renderInformation();});
function applyLanguage(){document.documentElement.lang=state.lang;document.documentElement.dir=state.lang==='fa'?'rtl':'ltr';const ids={tagline:'tagline','language-label':'language','calendar-label':'calendar',eyebrow:'eyebrow',heading:'heading',subtitle:'subtitle','add-button':'add','tasks-heading':'tasks','calendar-heading':'calendarTitle','export-button':'export','import-label':'import','calendar-hint':'hint',privacy:'privacy','name-label':'name','category-label':'category','repeat-label':'repeat','schedule-label':'mode','start-label':'start','end-label':'end','time-label':'time','schedule-explanation':'explain','cancel-button':'cancel','save-button':'save'};for(const [id,key] of Object.entries(ids))$(id).textContent=t(key);const groups={'task-filter':['all','due','upcoming'],'task-category':['general','health','work','personal'],'repeat-unit':['day','week','month'],'schedule-mode':['fixed','completion']};for(const [id,keys] of Object.entries(groups))keys.forEach((key,i)=>$(id).options[i].textContent=t(key));for(const [id,key] of [['end-none','noEnd'],['end-month','endOfMonth'],['end-year','endOfYear']])$(id).textContent=t(key);$('reminder-enabled-label').textContent=t('reminderEnabled');$('reminder-offset-label').textContent=t('reminderOffset');$('reminder-hint').textContent=t('reminderHint');document.querySelectorAll('input[name=reminder-offset]').forEach(input=>{const minutes=Number(input.value);const label=input.closest('label').querySelector('.reminder-choice-text');label.textContent=minutes===0?t('atTime'):minutes===60?t('hourBefore'):`${num(minutes)} ${t('minutesBefore')}`;});if($('editor').open)updateEndControls();}
function render(){applyLanguage();updateNotificationStatus();renderInformation();$('language').value=state.lang;$('calendar-system').value=state.calendar;const todayKey=today();const dueCount=state.tasks.filter(task=>taskStatus(task,todayKey).pending).length;const todayCount=state.tasks.reduce((n,task)=>n+task.history.filter(h=>h===todayKey).length,0);$('stats').replaceChildren(...[['totalStat',state.tasks.length],['dueStat',dueCount],['doneStat',todayCount]].map(([key,value])=>{const el=node('div','stat');el.append(node('span','',t(key)),node('strong','',num(value)));return el;}));renderTasks();renderMonth();}
function renderTasks(){
 const filter=$('task-filter').value, day=today();
 const tasks=[...state.tasks].sort((a,b)=>(taskStatus(a,day).next||'9999').localeCompare(taskStatus(b,day).next||'9999'));
 const list=$('task-list');list.replaceChildren();
 for(const task of tasks){
  const status=taskStatus(task,day);
  if((filter==='due'&&!status.pending)||(filter==='upcoming'&&status.pending))continue;
  const card=node('article','task');card.dataset.taskId=task.id;
  const top=node('div','task-top'),heading=node('div');
  heading.append(node('h3','',task.name),node('p','',`${t(task.category)} · ${t('every')} ${num(task.every)} ${t(task.unit)} · ${t(task.mode)}`));
  const badges={today:t('dueToday'),overdue:t('overdue'),ended:t('ended'),done:t('done'),upcoming:t('upcoming')};
  const badge=node('span',`badge ${status.kind==='overdue'?'due':status.kind==='done'?'done':''}`,badges[status.kind]);
  top.append(heading,badge);
  card.append(top,node('p','',`${t('next')}: ${status.next?dateFmt(status.next):t('noDue')}${task.time?' · '+task.time:''}${task.end?' · '+t('end')+': '+dateFmt(task.end):''}`));
  const actions=node('div','task-actions');
  const finish=node('button','primary',t('complete'));finish.type='button';
  finish.disabled=!status.pending;
  finish.addEventListener('click',()=>{
   const current=taskStatus(task,today());
   if(!current.pending||!current.last)return;
   // Record the latest actionable occurrence, never an ancient occurrence.
   task.history=[...new Set([...task.history,current.last])].sort();
   persist();render();displayMessage(`${t('completed')} · ${task.name} · ${dateFmt(current.last)}`);
  });
  const edit=node('button','secondary',t('edit'));edit.type='button';edit.addEventListener('click',()=>openEditor(task));
  const remove=node('button','secondary',t('remove'));remove.type='button';remove.addEventListener('click',()=>{if(confirm(t('deleteConfirm'))){state.tasks=state.tasks.filter(a=>a.id!==task.id);persist();render();}});
  actions.append(finish,edit,remove);
  if(task.history.length){const undo=node('button','secondary',t('undo'));undo.type='button';undo.addEventListener('click',()=>{task.history.sort();task.history.pop();persist();render();});actions.append(undo);}
  card.append(actions);list.append(card);
 }
 if(!list.childElementCount)list.append(node('p','empty',t('empty')));
}
function weekdayIndex(iso){const weekday=fromISO(iso).getDay();return (weekday-(state.calendar==='persian'?6:0)+7)%7;}
function weekdayNames(){const start=state.calendar==='persian'?6:0;return Array.from({length:7},(_,i)=>{const d=new Date(2026,10,1);d.setDate(d.getDate()+(start+i-d.getDay()+7)%7);return new Intl.DateTimeFormat(state.lang==='fa'?'fa-IR':'en-US',{weekday:'short'}).format(d);});}
function drawCalendar(month,where,head,daysHost,onSelect){$(head).textContent=dateFmt(month,{month:'long',year:'numeric'});const first=firstOfMonth(month),dates=monthDates(month);$(where).replaceChildren(...weekdayNames().map(s=>node('span','',s)));const grid=$(daysHost);grid.replaceChildren();for(let i=0;i<weekdayIndex(first);i++)grid.append(node('span'));for(const iso of dates){const isSelected=iso===(daysHost==='picker-days'?(pickerTarget==='start'?startDate:endDate):selectedDate);const day=node('button',`day ${iso===today()?'today ':''}${isSelected?'active ':''}${daysHost==='calendar-grid'&&state.tasks.some(task=>dueOn(task,iso))?'has-task':''}`,num(dateParts(iso).day));day.type='button';day.setAttribute('aria-label',dateFmt(iso));day.addEventListener('click',()=>onSelect(iso));grid.append(day);}}
function renderMonth(){drawCalendar(visibleMonth,'weekdays','month-title','calendar-grid',iso=>{selectedDate=iso;renderMonth();const tasks=state.tasks.filter(task=>dueOn(task,iso));$('calendar-hint').textContent=`${dateFmt(iso)}: ${tasks.length?tasks.map(x=>x.name).join('، '):t('empty')}`;});}
function renderPicker(){drawCalendar(pickerMonth,'picker-weekdays','picker-month','picker-days',iso=>{if(pickerTarget==='start'){startDate=iso;$('pick-start').textContent=dateFmt(iso);if(endDate&&endDate<startDate)endDate=null;}else if(iso>=startDate){endDate=iso;}else{alert(t('endBeforeStart'));return;}updateEndControls();$('date-picker').hidden=true;});}
// Radio options avoid invisible native select popups on mobile Safari/Chromium.
function getReminderOffset(){return Number(document.querySelector('input[name=reminder-offset]:checked')?.value??0);}
function setReminderOffset(minutes){const input=document.querySelector(`input[name=reminder-offset][value="${Number(minutes)}"]`)||document.querySelector('input[name=reminder-offset][value="0"]');if(input)input.checked=true;}
function openEditor(task=null){editId=task?.id||null;$('dialog-title').textContent=t(task?'editDialog':'dialog');$('task-name').value=task?.name||'';$('task-category').value=task?.category||'general';$('repeat-every').value=task?.every||2;$('repeat-unit').value=task?.unit||'day';$('schedule-mode').value=task?.mode||'fixed';$('task-time').value=task?.time||'09:00';$('reminder-enabled').checked=task?.reminder?.enabled===true;setReminderOffset(task?.reminder?.offsetMinutes??0);startDate=task?.start||today();endDate=task?.end||null;pickerTarget='start';pickerMonth=startDate;$('pick-start').textContent=dateFmt(startDate);$('date-picker').hidden=true;renderPicker();$('editor').showModal();updateEndControls();$('task-name').focus();}
$('language').addEventListener('change',e=>{state.lang=e.target.value;persist();render();});$('calendar-system').addEventListener('change',e=>{state.calendar=e.target.value;persist();render();});$('task-filter').addEventListener('change',renderTasks);$('add-button').addEventListener('click',()=>openEditor());$('close-dialog').addEventListener('click',()=>$('editor').close());$('cancel-button').addEventListener('click',()=>$('editor').close());$('prev-month').addEventListener('click',()=>{visibleMonth=shiftMonth(visibleMonth,-1);renderMonth();});$('next-month').addEventListener('click',()=>{visibleMonth=shiftMonth(visibleMonth,1);renderMonth();});$('pick-start').addEventListener('click',()=>{pickerTarget='start';pickerMonth=startDate;$('pick-start').after($('date-picker'));$('date-picker').hidden=!$('date-picker').hidden;renderPicker();});$('pick-end').addEventListener('click',()=>{pickerTarget='end';pickerMonth=endDate||startDate;$('pick-end').after($('date-picker'));$('date-picker').hidden=!$('date-picker').hidden;renderPicker();});$('end-none').addEventListener('click',()=>setEnd(null));$('end-month').addEventListener('click',()=>setEnd(endOfMonth(startDate,taskCalendar())));$('end-year').addEventListener('click',()=>setEnd(endOfYear(startDate,taskCalendar())));$('picker-prev').addEventListener('click',()=>{pickerMonth=shiftMonth(pickerMonth,-1);renderPicker();});$('picker-next').addEventListener('click',()=>{pickerMonth=shiftMonth(pickerMonth,1);renderPicker();});
$('task-form').addEventListener('submit',e=>{e.preventDefault();const name=$('task-name').value.trim(),every=Number($('repeat-every').value);if(!name||!Number.isInteger(every)||every<1||every>365)return;if(endDate&&endDate<startDate){alert(t('endBeforeStart'));return;}const old=state.tasks.find(task=>task.id===editId);const task={id:old?.id||crypto.randomUUID(),name,category:$('task-category').value,every,unit:$('repeat-unit').value,mode:$('schedule-mode').value,start:startDate,end:endDate,time:$('task-time').value,calendar:old?.calendar||state.calendar,history:old?.history||[],reminder:{enabled:$('reminder-enabled').checked,offsetMinutes:getReminderOffset()}};if(old)Object.assign(old,task);else state.tasks.push(task);
// A newly saved activity should always appear, regardless of the previous filter.
$('task-filter').value='all';
activeView='tasks';persist();$('editor').close();render();
displayMessage(`${t('save')} · ${task.name}`);
// Scroll to the newly saved card after the modal has closed.
requestAnimationFrame(()=>{const card=[...document.querySelectorAll('#task-list .task')].find(el=>el.dataset.taskId===task.id);card?.scrollIntoView({block:'nearest',behavior:'auto'});});});
$('export-button').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({version:1,...state},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`m-calendar-backup-${today()}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('import-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>2_000_000)throw Error('size');const json=JSON.parse(await file.text());if(!Array.isArray(json.tasks)||json.tasks.length>2000||!json.tasks.every(task=>typeof task.name==='string'&&task.name.length<=100&&task.name.length>0&&['general','health','work','personal'].includes(task.category)&&Number.isInteger(task.every)&&task.every>=1&&task.every<=365&&['day','week','month'].includes(task.unit)&&['fixed','completion'].includes(task.mode)&&/^\d{4}-\d{2}-\d{2}$/.test(task.start)&&(task.end==null||/^\d{4}-\d{2}-\d{2}$/.test(task.end)&&task.end>=task.start)&&(task.reminder==null||(typeof task.reminder==='object'&&typeof task.reminder.enabled==='boolean'&&[0,5,15,30,60].includes(task.reminder.offsetMinutes)))&&Array.isArray(task.history)&&task.history.length<10000&&task.history.every(h=>/^\d{4}-\d{2}-\d{2}$/.test(h))))throw Error('schema');if(confirm(t('importConfirm'))){state={lang:json.lang==='en'?'en':'fa',calendar:json.calendar==='gregory'?'gregory':'persian',tasks:json.tasks.map(x=>({...x,id:crypto.randomUUID(),time:typeof x.time==='string'?x.time:'',calendar:x.calendar==='persian'?'persian':'gregory',end:x.end||null,history:[...new Set(x.history)],reminder:{enabled:x.reminder?.enabled===true,offsetMinutes:[0,5,15,30,60].includes(x.reminder?.offsetMinutes)?x.reminder.offsetMinutes:0}}))};persist();render();}}catch{alert(t('invalid'));}e.target.value='';});
// Notification permission must be requested directly in a user gesture (Firefox/Chrome).
$('notification-permission').addEventListener('click',async()=>{
 if(!('Notification' in window)||!window.isSecureContext)return;
 try{const permission=await Notification.requestPermission();updateNotificationStatus();
  if(permission==='granted')await scanReminders();}
 catch{displayMessage(t('notificationError'));}
});
$('notification-test').addEventListener('click',async()=>{
 try{await showBrowserNotification(t('notificationTitle'),state.lang==='fa'?'این یک اعلان آزمایشی است.':'This is a test notification.',`mcalendar-test-${Date.now()}`);
  displayMessage(state.lang==='fa'?'اعلان آزمایشی ارسال شد؛ تنظیمات سیستم را هم بررسی کن.':'Test notification sent; check system notification settings.');}
 catch(error){displayMessage((state.lang==='fa'?'ارسال اعلان ناموفق بود: ':'Notification failed: ')+(error?.message||String(error)));}
});
async function showBrowserNotification(title,body,tag){
 if(!('Notification' in window)||Notification.permission!=='granted')throw Error('Permission not granted');
 const options={body,tag,icon:'./icon.svg'};
 // Service worker notifications work on Chrome/Firefox mobile where new Notification() may throw.
 if('serviceWorker' in navigator){
  const registration=await navigator.serviceWorker.getRegistration();
  if(registration?.active&&typeof registration.showNotification==='function'){await registration.showNotification(title,options);return;}
 }
 const notice=new Notification(title,options);
 notice.onclick=()=>{window.focus();notice.close();};
}
function updateNotificationStatus(){
 const supported=('Notification' in window)&&window.isSecureContext;
 const permission=supported?Notification.permission:'unsupported';
 $('notification-permission').hidden=!supported||permission!=='default';
 $('notification-test').hidden=!supported||permission!=='granted';
 $('notification-permission').textContent=t('enableNotice');
 $('notification-test').textContent=state.lang==='fa'?'ارسال اعلان آزمایشی':'Test notification';
 const hint=permission==='denied'?(state.lang==='fa'?'اعلان مسدود است. از تنظیمات مجوزهای سایت در مرورگر اجازه بده.':'Notifications are blocked. Allow them in browser site settings.'):t(permission==='granted'?'permissionGranted':permission==='default'?'permissionPrompt':'permissionUnsupported');
 $('notification-status').textContent=hint;
}
// In-page scheduler only. No claim of background delivery after browser closure.
const REMINDER_LOG='m-calendar-reminder-log-v1';
let scanInProgress=false;
async function scanReminders(){
 if(scanInProgress||!('Notification' in window)||Notification.permission!=='granted')return;
 scanInProgress=true;
 try{
  const now=new Date(), todayKey=localISO(now), tomorrow=plusDays(todayKey,1);
  let log;try{log=JSON.parse(localStorage.getItem(REMINDER_LOG))||{};}catch{log={};}
  log=recentDispatches(log,now.getTime());
  for(const task of state.tasks){
   if(task.reminder?.enabled!==true||!/^([01]\d|2[0-3]):[0-5]\d$/.test(task.time||''))continue;
   for(const dueDate of [todayKey,tomorrow]){
    if(!dueOn(task,dueDate)||task.history.includes(dueDate))continue;
    const timestamp=reminderTimestamp(dueDate,task.time,task.reminder.offsetMinutes||0);
    const id=JSON.stringify([task.id,dueDate,task.time,task.reminder.offsetMinutes||0]);
    if(!shouldDispatch(now.getTime(),timestamp,log[id]))continue;
    try{
     await showBrowserNotification(t('notificationTitle'),`${task.name} · ${task.time}`,`mcalendar-${task.id}-${dueDate}`);
     log=markDispatched(log,id,now.getTime());
     localStorage.setItem(REMINDER_LOG,JSON.stringify(log));
    }catch(error){console.warn('Notification delivery failed:',error);}
   }
  }
 }finally{scanInProgress=false;}
}

render();scanReminders();setInterval(scanReminders,30000);window.addEventListener('focus',scanReminders);document.addEventListener('visibilitychange',()=>{if(!document.hidden)scanReminders();});if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(error=>console.warn('Service worker registration failed:',error));
