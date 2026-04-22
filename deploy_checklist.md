# Deploy Checklist — Real Steel Landing Page
> Kiểm tra trước khi deploy lên VPS Linux — ngày 13

---

## 🔴 CRITICAL — Phải xong trước khi deploy

- [x] **Xoá hardcoded Supabase key khỏi create-order.js** → đổi sang `process.env.SUPABASE_KEY`
- [x] **Xoá hardcoded Supabase key khỏi webhook.js** → đổi sang `process.env.SUPABASE_KEY`
- [x] **Thêm .env vào .gitignore** → không bao giờ commit key lên GitHub
- [x] **Tạo .env.example** → template cho người deploy sau biết cần điền gì
- [x] **Tạo README.md** → hướng dẫn deploy cơ bản
- [x] **Set biến môi trường trên Vercel** → SUPABASE_URL + SUPABASE_KEY + RESEND_API_KEY đã có đủ, deployment created ✅

---

## 🟡 VPS DEPLOY — Cần làm khi chuyển từ Vercel sang VPS

- [ ] **Cài Node.js 18+ trên VPS**
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

- [ ] **Cài nginx làm reverse proxy**
  ```bash
  sudo apt install nginx
  ```

- [ ] **Cài PM2 để giữ process chạy 24/7**
  ```bash
  npm install -g pm2
  ```

- [ ] **Tạo file .env trên VPS với giá trị thật**
  ```bash
  cp .env.example .env
  nano .env   # điền SUPABASE_URL, SUPABASE_KEY, RESEND_API_KEY
  ```

- [ ] **Viết adapter chuyển Vercel Function → Express** (vì Vercel function format không chạy được trực tiếp trên VPS)

- [ ] **Cấu hình nginx trỏ domain về port Node.js**

- [ ] **Cài SSL (HTTPS) bằng Certbot**
  ```bash
  sudo certbot --nginx -d realsteelvietnam.com
  ```

- [ ] **Start PM2 và set auto-restart khi reboot**
  ```bash
  pm2 start server.js --name realsteel
  pm2 save
  pm2 startup
  ```

---

## 🟢 TRẠNG THÁI HIỆN TẠI

| Mục | Trạng thái |
|---|---|
| API Key lộ trong code | ✅ Đã fix |
| .gitignore đúng | ✅ Đã fix |
| .env.example có | ✅ Đã tạo |
| README.md có | ✅ Đã tạo |
| Biến môi trường Vercel | ⚠️ Cần add SUPABASE_URL + SUPABASE_KEY |
| Sẵn sàng VPS | ⏳ Ngày 13 |

---

## 📝 Ghi Chú

**admin.html có Supabase key trong HTML** — đây là anon key (public key), Supabase thiết kế để client-side dùng được. Row Level Security (RLS) trong Supabase kiểm soát quyền truy cập. Không cần lo, nhưng nên bật RLS đầy đủ trên Supabase Dashboard.

**Sepay webhook URL** = `https://realsteelvietnam.com/api/webhook` — cần update lại nếu đổi domain.
