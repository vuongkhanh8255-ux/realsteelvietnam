// Vercel Serverless Function — Tạo đơn hàng mới
// URL: https://realsteelvietnam.com/api/create-order

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'Real Steel <onboarding@resend.dev>';

// ── PERMATE POSTBACK ──
const PERMATE_BRAND_ID  = '200568';
const PERMATE_API_KEY   = '34a32bbe170d4ee598d401c39187';
const PERMATE_OFFER_ID  = '2729';
const PERMATE_EVENT_ID  = '3052';

async function firePermatePostback(clickUuid, saleValue) {
  if (!clickUuid) return;
  try {
    const url = `https://pmcloud1.com/api/v1/conversion?brand_id=${PERMATE_BRAND_ID}&api_key=${PERMATE_API_KEY}&offer_id=${PERMATE_OFFER_ID}&event_id=${PERMATE_EVENT_ID}&click_uuid=${encodeURIComponent(clickUuid)}&sale_value=${saleValue}`;
    const r = await fetch(url, { method: 'GET' });
    console.log(`[Permate] Postback ${r.status} — click: ${clickUuid}, value: ${saleValue}`);
  } catch(e) {
    console.warn('[Permate] Postback failed:', e.message);
  }
}

function generateOrderCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'RS';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function sendResend(to, subject, html, scheduledAt) {
  const body = { from: FROM_EMAIL, to, subject, html };
  if (scheduledAt) body.scheduledAt = scheduledAt;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return r.json();
}

function email1Html(hoTen, sanPham, orderCode) {
  return `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a;line-height:1.7">
  <p>Chào <strong>${hoTen}</strong>,</p>
  <p>Mình vừa nhận được đơn <strong>${sanPham}</strong> của bạn. Mã đơn: <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px">${orderCode}</code></p>
  <p>Mình sẽ liên hệ xác nhận địa chỉ giao hàng trong vòng 24h — nếu bạn cần gì, reply thẳng vào email này là mình thấy ngay.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
  <p>Real Steel không phải dầu gội, không phải thuốc. Nó là serum thẩm thấu trực tiếp vào da đầu — nơi dầu gội không bao giờ chạm tới được. Mình mất 2 năm mày mò công thức trước khi dám bán cho ai đó.</p>
  <p><strong>Bạn đang đi đúng hướng.</strong></p>
  <p style="margin-top:24px">Mình — founder Real Steel<br/><a href="https://realsteelvietnam.com" style="color:#2563eb">realsteelvietnam.com</a></p>
</div>`;
}

function email2Html(hoTen) {
  return `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a;line-height:1.7">
  <p>Chào <strong>${hoTen}</strong>,</p>
  <p>Mình muốn chia sẻ một thứ mà ít ai nói thẳng:</p>
  <p><strong>Vấn đề không phải ở tóc — mà ở da đầu.</strong></p>
  <p>Hầu hết mọi người tập trung vào thân tóc: dầu gội xịn, dầu xả đắt tiền. Nhưng tóc mọc từ nang tóc — nằm sâu trong da đầu. Nếu nang yếu, tóc cứ rụng dù dùng thứ gì đi ngoài.</p>
  <p>DHT tấn công nang tóc. Procapil 3% trong Real Steel ức chế DHT trực tiếp tại nang — không xử lý triệu chứng bên ngoài.</p>
  <p><strong>Kết quả thấy được thường sau 6–8 tuần dùng đều.</strong></p>
  <p>Bạn đang cầm đúng thứ cần thiết — dùng đúng cách thì kết quả sẽ tới.</p>
  <p style="margin-top:24px">Mình — Real Steel</p>
  <p style="color:#6b7280;font-size:13px">P.S. Câu hỏi gì về cách dùng, reply email này là mình trả lời ngay.</p>
</div>`;
}

function email3Html(hoTen) {
  return `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a;line-height:1.7">
  <p>Chào <strong>${hoTen}</strong>,</p>
  <p>Đơn của bạn đang được chuẩn bị. Mình muốn nói thêm một thứ trước khi giao.</p>
  <p>Nhiều người hỏi: <em>"Dùng bao lâu thì thấy kết quả?"</em></p>
  <p>Câu trả lời thật: <strong>6–8 tuần là ngưỡng đầu tiên</strong>. Nang tóc cần thời gian phục hồi — ai bỏ cuộc sau 2 tuần là chưa cho nó cơ hội.</p>
  <p>Mình khuyên dùng liên tục ít nhất 2 tháng — đó là lý do có gói Combo 60 ngày.</p>
  <p>Nếu bạn muốn đổi sang <strong>Combo 60 Ngày (360.000đ)</strong> trước khi giao — reply email này, mình xử lý ngay.</p>
  <p style="margin-top:24px">Mình — Real Steel<br/><a href="https://realsteelvietnam.com" style="color:#2563eb">realsteelvietnam.com</a></p>
</div>`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { ho_ten, so_dien_thoai, dia_chi, email, san_pham, so_tien, click_uuid } = req.body;
    if (!ho_ten || !so_dien_thoai) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const order_code = generateOrderCode();

    // Lưu đơn vào Supabase
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

    // Fire Permate postback (không chặn flow dù thất bại)
    firePermatePostback(click_uuid, so_tien).catch(() => {});

    // Gửi email sequence nếu có email
    if (email && RESEND_API_KEY) {
      // Gửi cả 3 email ngay lập tức (free plan không support scheduledAt)
      await sendResend(email,
        'Mình đã nhận đơn — cảm ơn bạn đã tin tưởng Real Steel',
        email1Html(ho_ten, san_pham, order_code)
      );
      await sendResend(email,
        'Vì sao 90% đàn ông dùng sai cách chăm sóc tóc',
        email2Html(ho_ten)
      );
      await sendResend(email,
        'Bạn đặt rồi — nhưng mình muốn nói thêm một thứ',
        email3Html(ho_ten)
      );
    }

    return res.status(200).json({ success: true, order_code, order: data[0] });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
