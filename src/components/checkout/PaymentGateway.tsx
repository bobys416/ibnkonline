"use client";

import { useState } from "react";
import { CreditCard, Landmark, Smartphone, Wallet, ShieldCheck, X, Loader2 } from "lucide-react";
import { formatINR } from "@/lib/money";

type Tab = "upi" | "card" | "netbanking" | "wallet";

type Props = {
  amountPaise: number;
  gatewayOrderId: string;
  onClose: () => void;
  onSuccess: (result: { gatewayPaymentId: string; signature: string; method: string }) => void;
};

const BANKS = ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Mahindra"];
const WALLETS = ["PhonePe Wallet", "Amazon Pay", "Paytm", "Mobikwik"];

export function PaymentGateway({ amountPaise, gatewayOrderId, onClose, onSuccess }: Props) {
  const [tab, setTab] = useState<Tab>("upi");
  const [upi, setUpi] = useState("success@upi");
  const [card, setCard] = useState("4111 1111 1111 1111");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("123");
  const [bank, setBank] = useState(BANKS[0]);
  const [wallet, setWallet] = useState(WALLETS[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pay() {
    setBusy(true);
    setError("");
    const instrument =
      tab === "upi" ? upi : tab === "card" ? card : tab === "netbanking" ? bank : wallet;
    try {
      const res = await fetch("/api/v1/payments/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gatewayOrderId, method: tab, instrument }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Payment failed");
        return;
      }
      onSuccess({
        gatewayPaymentId: json.data.gatewayPaymentId,
        signature: json.data.signature,
        method: tab,
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-[#0b2a5a] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/70">IBNK Secure Pay</p>
            <p className="text-xl font-black">{formatINR(amountPaise)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10" aria-label="Close payment">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-4 border-b border-slate-200 text-xs font-bold">
          {(
            [
              ["upi", "UPI", Smartphone],
              ["card", "Cards", CreditCard],
              ["netbanking", "Netbanking", Landmark],
              ["wallet", "Wallet", Wallet],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`py-3 flex flex-col items-center gap-1 ${
                tab === id ? "text-[#0071DC] bg-[#E6F1FC]" : "text-slate-500"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {tab === "upi" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">UPI ID</label>
              <input
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#0071DC]"
                placeholder="name@upi"
              />
              <p className="text-[11px] text-slate-500">Sandbox: success@upi pays, fail@upi declines.</p>
            </div>
          )}

          {tab === "card" && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Card number</label>
                <input
                  value={card}
                  onChange={(e) => setCard(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#0071DC]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#0071DC]"
                  placeholder="MM/YY"
                />
                <input
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#0071DC]"
                  placeholder="CVV"
                />
              </div>
              <p className="text-[11px] text-slate-500">Test card 4111… succeeds. 4000… is declined.</p>
            </div>
          )}

          {tab === "netbanking" && (
            <div className="space-y-2">
              {BANKS.map((b) => (
                <label key={b} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
                  <input type="radio" checked={bank === b} onChange={() => setBank(b)} />
                  {b}
                </label>
              ))}
            </div>
          )}

          {tab === "wallet" && (
            <div className="space-y-2">
              {WALLETS.map((w) => (
                <label key={w} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
                  <input type="radio" checked={wallet === w} onChange={() => setWallet(w)} />
                  {w}
                </label>
              ))}
            </div>
          )}

          {error && <p className="text-sm text-rose-600 font-semibold">{error}</p>}

          <button
            onClick={pay}
            disabled={busy}
            className="w-full py-3 rounded-full bg-[#0071DC] hover:bg-[#004f9a] text-white font-black text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Pay {formatINR(amountPaise)}
          </button>
          <p className="text-[10px] text-center text-slate-400">
            PCI-style sandbox · HMAC signed · UPI / cards / netbanking / wallets
          </p>
        </div>
      </div>
    </div>
  );
}
