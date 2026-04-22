# Real Steel — Landing Page

Website bán serum tóc Real Steel, chạy trên Vercel + Supabase.

🌐 Live: [realsteelvietnam.com](https://realsteelvietnam.com)

---

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Frontend | HTML / CSS / JavaScript thuần |
| Hosting | Vercel (Serverless) |
| Database | Supabase (PostgreSQL) |
| Email | Resend API |
| Thanh toán | Sepay (webhook) |

---

## Cấu Trúc Thư Mục

```
LANDING PAGE/
├── index.html          ← Trang chính (landing page)
├── thanh-toan.html     ← Trang thanh toán
├── admin.html          ← Admin panel xem & xác nhận đơn
├── api/
│   ├── create-order.js ← Tạo đơn hàng mới + gửi email
│   ├── send-email.js   ← Gửi email xác nhận (khi admin confirm)
│   └── webhook.js      ← Nhận webhook từ Sepay khi có tiền về
├── .env.example        ← Template biến môi trường
└── .gitignore
```

---

## Biến Môi Trường Cần Có

Tạo file `.env` từ `.env.example` và điền giá trị thật:

```bash
cp .env.example .env
```

| Biến | Lấy ở đâu |
|---|---|
| `SUPABASE_URL` | supabase.com → Project Settings → API |
| `SUPABASE_KEY` | supabase.com → Project Settings → API → anon key |
| `RESEND_API_KEY` | resend.com → API Keys |

---

## Deploy Lên Vercel (Đang Dùng)

```bash
# Lần đầu
vercel link --project realsteelvietnam --yes
vercel --prod

# Cập nhật sau này
vercel --prod
```

Sau đó vào Vercel Dashboard → Settings → Environment Variables → thêm 3 biến trên.

---

## Deploy Lên VPS Linux (Ngày 13+)

> ⚠️ Project hiện dùng Vercel Serverless Functions — cần adapter để chạy trên VPS thuần.

**Yêu cầu trước khi deploy VPS:**
1. Cài Node.js 18+ trên VPS
2. Cài nginx làm reverse proxy
3. Cài PM2 để giữ process chạy liên tục
4. Set biến môi trường trong file `.env` (không commit lên git)

---

## Luồng Hoạt Động

```
Khách vào web
    ↓
Điền form đặt hàng → POST /api/create-order
    ↓
Lưu vào Supabase (bảng rs_orders)
    ↓
Gửi 3 email tự động qua Resend (welcome + nurture + upsell)
    ↓
Khách chuyển khoản → Sepay nhận → POST /api/webhook
    ↓
Supabase cập nhật trạng thái đơn = 'success'
    ↓
Admin vào /admin → bấm Xác nhận → gửi email xác nhận đơn
```
