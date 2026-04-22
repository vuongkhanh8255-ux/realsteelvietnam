// Vercel Serverless Function — Gửi email tự động qua Resend
// URL: /api/send-email

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'onboarding@resend.dev'; // Dùng email mặc định Resend (không cần verify domain)
const BRAND_NAME = 'Real Steel';

async function sendEmail({ to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from: `${BRAND_NAME} <${FROM_EMAIL}>`, to, subject, html })
  });
  return res.json();
}

async function sendEmailAt({ to, subject, html, scheduledAt }) {
  const body = { from: `${BRAND_NAME} <${FROM_EMAIL}>`, to, subject, html };
  if (scheduledAt) body.scheduledAt = scheduledAt;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return res.json();
}

function buildEmail1(hoTen, sanPham, orderCode) {
  return {
    subject: 'Mình đã nhận đơn — cảm ơn bạn đã tin tưởng Real Steel',
    html: `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a;line-height:1.7">
  <p>Chào <strong>${hoTen}</strong>,</p>
  <p>Mình vừa nhận được đơn <strong>${sanPham}</strong> của bạn. Mã đơn: <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px">${orderCode}</code></p>
  <p>Mình sẽ liên hệ xác nhận địa chỉ giao hàng trong vòng 24h — nếu bạn cần gì, reply thẳng vào email này là mình thấy ngay.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
  <p>Trong lúc chờ đơn — mình muốn chia sẻ nhanh một thứ:</p>
  <p>Real Steel không phải dầu gội, không phải thuốc. Nó là serum thẩm thấu trực tiếp vào da đầu — nơi dầu gội không bao giờ chạm tới được. Mình mất 2 năm mày mò công thức trước khi dám bán cho ai đó.</p>
  <p><strong>Bạn đang đi đúng hướng.</strong></p>
  <p style="margin-top:24px">Mình — founder Real Steel<br/><a href="https://realsteelvietnam.com" style="color:#2563eb">realsteelvietnam.com</a></p>
</div>`
  };
}

function buildEmail2(hoTen) {
  return {
    subject: 'Vì sao 90% đàn ông dùng sai cách chăm sóc tóc',
    html: `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a;line-height:1.7">
  <p>Chào <strong>${hoTen}</strong>,</p>
  <p>Mình muốn chia sẻ một thứ mà ít ai nói thẳng:</p>
  <p><strong>Vấn đề không phải ở tóc — mà ở da đầu.</strong></p>
  <p>Hầu hết mọi người tập trung vào thân tóc: dầu gội xịn, dầu xả đắt tiền, serum bôi ngoài. Nhưng tóc mọc từ nang tóc — nằm sâu trong da đầu. Nếu nang yếu, tóc sẽ cứ rụng dù bạn dùng thứ gì đi ngoài.</p>
  <p>DHT là thứ tấn công nang tóc. Procapil 3% trong Real Steel được nghiên cứu để ức chế DHT trực tiếp tại nang — không phải xử lý triệu chứng bên ngoài.</p>
  <p><strong>Kết quả thấy được thường sau 6–8 tuần dùng đều.</strong></p>
  <p>Bạn đang cầm đúng thứ cần thiết rồi — dùng đúng cách thì kết quả sẽ tới.</p>
  <p style="margin-top:24px">Mình — Real Steel</p>
  <p style="color:#6b7280;font-size:13px">P.S. Nếu có câu hỏi gì về cách dùng, reply email này là mình trả lời ngay.</p>
</div>`
  };
}

function buildEmail3(hoTen) {
  return {
    subject: 'Bạn đặt rồi — nhưng mình muốn nói thêm một thứ',
    html: `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a;line-height:1.7">
  <p>Chào <strong>${hoTen}</strong>,</p>
  <p>Đơn của bạn đang được chuẩn bị. Mình muốn nói thêm một thứ trước khi giao.</p>
  <p>Nhiều người hỏi: <em>"Dùng bao lâu thì thấy kết quả?"</em></p>
  <p>Câu trả lời thật: <strong>6–8 tuần là ngưỡng đầu tiên</strong>. Nang tóc cần thời gian phục hồi — không phải 3 ngày. Ai bỏ cuộc sau 2 tuần là chưa cho nó cơ hội.</p>
  <p>Mình khuyên dùng liên tục ít nhất 2 tháng — đó là lý do có gói Combo 60 ngày.</p>
  <p>Nếu bạn đặt Standard (1 chai), mình có thể đổi sang <strong>Combo 60 Ngày (360.000đ)</strong> trước khi giao — tiết kiệm hơn so với mua thêm lần sau.</p>
  <p>Reply email này nếu muốn đổi gói. Mình xử lý ngay.</p>
  <p style="margin-top:24px">Mình — Real Steel<br/><a href="https://realsteelvietnam.com" style="color:#2563eb">realsteelvietnam.com</a></p>
</div>`
  };
}

function buildEmail4(hoTen, sanPham, soTien, orderCode) {
  return {
    subject: `✓ Đơn hàng ${orderCode} đã được xác nhận — Real Steel đang được chuẩn bị`,
    html: `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a;line-height:1.7">
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin-bottom:20px">
    <p style="margin:0;font-weight:700;color:#15803d">✓ Thanh toán đã được xác nhận</p>
  </div>
  <p>Chào <strong>${hoTen}</strong>,</p>
  <p>Mình đã nhận được thanh toán. Đơn hàng của bạn đã được xác nhận.</p>
  <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;margin:16px 0">
    <p style="margin:0 0 8px;font-weight:700">Chi tiết đơn hàng</p>
    <p style="margin:4px 0;color:#4b5563">Sản phẩm: <strong style="color:#1a1a1a">${sanPham}</strong></p>
    <p style="margin:4px 0;color:#4b5563">Số tiền: <strong style="color:#2563eb">${Number(soTien).toLocaleString('vi-VN')}đ</strong></p>
    <p style="margin:4px 0;color:#4b5563">Mã đơn: <code style="background:#e5e7eb;padding:2px 6px;border-radius:4px">${orderCode}</code></p>
  </div>
  <p><strong>Bước tiếp theo:</strong> Real Steel sẽ được đóng gói và giao trong 1–3 ngày làm việc. Mình sẽ liên hệ khi có thông tin vận chuyển.</p>
  <p>Cảm ơn bạn đã tin tưởng Real Steel.</p>
  <p style="margin-top:24px">Mình — founder Real Steel<br/><a href="https://realsteelvietnam.com" style="color:#2563eb">realsteelvietnam.com</a></p>
</div>`
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, email, ho_ten, san_pham, so_tien, order_code } = req.body;

  if (!email || !ho_ten) {
    return res.status(400).json({ error: 'Thiếu email hoặc họ tên' });
  }

  // Chế độ test: email chứa "+test" → gửi cả 3 email ngay lập tức
  const isTest = email.includes('+test');

  try {
    if (type === 'sequence') {
      // Gửi chuỗi 3 email
      const e1 = buildEmail1(ho_ten, san_pham, order_code);
      const e2 = buildEmail2(ho_ten);
      const e3 = buildEmail3(ho_ten);

      const now = new Date();
      const day2 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
      const day3 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

      // Email 1: gửi ngay
      const r1 = await sendEmail({ to: email, ...e1 });

      // Email 2 + 3: schedule hoặc gửi ngay nếu test
      const r2 = await sendEmailAt({ to: email, ...e2, scheduledAt: isTest ? undefined : day2 });
      const r3 = await sendEmailAt({ to: email, ...e3, scheduledAt: isTest ? undefined : day3 });

      return res.status(200).json({ success: true, isTest, sent: [r1, r2, r3] });
    }

    if (type === 'confirmation') {
      // Email xác nhận đơn hàng
      const e4 = buildEmail4(ho_ten, san_pham, so_tien, order_code);
      const r4 = await sendEmail({ to: email, ...e4 });
      return res.status(200).json({ success: true, sent: r4 });
    }

    return res.status(400).json({ error: 'type không hợp lệ. Dùng: sequence | confirmation' });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
