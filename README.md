# سامانه مدرسه مجازی — نسخه نهایی Cloudflare

این نسخه برای استفاده از گوشی به‌صورت PWA و استقرار روی Cloudflare Workers + D1 آماده شده است.

## وضعیت واقعی
- JavaScript syntax: تست شد.
- ساختار SQLite/D1 و عملیات اصلی schema/upsert: تست شد.
- پروژه برای Deploy به Cloudflare آماده است.
- Deploy عمومی از داخل این گفتگو انجام نشده، چون نیازمند ورود به حساب Cloudflare شماست.
- OTP واقعی نیازمند اتصال سرویس پیامک است؛ `DEV_OTP` فقط برای راه‌اندازی آزمایشی است.

## قابلیت‌ها
- PWA موبایل و Service Worker
- ۶ پایه و ۱۲ کلاس (1A تا 6B)
- نقش‌های teacher/admin/parent/student
- ورود OTP و تعیین رمز
- Session با HttpOnly/Secure/SameSite
- CSRF
- هش رمز با PBKDF2
- رمزنگاری داده‌های حساس با AES-GCM
- Audit Log
- دانش‌آموزان و کلاس‌ها
- حضور و غیاب
- ارزشیابی
- فعالیت خانه
- تکالیف
- منابع آموزشی
- گزارش مستند دانش‌آموز
- Offline Outbox برای حضور/ارزشیابی/فعالیت خانه
- Sync واقعی داده‌های صف با جداول اصلی پس از اتصال
- چاپ گزارش و Save as PDF از مرورگر

## راه‌اندازی با گوشی (مسیر ساده)
Cloudflare در سال ۲۰۲۶ امکان اتصال Worker به GitHub و استقرار خودکار را دارد. بعد از قرار گرفتن پروژه در GitHub، در Cloudflare Dashboard از Workers & Pages > Create application > Import a repository استفاده کنید.

### روش پیشنهادی
1. یک حساب رایگان Cloudflare بسازید.
2. یک مخزن GitHub برای پروژه بسازید و فایل‌های همین ZIP را در ریشه مخزن قرار دهید.
3. در Cloudflare: Workers & Pages → Create application → Import a repository.
4. مخزن GitHub را انتخاب کنید و پروژه را Deploy کنید.
5. در Cloudflare یک D1 Database با نام `virtual-school-db` بسازید.
6. Database ID را در `wrangler.toml` جایگزین مقدار `REPLACE_WITH_YOUR_D1_DATABASE_ID` کنید.
7. Migration `migrations/0001_init.sql` را روی D1 اجرا کنید.
8. در تنظیمات Worker، Binding با نام `DB` را به همان D1 وصل کنید.
9. Secretهای زیر را تنظیم کنید:
   - `APP_SECRET`: یک رشته تصادفی طولانی (حداقل 32 کاراکتر)
   - `TEACHER_PHONE`: شماره معلم
   - `DEV_OTP=1` فقط برای تست اولیه؛ سپس حذف شود.
10. آدرس `workers.dev` را با Chrome گوشی باز کنید و «افزودن به صفحه اصلی» را بزنید.

### اگر از Wrangler استفاده می‌کنید
```bash
npm install
npx wrangler login
npx wrangler d1 create virtual-school-db
# ID را در wrangler.toml قرار دهید
npx wrangler d1 migrations apply virtual-school-db --remote
npx wrangler deploy
```

## نکته امنیتی
این پروژه برای داده‌های واقعی دانش‌آموزان باید فقط با HTTPS و Secretهای واقعی اجرا شود. `DEV_OTP` در محیط واقعی نباید فعال باشد. قبل از استفاده گسترده، Backup و سیاست نگهداری داده را بررسی کنید.

## محدودیت رایگان Cloudflare
Workers Free محدودیت روزانه درخواست دارد و D1 Free نیز محدودیت روزانه خواندن/نوشتن دارد. این نسخه برای شروع مدرسه کوچک مناسب است، اما در صورت عبور از سقف رایگان، سرویس متوقف نمی‌شود به شکل «رایگان نامحدود»؛ باید تا reset روزانه صبر کرد یا پلن را ارتقا داد.
