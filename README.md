<div align="center">

# 📅 M Calendar

### Your recurring activities, organized. | فعالیت‌های تکراری، همیشه در برنامه

**A lightweight, offline-first Progressive Web App for recurring tasks, with English/Persian interfaces and Gregorian/Solar Hijri calendars.**

**یک وب‌اپلیکیشن پیش‌رونده و سبک برای مدیریت فعالیت‌های تکرارشونده، با رابط فارسی و انگلیسی و تقویم شمسی و میلادی.**

![Version](https://img.shields.io/badge/version-v0.2.2-2563eb?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-offline--first-16a34a?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-64748b?style=flat-square)
![Backend](https://img.shields.io/badge/backend-not%20required-64748b?style=flat-square)

**[English](#english) · [فارسی](#فارسی) · [Support](#support--feedback) · [Changelog](#changelog)**

</div>

> **Current app release: v0.2.2.** This README describes the actual features available in that release. It does not imply that background push notifications, Google Calendar sync, or multi-device sync are already implemented.
>
> **GitHub links:** Replace `YOUR-USERNAME` in the examples below with the account or organization that hosts `m-calendar`. The public repository URL has not been independently verified.

---

<a id="english"></a>
## 🇬🇧 English

### Overview

M Calendar helps you plan activities that repeat every **N days, weeks, or months**, see what is due, record completions, and optionally receive browser notifications **while the app is running**. It runs without an account or server-side database and is designed to work on mobile and desktop.

### Features in v0.2.2

| Area | What is available |
| --- | --- |
| 🌍 Language | Persian and English; RTL/LTR layout switches with the language. |
| 🗓️ Calendar | Solar Hijri (Persian) and Gregorian; display calendar is independent of UI language. |
| 🔁 Recurrence | Every N days, weeks, or months; fixed schedule or interval after completion. |
| 📆 End date | No end date, end of month, end of year, or manually selected end date; month/year presets follow the task's calendar. |
| ✅ Activity tracking | Due/upcoming/all filters, monthly calendar, completion history, undo, edit, and delete. |
| 🔔 Reminders | Optional per-task notification at the scheduled time or 5, 15, 30, or 60 minutes before; **only while open/running**. |
| 💾 Storage | Local browser storage, JSON export, and JSON import (which **replaces** current data). |
| 📱 PWA | Installable app shell and offline-first support after successful initial loading/caching. |
| ❓ Help & Donate | In-app bilingual help and voluntary crypto donation information. |
| 🛠️ v0.2.2 fixes | Newly saved tasks return the list filter to **All**; reminder lead-time uses touch-friendly radio options. |

### Quick start

1. Open the deployed M Calendar website in a supported browser.
2. Select **English** or **فارسی**, and choose **Gregorian** or **Persian** independently.
3. Click **New task**. Enter a name, category, recurrence interval, scheduling mode, start date, optional end date, and time.
4. To enable reminders, turn on the task's reminder option, choose a lead time, save, and click **Enable browser notifications** when prompted by the in-app control.
5. Use **All / Due / Upcoming** to navigate activities, and **Mark done** to record a completion.
6. Use **Export backup** periodically. Store the JSON file somewhere safe; **Import backup** overwrites the current task collection after confirmation.

**Example:** A fixed task starting on the 6th and repeating every 2 days is scheduled on the 6th, 8th, 10th, etc. A completion-based schedule recalculates the next occurrence from the recorded completion. For monthly schedules, shorter months use their last day when needed.

### Reminder limitations (read before relying on them)

- The app checks eligible reminders approximately every **30 seconds** and when the page regains focus.
- **The page/PWA must remain open and running.** There is no background push service and no guarantee of delivery when the app is closed, suspended, offline without an active page, or unable to display notifications.
- Browser notification permission, a supported browser, and a secure context (**HTTPS** or **localhost**) are required. OS settings may also suppress alerts.
- Delayed checks can skip old reminders. Notification delivery is **not an exact-time alarm**.
- Never use M Calendar as the sole reminder for medication or another safety-critical activity. Follow the prescribed schedule; do not automatically shift medical doses after a late completion.

### Install / run locally

**Requirements:** Modern browser, Python 3 for the simple local server. No npm dependencies are needed to use the app.

```bash
# Run from the folder containing index.html
python -m http.server 8080
```

Open **http://localhost:8080**. Do not test the service worker using `file://` URLs.

**Hosting on GitHub Pages:** In your repository, open **Settings → Pages → Build and deployment → Deploy from a branch**; choose `main` and `/ (root)`. The expected URL format is:

```text
https://YOUR-USERNAME.github.io/m-calendar/
```

**Install as a PWA:** Use your browser's installation / Add to Home Screen option when available. Installation prompts depend on browser and platform; an HTTPS website being accessible does not by itself prove installation support.

### Project files

```text
m-calendar/
├── index.html              # Application markup
├── styles.css              # Responsive UI styles
├── src.js                  # State, calendar and UI logic
├── reminders.js            # Reminder timing / deduplication helpers
├── sw.js                   # Offline shell service worker
├── manifest.webmanifest    # PWA metadata
├── icon.svg                # App icon
├── tests/                  # Node.js regression tests
├── LICENSE                 # MIT license
└── README.md
```

### Development & tests

Run the test suite from the project root with a current Node.js release:

```bash
node --test tests/*.cjs
```

The tests cover scheduling/end dates, reminder helpers and selected mobile UI regressions. **They do not substitute for real-device testing**, especially mobile Safari, Android notification permissions and PWA installation.

### Publishing updates

After testing and copying the updated project files into your local Git repository:

```powershell
# Documentation-only update to the existing v0.2.2 app
git status
git add README.md
git commit -m "docs: improve bilingual README and support guide"
git push origin main
```

For a **future actual application version** (example `v0.2.2`), update the version in the app files, service-worker cache name and README first; verify tests, then:

```powershell
 git add .
git commit -m "fix: release M Calendar v0.2.2"
git push origin main
git tag -a v0.2.2 -m "M Calendar v0.2.2"
git push origin v0.2.2
 # Optional: requires authenticated GitHub CLI
gh release create v0.2.2 --title "M Calendar v0.2.2" --generate-notes
```

**Do not recreate `v0.2.2` if it already exists.** GitHub Pages normally redeploys on pushes to the configured publishing branch; creating a tag or release alone does not update the website. Browser/PWA caches can delay what users see.

---

<a id="فارسی"></a>
## 🇮🇷 فارسی

### معرفی

**M Calendar** یک برنامه تحت وب قابل نصب (PWA) برای برنامه‌ریزی و ثبت فعالیت‌های تکراری است. می‌توانید کارهایی مثل مطالعه، ورزش یا مصرف مکمل را با فاصله زمانی مشخص تعریف کنید، سررسیدهای بعدی را ببینید و سابقه انجام آن‌ها را نگه دارید. استفاده از امکانات فعلی به ساخت حساب کاربری یا سرور اختصاصی نیاز ندارد.

### امکانات نسخه ۰٫۲٫۱

- **دو زبان مستقل از تقویم:** فارسی (راست‌به‌چپ) و انگلیسی (چپ‌به‌راست)، همراه با تاریخ شمسی یا میلادی.
- **تکرار قابل تنظیم:** هر تعداد روز، هفته یا ماه؛ با برنامه ثابت یا محاسبه نوبت بعد از آخرین انجام.
- **تاریخ پایان:** بدون پایان، پایان ماه، پایان سال یا انتخاب روز دلخواه؛ مطابق تقویم ذخیره‌شده برای فعالیت.
- **مدیریت فعالیت‌ها:** افزودن، ویرایش، حذف، ثبت انجام، بازگردانی، فیلتر فعالیت‌ها و تقویم ماهانه.
- **یادآوری:** ساعت مقرر یا ۵، ۱۵، ۳۰ و ۶۰ دقیقه زودتر، فقط وقتی برنامه باز و در حال اجرا باشد.
- **پشتیبان‌گیری JSON:** خروجی گرفتن و بازیابی؛ **بازیابی، اطلاعات فعلی را جایگزین می‌کند.**
- **قابلیت نصب و کار آفلاین:** پس از بارگذاری اولیه و ذخیره موفق فایل‌های برنامه در کش مرورگر.
- **راهنما و حمایت مالی:** بخش‌های فارسی و انگلیسی داخل برنامه.

### راهنمای سریع استفاده

1. از بالای صفحه، زبان برنامه و نوع تقویم را انتخاب کنید.
2. روی **«فعالیت جدید»** بزنید و عنوان، دسته‌بندی، فاصله تکرار، حالت زمان‌بندی و تاریخ شروع را مشخص کنید.
3. در صورت نیاز، تاریخ پایان را روی **بدون پایان / پایان ماه / پایان سال / تاریخ دلخواه** قرار دهید.
4. برای یادآوری، ساعت فعالیت را تعیین کنید، گزینه یادآوری را روشن کنید و فاصله هشدار را انتخاب کنید. سپس از بخش بالای صفحه مجوز اعلان مرورگر را فعال کنید.
5. با دکمه **«انجام شد»** سابقه ثبت کنید؛ برای دیدن فعالیت‌ها از فیلتر **همه، سررسید و آینده** استفاده کنید.
6. از گزینه **«دریافت پشتیبان»** به‌صورت دوره‌ای فایل JSON بگیرید. در بازیابی، داده‌های فعلی با محتوای فایل جایگزین می‌شوند.

**تفاوت دو حالت تکرار:** در «زمان‌بندی ثابت»، تأخیر در انجام فعالیت، تاریخ نوبت‌های آینده را تغییر نمی‌دهد. در «پس از آخرین انجام»، محاسبه نوبت بعد به ثبت انجام وابسته است. تکرارهای ماهانه برای روزهای ناموجود، از آخرین روز همان ماه استفاده می‌کنند.

### محدودیت‌های مهم

- اعلان‌ها تقریباً هر **۳۰ ثانیه** و هنگام بازگشت به صفحه بررسی می‌شوند؛ **با بسته‌بودن برنامه تضمین نمی‌شوند**.
- برای اعلان، مجوز مرورگر، پشتیبانی مرورگر و بستر امن HTTPS یا localhost لازم است. حالت ذخیره نیرو یا تنظیمات سیستم می‌تواند در نمایش اعلان تأثیر بگذارد.
- اطلاعات فعالیت‌ها فقط در حافظه همان مرورگر ذخیره می‌شوند. پاک‌شدن داده‌های سایت، تغییر دستگاه یا استفاده از مرورگر دیگر می‌تواند باعث از دست‌رفتن آن‌ها شود.
- همگام‌سازی مستقیم با **Google Calendar**، همگام‌سازی چنددستگاهی و **Push Notification** در پس‌زمینه هنوز پیاده‌سازی نشده‌اند.
- برای فعالیت‌های حساس مانند مصرف دارو، این برنامه نباید تنها ابزار هشدار باشد. برنامه دارویی باید مطابق دستور پزشک باقی بماند.

### نصب، اجرای محلی و تست

در پوشه‌ای که `index.html` قرار دارد اجرا کنید:

```bash
python -m http.server 8080
```

سپس `http://localhost:8080` را باز کنید. تست‌ها با دستور زیر اجرا می‌شوند:

```bash
node --test tests/*.cjs
```

برای انتشار روی GitHub Pages به **Settings → Pages** بروید و انتشار شاخه `main` از مسیر `/ (root)` را فعال کنید. نمونه دستورات انتشار و ساخت نسخه در [بخش انگلیسی](#publishing-updates) آمده است.

---

## Support & Feedback

**Need help, found a bug, or have a feature idea? / سؤال، باگ یا پیشنهاد دارید؟**

The preferred public support channel is **GitHub Issues**. / مسیر پیشنهادی پشتیبانی عمومی **GitHub Issues** است.

- **Report a bug / گزارش خطا:** `https://github.com/YOUR-USERNAME/m-calendar/issues/new`
- **Existing issues / خطاهای ثبت‌شده:** `https://github.com/YOUR-USERNAME/m-calendar/issues`
- **Source code / کد پروژه:** `https://github.com/YOUR-USERNAME/m-calendar`

> Replace `YOUR-USERNAME` with the correct owner before publishing this README. Check that the repository is accessible and that **Issues** is enabled under repository settings. **No support email or guaranteed response time has been specified.**

When reporting a bug, please include / هنگام گزارش باگ این اطلاعات را بنویسید:

```text
M Calendar version / نسخه:
Device & OS / دستگاه و سیستم‌عامل:
Browser & version / مرورگر و نسخه:
Selected language / زبان انتخابی:
Calendar (Persian/Gregorian) / تقویم:
Steps to reproduce / مراحل بازتولید:
Expected result / نتیجه مورد انتظار:
Actual result / نتیجه واقعی:
Screenshot (optional) / تصویر (اختیاری):
```

**Privacy reminder / نکته حریم خصوصی:** Never post exported backups, sensitive task descriptions, personal schedules, account credentials, or private information in public Issues. / فایل پشتیبان، برنامه‌های شخصی، اطلاعات حساس یا رمزهای عبور را در ایشوهای عمومی منتشر نکنید.

### Frequently asked questions / پرسش‌های متداول

**Why don't notifications appear after I close the app? / چرا بعد از بستن برنامه اعلان نمی‌آید؟**  
Version 0.2.1 has foreground-only reminders, not server-backed Push. / در نسخه ۰٫۲٫۱ یادآوری فقط هنگام اجرای برنامه فعال است؛ سرویس پوش پس‌زمینه وجود ندارد.

**Will tasks sync between my phone and computer? / آیا داده‌ها میان موبایل و کامپیوتر همگام می‌شوند؟**  
No. Use JSON export/import to move them manually, understanding that import replaces the current tasks. / خیر. می‌توانید با پشتیبان JSON به‌صورت دستی جابه‌جا کنید؛ بازیابی، داده‌های فعلی را جایگزین می‌کند.

**Can I choose Persian dates with the English interface? / می‌توانم با زبان انگلیسی از تاریخ شمسی استفاده کنم؟**  
Yes, language and calendar selection are independent. / بله، زبان و تقویم مستقل هستند.

**Is Google Calendar integration available? / اتصال به Google Calendar فعال است؟**  
Not in v0.2.2. / خیر، هنوز در این نسخه پیاده‌سازی نشده است.

**Is donating required? / حمایت مالی اجباری است؟**  
No. The Donate tab lists voluntary public receiving addresses for Bitcoin, USDT (TRC20), EVM networks, and Solana. The app does not connect to wallets or process payments. Always verify the complete address and network before transferring; cryptocurrency transactions are generally irreversible. / خیر. بخش حمایت مالی فقط آدرس دریافت داوطلبانه را نشان می‌دهد و برنامه به کیف پول متصل نمی‌شود یا تراکنشی انجام نمی‌دهد. پیش از واریز، آدرس و شبکه را کامل بررسی کنید.

---

## Privacy & Security / حریم خصوصی و امنیت

- **No account required.** Tasks, settings and completion history are saved in browser `localStorage`; reminder deduplication state is also stored locally.
- **No cloud task sync or backend database** is present in v0.2.2. No app-level analytics or task-data collection is implemented in this codebase.
- Clearing website data or changing browsers/devices can erase locally saved information. Back up frequently.
- Treat JSON backup files as sensitive: they contain task names, dates and completion history, and are **not encrypted by M Calendar**.
- Import validates supported task fields and asks for confirmation before replacing local activities. This is not a substitute for reviewing files obtained from untrusted sources.
- No private key, wallet authentication, crypto transaction, or payment processing is involved in the Donate tab.
- The repository is licensed under [MIT](LICENSE). The software is provided **as is**, without warranties.

---

## Changelog

| Version | Changes |
| --- | --- |
| **v0.2.2** | Mobile activity-list refresh fix; reset filter to All on save; touch-friendly reminder time choices; service-worker cache version update. |
| **v0.2.0** | Optional foreground browser reminders, per-task offsets, notification permission control, reminder deduplication and tests. |
| **v0.1.5** | Donation cards for Bitcoin, USDT/TRC20, EVM and Solana, with copy buttons and warnings. |
| **v0.1.4** | App version display, bilingual in-app Help and Donate sections. |
| **v0.1.3** | Optional end date and calendar-aware end-of-month/end-of-year shortcuts. |
| **v0.1.2** | Renamed project to M Calendar (`m-calendar`). |
| **v0.1.1** | Earlier M Calender naming and repository guidance. |
| **v0.1.0** | Initial bilingual recurring-task PWA foundation. |

### Planned, not shipped / برنامه‌های آینده (هنوز منتشر نشده)

More robust PWA updates, UI enhancements, expanded recurrence rules, Google Calendar export/sync, and server-backed background push notifications are possible future work. **No delivery dates are promised.**

---

<div align="center">

**M Calendar · v0.2.2 · MIT License**  
Built for simple, repeatable routines. / ساخته‌شده برای مدیریت ساده فعالیت‌های تکراری.

</div>


## v0.2.2 Hotfix / اصلاحات مهم

- After saving, the view switches to Activities / All, shows a visible confirmation, and scrolls to the saved task.
- Due **today** is not labeled overdue; missed occurrences are distinguished from today's tasks.
- Mark done records the latest actionable occurrence, then updates the card and status visibly. Past older skipped occurrences no longer trap the task in an indefinitely overdue state.
- Foreground notification delivery prefers `ServiceWorkerRegistration.showNotification()` (especially on mobile); a Test notification button checks actual delivery.
- Reminders still **require the app to be open and running**. This version does not include a push server.
- Browser notification permissions require HTTPS or localhost. Firefox / Chrome permissions can be blocked in the browser or by the OS. Safari iOS has additional Home Screen restrictions.
- Before updating, export a JSON backup. Storage key is unchanged and existing data are preserved.

### Quick test matrix

1. Save a task with the All/Due/Upcoming filter selected; it should appear immediately in All.
2. Create a task starting today; its badge should read Today, not Overdue.
3. Create a task with an earlier start, mark done; status should update and Undo should restore the previous status.
4. Enable notifications, click Test notification in Chrome/Firefox desktop and Android browser; accept permission and check browser and OS settings if absent.
5. Reload, switch fa/en and Persian/Gregorian, then export and import test data.

### Git commands

```bash
git add .
git commit -m "fix: repair task refresh, due status and mobile notifications v0.2.2"
git push origin main
git tag -a v0.2.2 -m "M Calendar v0.2.2"
git push origin v0.2.2
# Optional if GitHub CLI is installed and authenticated:
gh release create v0.2.2 --title "M Calendar v0.2.2" --generate-notes
```
