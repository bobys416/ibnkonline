export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
      <h1 className="text-3xl font-black">Help Center</h1>
      <div className="bg-white rounded-3xl border p-6 space-y-3 text-sm text-slate-700">
        <p><strong>Orders:</strong> Track from My Account → Orders. Typical delivery is 2–4 days from Wadala Hub.</p>
        <p><strong>Payments:</strong> UPI, cards, netbanking, wallets via IBNK Secure Pay, plus COD.</p>
        <p><strong>Sandbox tests:</strong> UPI success@upi, card 4111 1111 1111 1111. fail@upi and 4000… decline.</p>
        <p><strong>Returns:</strong> Eligible items can be returned within the product return window.</p>
        <p><strong>Support:</strong> contact@ibnk.online</p>
      </div>
    </div>
  );
}
