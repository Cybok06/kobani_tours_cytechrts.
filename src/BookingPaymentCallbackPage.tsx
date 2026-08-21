import { useEffect, useState } from "react"
import type { Page } from "./App"
import { type Booking, bookingApi } from "./api"

export default function BookingPaymentCallbackPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const params = new URLSearchParams(window.location.search)
  const reference = params.get("reference") || params.get("trxref") || sessionStorage.getItem("kobani_payment_reference") || ""
  const [state, setState] = useState("verifying"), [booking, setBooking] = useState<Booking>(), [message, setMessage] = useState("Verifying your payment securely with Paystack…")
  const verify = () => {
    setState("verifying")
    bookingApi.verifyPaystack(reference).then(result => {
      setState(result.data.state); setBooking(result.data.booking)
      sessionStorage.setItem("kobani:selected-booking-id", result.data.booking.id)
      setMessage(result.data.state === "success" ? "Your payment was verified and your KOBANI journey is confirmed." : result.data.state === "pending" ? "Paystack is still processing the transaction." : "The payment was not completed. Your booking has not been marked paid.")
      window.history.replaceState({}, "", "/booking/payment/callback")
    }).catch(() => { setState("failed"); setMessage("We could not verify this payment yet. No unverified charge has been applied to your booking.") })
  }
  useEffect(() => { if (reference) verify(); else { setState("failed"); setMessage("No payment reference was provided.") } }, [reference])
  const finish = () => onNavigate(state === "success" ? "customer-bookings" : "booking")
  return <div className="grid min-h-screen place-items-center bg-[#F8F4EA] p-4"><div className="w-full max-w-xl rounded-3xl border bg-white p-8 text-center shadow-xl sm:p-12"><div className={`mx-auto grid h-20 w-20 place-items-center rounded-full text-3xl ${state === "success" ? "bg-green-100 text-green-700" : state === "verifying" || state === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{state === "success" ? "✓" : state === "verifying" ? "…" : "!"}</div><p className="mt-6 text-[10px] font-bold tracking-[.22em] text-[#B88B39]">PAYMENT {state.toUpperCase()}</p><h1 className="mt-2 font-serif text-4xl font-bold">{state === "success" ? "Booking confirmed" : state === "verifying" ? "Checking payment" : "Payment not confirmed"}</h1><p className="mt-4 leading-7 text-[#777]">{message}</p>{booking && <div className="mt-6 rounded-2xl bg-[#F8F4EA] p-5 text-left text-sm"><div className="flex justify-between"><span>Booking reference</span><b>{booking.booking_reference}</b></div><div className="mt-2 flex justify-between"><span>Payment status</span><b className="capitalize">{booking.payment_status.replaceAll("_", " ")}</b></div><div className="mt-2 flex justify-between"><span>Balance</span><b>{booking.currency} {booking.balance}</b></div></div>}<div className="mt-7 grid gap-3 sm:grid-cols-2">{state !== "success" && <button onClick={verify} className="rounded-xl border py-3 font-bold">Check payment status</button>}<button onClick={finish} className="rounded-xl bg-[#C6A15B] py-3 font-bold">{state === "success" ? "View my bookings" : "Return to booking"}</button></div></div></div>
}
