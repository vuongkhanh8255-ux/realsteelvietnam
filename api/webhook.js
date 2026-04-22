// Vercel Serverless Function — Sepay Webhook
// URL: https://realsteelvietnam.com/api/webhook

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// ── PERMATE POSTBACK — chỉ fire khi thanh toán thành công ──
async function firePermatePostback(clickUuid, saleValue) {
  if (!clickUuid) return;
  try {
    const url = `https://pmcloud1.com/postback?api_key=34a32bbe170d4ee598d401c39187&pm_adv_id=200568&click_uuid=${encodeURIComponent(clickUuid)}&offer_id=2729&event_id=3052&sale_value=${saleValue}`;
    const r = await fetch(url, { method: 'GET' });
    console.log(`[Permate] Postback OK — click: ${clickUuid}, value: ${saleValue}`);
  } catch(e) {
    console.warn('[Permate] Postback failed:', e.message);
  }
}

export default async function handler(req, res) {
  // Chỉ nhận POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    // Sepay gửi data dạng này:
    // { id, gateway, transactionDate, accountNumber, code, content, transferType, transferAmount, ... }

    // Chỉ xử lý giao dịch tiền vào
    if (body.transferType !== 'in') {
      return res.status(200).json({ success: true, message: 'Ignored outgoing transaction' });
    }

    const content = body.content || '';
    const amount = body.transferAmount;

    // Tìm order_code trong nội dung chuyển khoản
    // Sepay gửi nội dung CK, mình match với order_code
    const orderCodeMatch = content.match(/RS[A-Z0-9]{6}/i);
    if (!orderCodeMatch) {
      return res.status(200).json({ success: true, message: 'No order code found in content' });
    }

    const orderCode = orderCodeMatch[0].toUpperCase();

    // Update trạng thái đơn hàng trong Supabase
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

    // Fire Permate postback sau khi xác nhận thanh toán thành công
    // updated[0] chứa click_uuid và so_tien từ đơn hàng
    if (updated?.[0]) {
      const { click_uuid, so_tien } = updated[0];
      firePermatePostback(click_uuid, so_tien).catch(() => {});
      console.log(`[Permate] Order ${orderCode} paid — click: ${click_uuid}, value: ${so_tien}`);
    }

    return res.status(200).json({ success: true, order_code: orderCode, updated });

  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: err.message });
  }
}
