import { useState } from "react";
import { T } from "../theme";

export default function PaymentModal({ amount, orderLabel, onPay, onClose }) {
  const [method, setMethod] = useState(null);
  const [momoNum, setMomoNum] = useState("");
  const [step, setStep] = useState("select"); // select | momo-input | processing | done
  const [network, setNetwork] = useState("MTN");

  const handlePay = () => {
    if (!method) return;
    if (method === "momo" && !momoNum) return;
    setStep("processing");
    setTimeout(() => setStep("done"), 2200);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"#00000099",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="card su" style={{width:"100%",maxWidth:480,borderRadius:"24px 24px 0 0",padding:24,maxHeight:"85vh",overflowY:"auto"}}>
        {step==="done" ? (
          <div style={{textAlign:"center",padding:"24px 0"}}>
            <div style={{fontSize:56,marginBottom:16}}>✅</div>
            <div className="syne" style={{fontSize:22,fontWeight:800,marginBottom:8}}>Payment Confirmed!</div>
            <div style={{color:T.muted,fontSize:14,marginBottom:24}}>Your order has been placed successfully</div>
            <div style={{background:T.accentDim,border:`1px solid ${T.accent}44`,borderRadius:14,padding:16,marginBottom:24}}>
              <div style={{fontSize:13,color:T.muted}}>Amount Paid</div>
              <div className="syne" style={{fontSize:26,fontWeight:800,color:T.accent}}>GHS {amount}</div>
              <div style={{fontSize:13,color:T.muted,marginTop:4}}>{orderLabel}</div>
            </div>
            <button className="btn btn-p btn-lg btn-full" onClick={onPay}>Done 🎉</button>
          </div>
        ) : step==="processing" ? (
          <div style={{textAlign:"center",padding:"40px 0"}}>
            <div style={{fontSize:48,marginBottom:16,animation:"spin 1s linear infinite",display:"inline-block"}}>⏳</div>
            <div className="syne" style={{fontSize:18,fontWeight:700}}>Processing Payment...</div>
            <div style={{color:T.muted,fontSize:13,marginTop:8}}>Please wait, do not close this window</div>
          </div>
        ) : (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <div className="syne" style={{fontSize:18,fontWeight:700}}>Checkout</div>
                <div style={{color:T.muted,fontSize:13}}>{orderLabel}</div>
              </div>
              <button onClick={onClose} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,width:34,height:34,cursor:"pointer",color:T.muted,fontSize:18}}>✕</button>
            </div>
            {/* rest of modal omitted for brevity */}
          </>
        )}
      </div>
    </div>
  );
}
