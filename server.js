// Real Steel — Express Server for VPS
// Serves static files + API routes (thay thế Vercel serverless functions)

import express from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'Real Steel <onboarding@resend.dev>';

app.use(express.json());
app.use(express.static(__dirname)); // serve HTML/CSS/JS files

// ── Helpers ──────────────────────────────────────────────

function generateOrderCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'RS';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function sendResend(to, subject, html) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html })
  });
  return r.json();
}

async function firePermatePostback(clickUuid, saleValue) {
  if (!clickUuid) return;
  try {
    const url = `https://pmcloud1.com/postback?api_key=34a32bbe170d4ee598d401c39187&pm_adv_id=200568&click_uuid=${encodeURIComponent(clickUuid)}&offer_id=2729&event_id=3052&sale_value=${saleValue}`;
    await fetch(url, { method: 'GET' });
  } catch(e) { console.warn('[Permate] failed:', e.message); }
}

// ── API: Create Order ─────────────────────────────────────

app.post('/api/create-order', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const { ho_ten, so_dien_thoai, dia_chi, email, san_pham, so_tien, click_uuid } = req.body;
    if (!ho_ten || !so_dien_thoai) return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });

    const order_code = generateOrderCode();

    const response = await fetch(`${SUPABASE_URL}/rest/v1/rs_orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ ho_ten, so_dien_thoai, dia_chi, email, san_pham, so_tien, order_code, click_uuid })
    });
    const data = await response.json();

    if (email && RESEND_API_KEY) {
      await sendResend(email, 'Mình đã nhận đơn — cảm ơn bạn đã tin tưởng Real Steel',
        `<p>Chào <b>${ho_ten}</b>, mã đơn: <code>${order_code}</code>. Mình sẽ liên hệ trong 24h.</p>`);
    }

    return res.status(200).json({ success: true, order_code, order: data[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── API: Sepay Webhook ────────────────────────────────────

app.post('/api/webhook', async (req, res) => {
  try {
    const body = req.body;
    if (body.transferType !== 'in') return res.status(200).json({ success: true, message: 'Ignored' });

    const content = body.content || '';
    const amount = body.transferAmount;
    const orderCodeMatch = content.match(/RS[A-Z0-9]{6}/i);
    if (!orderCodeMatch) return res.status(200).json({ success: true, message: 'No order code' });

    const orderCode = orderCodeMatch[0].toUpperCase();

    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/rs_orders?order_code=eq.${orderCode}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        trang_thai: 'success',
        sepay_transaction_id: String(body.id),
        ghi_chu: `Thanh toán ${amount?.toLocaleString('vi-VN')}đ lúc ${body.transactionDate}`
      })
    });
    const updated = await updateRes.json();

    if (updated?.[0]) {
      const { click_uuid, so_tien } = updated[0];
      firePermatePostback(click_uuid, so_tien).catch(() => {});
    }

    return res.status(200).json({ success: true, order_code: orderCode, updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── API: Announcement (cho MCP tool gọi) ─────────────────

app.get('/announcement.json', (req, res) => {
  const file = join(__dirname, 'announcement.json');
  if (!existsSync(file)) return res.json({ active: false });
  res.json(JSON.parse(readFileSync(file, 'utf8')));
});

app.listen(PORT, () => console.log(`Real Steel server running on port ${PORT}`));
