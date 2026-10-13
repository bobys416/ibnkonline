export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
      <h1 className="text-3xl font-black">Privacy & Security</h1>
      <div className="bg-white rounded-3xl border p-6 text-sm text-slate-700 space-y-3 leading-relaxed">
        <p>IBNK stores cart and demo orders in your browser so you can complete checkout without sharing card data with a live acquirer in sandbox mode.</p>
        <p>Live Razorpay keys, when configured, never appear in client-side signature verification. HMAC checks run on the server.</p>
        <p>We collect name, mobile, PIN code, and address only to fulfill an order.</p>
      </div>
    </div>
  );
}
