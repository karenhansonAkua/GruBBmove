import { useState, useEffect } from "react";
import { T, getTheme, HOSTELS, SERVICES } from "./theme.js";

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; color: ${T.text}; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
  .syne { font-family: 'Syne', sans-serif; }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
  @keyframes pulse    { 0%,100% { opacity:1 } 50% { opacity:.4 } }
  @keyframes spin     { to { transform:rotate(360deg) } }
  @keyframes slideUp  { from { transform:translateY(100%); opacity:0 } to { transform:translateY(0); opacity:1 } }
  @keyframes countdown-tick { 0% { transform:scale(1.12); color:#FF6B2B } 100% { transform:scale(1); color:inherit } }
  .fu  { animation: fadeUp  .45s ease both; }
  .fi  { animation: fadeIn  .35s ease both; }
  .su  { animation: slideUp .4s  ease both; }

  /* BUTTONS */
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; font-family:'DM Sans',sans-serif; font-weight:600; border:none; cursor:pointer; transition:all .2s; border-radius:14px; letter-spacing:.2px; }
  .btn-p  { background:linear-gradient(135deg,${T.accent},${T.accentL}); color:#fff; }
  .btn-p:hover  { transform:translateY(-2px); box-shadow:0 8px 28px ${T.accent}55; }
  .btn-p:active { transform:translateY(0); }
  .btn-g  { background:transparent; color:${T.text}; border:1.5px solid ${T.border}; }
  .btn-g:hover  { border-color:${T.accent}; color:${T.accent}; }
  .btn-sm { padding:10px 20px; font-size:13px; border-radius:11px; }
  .btn-md { padding:13px 26px; font-size:14px; }
  .btn-lg { padding:15px 32px; font-size:15px; }
  .btn-full { width:100%; }

  /* INPUTS */
  .inp { width:100%; background:${T.card}; border:1.5px solid ${T.border}; border-radius:12px; padding:13px 15px; color:${T.text}; font-family:'DM Sans',sans-serif; font-size:14px; outline:none; transition:border .2s; }
  .inp:focus { border-color:${T.accent}; }
  .inp::placeholder { color:${T.dim}; }
  select.inp { cursor:pointer; appearance:none; }

  /* CARDS */
  .card { background:${T.card}; border:1px solid ${T.border}; border-radius:20px; }
  .card-sm { border-radius:14px; }
  .hoverable:hover { border-color:${T.accent}44; transform:translateY(-2px); box-shadow:0 4px 20px #00000033; }

  /* PAYMENT */
  .pay-opt { border:1.5px solid ${T.border}; border-radius:14px; padding:15px; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:14px; }
  .pay-opt.sel { border-color:${T.accent}; background:${T.accentDim}; }
  .pay-opt:hover:not(.sel) { border-color:${T.accent}66; }

  /* TOGGLE */
  .toggle-opt { border:2px solid ${T.border}; border-radius:14px; padding:13px; cursor:pointer; transition:all .2s; }
  .toggle-opt:hover:not(.tog-active) { border-color:${T.muted}; }

  /* NAV */
  .nav-btn { display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; padding:7px 18px; border-radius:12px; transition:all .2s; color:${T.muted}; font-size:11px; font-weight:500; background:none; border:none; font-family:'DM Sans',sans-serif; }
  .nav-btn.on { color:${T.accent}; background:${T.accentDim}; }
  .nav-btn:hover:not(.on) { color:${T.text}; }

  /* TOAST */
  .toast { position:fixed; bottom:96px; left:50%; transform:translateX(-50%); padding:11px 22px; border-radius:12px; font-weight:600; font-size:13px; z-index:9999; white-space:nowrap; animation:fadeUp .3s ease; pointer-events:none; }

  /* BADGE */
  .badge { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:.3px; }

  /* SECTION DIVIDER */
  .sec-div { font-family:'Syne',sans-serif; font-size:11px; font-weight:700; color:${T.muted}; letter-spacing:1px; text-transform:uppercase; border-top:1px solid ${T.border}; padding-top:14px; margin-top:4px; }

  /* COUNTDOWN */
  .countdown-box { background:${T.card}; border:1px solid ${T.border}; border-radius:16px; padding:18px; text-align:center; }
  .countdown-num { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; color:${T.accent}; line-height:1; }
  .countdown-lbl { font-size:11px; color:${T.muted}; font-weight:600; letter-spacing:.5px; text-transform:uppercase; margin-top:4px; }
  .tick { animation: countdown-tick .5s ease; }

  /* CALENDAR */
  .cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; }
  .cal-day { aspect-ratio:1; display:flex; align-items:center; justify-content:center; border-radius:10px; font-size:13px; cursor:pointer; transition:all .15s; }
  .cal-day:hover:not(.cal-empty):not(.cal-past) { background:${T.accentDim}; color:${T.accent}; }
  .cal-day.cal-sel { background:${T.accent}; color:#fff; font-weight:700; }
  .cal-day.cal-today { border:2px solid ${T.accent}; color:${T.accent}; font-weight:700; }
  .cal-day.cal-past { opacity:.3; cursor:not-allowed; }
  .cal-day.cal-empty { cursor:default; }

  /* TIMELINE */
  .timeline-step { display:flex; gap:14px; }
  .tl-dot { width:12px; height:12px; border-radius:50%; flex-shrink:0; margin-top:4px; }
  .tl-line { width:2px; background:${T.border}; flex:1; min-height:30px; margin:4px 0 4px 5px; }

  /* ORDER CARD */
  .order-card { background:${T.card}; border:1px solid ${T.border}; border-radius:18px; padding:18px; transition:all .2s; }
  .order-card:hover { border-color:${T.accent}33; }

  /* SCROLLABLE */
  .scroll-x { display:flex; gap:10px; overflow-x:auto; padding-bottom:4px; scrollbar-width:none; }
  .scroll-x::-webkit-scrollbar { display:none; }

  /* CHIP */
  .chip { display:inline-flex; align-items:center; padding:7px 14px; border-radius:20px; border:1.5px solid; font-size:13px; font-weight:500; cursor:pointer; transition:all .2s; white-space:nowrap; flex-shrink:0; }
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const uid = () => `GBM-${Date.now().toString(36).toUpperCase()}`;
const pad = n => String(n).padStart(2, "0");

function useCountdown(targetDate) {
  const [delta, setDelta] = useState(null);
  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = new Date(targetDate) - Date.now();
      if (diff <= 0) { setDelta({ d:0,h:0,m:0,s:0 }); return; }
      setDelta({ d: Math.floor(diff/86400000), h: Math.floor((diff%86400000)/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return delta;
}

// ─── MINI CALENDAR ────────────────────────────────────────────────────────────
function MiniCalendar({ value, onChange }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [view, setView] = useState(value ? new Date(value) : new Date(today));
  const year = view.getFullYear(), month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const days = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const cells = [...Array(firstDay).fill(null), ...Array.from({length:daysInMonth},(_,i)=>i+1)];
  const selStr = value ? new Date(value).toDateString() : null;

  return (
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:16}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <button onClick={()=>setView(new Date(year,month-1,1))} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:8,width:30,height:30,cursor:"pointer",color:T.text,fontSize:16}}>‹</button>
        <span className="syne" style={{fontWeight:700,fontSize:14}}>{months[month]} {year}</span>
        <button onClick={()=>setView(new Date(year,month+1,1))} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:8,width:30,height:30,cursor:"pointer",color:T.text,fontSize:16}}>›</button>
      </div>
      {/* Day headers */}
      <div className="cal-grid" style={{marginBottom:6}}>
        {days.map(d=><div key={d} style={{textAlign:"center",fontSize:11,fontWeight:700,color:T.muted}}>{d}</div>)}
      </div>
      {/* Cells */}
      <div className="cal-grid">
        {cells.map((d,i)=>{
          if(!d) return <div key={i} className="cal-day cal-empty"/>;
          const thisDate = new Date(year,month,d);
          const isPast = thisDate < today;
          const isToday = thisDate.toDateString()===today.toDateString();
          const isSel = thisDate.toDateString()===selStr;
          return (
            <div key={i} className={`cal-day${isPast?" cal-past":""}${isToday&&!isSel?" cal-today":""}${isSel?" cal-sel":""}`}
              onClick={()=>{ if(!isPast){ onChange(new Date(year,month,d).toISOString().split("T")[0]); }}}>
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── COUNTDOWN DISPLAY ────────────────────────────────────────────────────────
function CountdownDisplay({ targetDate, label = "Scheduled in" }) {
  const delta = useCountdown(targetDate);
  if (!delta) return null;
  const isDone = delta.d===0&&delta.h===0&&delta.m===0&&delta.s===0;
  return (
    <div style={{background:T.accentDim,border:`1px solid ${T.accent}44`,borderRadius:16,padding:16,marginTop:8}}>
      <div style={{fontSize:12,fontWeight:600,color:T.accent,marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
        ⏱ {isDone?"Ready for pickup!":label}
      </div>
      {isDone ? (
        <div className="syne" style={{fontSize:18,fontWeight:800,color:T.green,textAlign:"center"}}>🚀 Ready Now!</div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[["d","Days"],["h","Hours"],["m","Mins"],["s","Secs"]].map(([k,lbl])=>(
            <div key={k} className="countdown-box">
              <div className="countdown-num">{pad(delta[k])}</div>
              <div className="countdown-lbl">{lbl}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TIME PICKER ──────────────────────────────────────────────────────────────
function TimePicker({ value, onChange }) {
  const hours = Array.from({length:24},(_,i)=>i);
  const mins = [0,15,30,45];
  const [h,m] = value ? value.split(":").map(Number) : [8,0];
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      <div>
        <div style={{fontSize:12,color:T.muted,marginBottom:6,fontWeight:500}}>Hour</div>
        <select className="inp" value={h} onChange={e=>onChange(`${pad(e.target.value)}:${pad(m)}`)}>
          {hours.map(hh=><option key={hh} value={hh}>{pad(hh)}:00</option>)}
        </select>
      </div>
      <div>
        <div style={{fontSize:12,color:T.muted,marginBottom:6,fontWeight:500}}>Minute</div>
        <select className="inp" value={m} onChange={e=>onChange(`${pad(h)}:${pad(e.target.value)}`)}>
          {mins.map(mm=><option key={mm} value={mm}>{pad(mm)}</option>)}
        </select>
      </div>
    </div>
  );
}

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────
function PaymentModal({ amount, orderLabel, onPay, onClose }) {
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
            {/* Amount */}
            <div style={{background:T.accentDim,border:`1px solid ${T.accent}44`,borderRadius:14,padding:16,marginBottom:20,textAlign:"center"}}>
              <div style={{fontSize:12,color:T.muted}}>Total Amount</div>
              <div className="syne" style={{fontSize:32,fontWeight:800,color:T.accent}}>GHS {amount}</div>
            </div>
            {/* Methods */}
            <div style={{fontSize:13,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Select Payment</div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
              {[
                {id:"momo",emoji:"📱",label:"Mobile Money (MoMo)",sub:"MTN, Telecel, AirtelTigo",color:"#FFB800"},
                {id:"cash",emoji:"💵",label:"Pay with Cash",sub:"Pay our rider on delivery",color:T.green},
              ].map(p=>(
                <div key={p.id} className={`pay-opt${method===p.id?" sel":""}`} onClick={()=>setMethod(p.id)}>
                  <div style={{width:44,height:44,borderRadius:12,background:method===p.id?`${p.color}33`:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,transition:"all .2s"}}>{p.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:14}}>{p.label}</div>
                    <div style={{fontSize:12,color:T.muted}}>{p.sub}</div>
                  </div>
                  <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${method===p.id?T.accent:T.border}`,background:method===p.id?T.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>
                    {method===p.id&&<div style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>}
                  </div>
                </div>
              ))}
            </div>
            {method==="momo" && (
              <div style={{marginBottom:16,animation:"fadeUp .3s ease"}}>
                <div style={{fontSize:13,color:T.muted,marginBottom:8,fontWeight:500}}>MoMo Network</div>
                <div className="scroll-x" style={{marginBottom:12}}>
                  {["MTN","Telecel","AirtelTigo"].map(n=>(
                    <button key={n} className="chip" onClick={()=>setNetwork(n)} style={{borderColor:network===n?T.accent:T.border,background:network===n?T.accentDim:"transparent",color:network===n?T.accent:T.muted}}>
                      {n==="MTN"?"🟡":n==="Telecel"?"🔵":"🔴"} {n}
                    </button>
                  ))}
                </div>
                <div style={{fontSize:13,color:T.muted,marginBottom:6,fontWeight:500}}>MoMo Number</div>
                <input className="inp" type="tel" placeholder="024 XXX XXXX" value={momoNum} onChange={e=>setMomoNum(e.target.value)} maxLength={12}/>
              </div>
            )}
            <button className="btn btn-p btn-lg btn-full" onClick={handlePay} disabled={!method||(method==="momo"&&!momoNum)} style={{opacity:(!method||(method==="momo"&&!momoNum))?.5:1}}>
              {method==="cash"?"Confirm Order (Cash on Delivery)":"Pay GHS "+amount+" via MoMo"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── ORDER SUCCESS SCREEN ─────────────────────────────────────────────────────
function OrderSuccess({ order, onBack }) {
  return (
    <div className="fi" style={{padding:"32px 20px",textAlign:"center"}}>
      <div style={{fontSize:64,marginBottom:20}}>🎉</div>
      <div className="syne" style={{fontSize:24,fontWeight:800,marginBottom:8}}>Order Placed!</div>
      <div style={{color:T.muted,fontSize:15,marginBottom:28,lineHeight:1.6}}>Your order is confirmed. We'll keep you updated.</div>
      <div className="card" style={{padding:20,textAlign:"left",marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span className="syne" style={{fontWeight:700}}>Order Details</span>
          <span className="badge" style={{background:T.accentDim,color:T.accent}}>PENDING</span>
        </div>
        {[["Order ID",order.id],["Service",order.label],["Location",order.hostel+" • Room "+order.room],["Amount","GHS "+order.amount],["Payment",order.payment==="momo"?"📱 MoMo":"💵 Cash on Delivery"]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
            <span style={{color:T.muted,fontSize:13}}>{k}</span>
            <span style={{fontSize:13,fontWeight:500}}>{v}</span>
          </div>
        ))}
      </div>
      {order.scheduledDate && (
        <CountdownDisplay targetDate={order.scheduledDate + "T" + (order.scheduledTime||"08:00")} label="Pickup scheduled in" />
      )}
      <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:10}}>
        <button className="btn btn-p btn-lg btn-full" onClick={onBack}>Back to Home</button>
      </div>
    </div>
  );
}

// ─── SHARED FORM PIECES ───────────────────────────────────────────────────────
function FLabel({children, theme = T}) { return <div style={{fontSize:13,color:theme.muted,marginBottom:6,fontWeight:500}}>{children}</div>; }
function FInput({label,value,onChange,placeholder,type="text",required,theme=T}) {
  return <div><FLabel theme={theme}>{label}{required&&<span style={{color:theme.accent}}> *</span>}</FLabel><input className="inp" type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{background:theme.card,borderColor:theme.border,color:theme.text}}/></div>;
}
function FSelect({label,value,onChange,options,required,theme=T}) {
  return (
    <div style={{position:"relative"}}>
      <FLabel theme={theme}>{label}{required&&<span style={{color:theme.accent}}> *</span>}</FLabel>
      <div style={{position:"relative"}}>
        <select className="inp" value={value} onChange={e=>onChange(e.target.value)} style={{background:theme.card,borderColor:theme.border,color:theme.text}}>
          <option value="">Select...</option>
          {options.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
        <div style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:theme.muted}}>▾</div>
      </div>
    </div>
  );
}
function FSep({children}) { return <div className="sec-div">{children}</div>; }

function SchedulerBlock({ form, setForm }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div>
        <FLabel>Select Pickup Date</FLabel>
        <MiniCalendar value={form.date} onChange={v=>setForm(p=>({...p,date:v}))} />
      </div>
      {form.date && (
        <div>
          <FLabel>Select Pickup Time</FLabel>
          <TimePicker value={form.time} onChange={v=>setForm(p=>({...p,time:v}))} />
        </div>
      )}
      {form.date && form.time && (
        <CountdownDisplay targetDate={form.date+"T"+form.time} label="Pickup scheduled in" />
      )}
    </div>
  );
}

function DeliveryDetailsBlock({ form, setForm }) {
  return (
    <>
      <FSep>Delivery Details</FSep>
      <FInput label="Full Name" required value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="e.g. Kwame Mensah"/>
      <FSelect label="Hostel" required value={form.hostel} onChange={v=>setForm(p=>({...p,hostel:v}))} options={HOSTELS}/>
      <FInput label="Room Number" required value={form.room} onChange={v=>setForm(p=>({...p,room:v}))} placeholder="e.g. B-204"/>
      <FInput label="Phone Number" required type="tel" value={form.phone} onChange={v=>setForm(p=>({...p,phone:v}))} placeholder="024 XXX XXXX"/>
    </>
  );
}

// ─── GAS SERVICE PAGE ─────────────────────────────────────────────────────────
function GasPage({ user, onOrder, showToast }) {
  const [mode, setMode] = useState("instant");
  const [form, setForm] = useState({ name:user?.name||"", hostel:user?.hostel||"", room:user?.room||"", phone:user?.phone||"", cylinder:"", notes:"", date:"", time:"08:00" });
  const [showPay, setShowPay] = useState(false);
  const sizes = [{ l:"3kg", p:"55" },{ l:"6kg", p:"95" },{ l:"14.5kg", p:"195" }];
  const price = sizes.find(s=>s.l===form.cylinder)?.p || "0";

  const validate = () => {
    if (!form.name||!form.hostel||!form.room||!form.phone) { showToast("⚠️ Please fill all delivery details"); return false; }
    if (!form.cylinder) { showToast("⚠️ Please select cylinder size"); return false; }
    if (mode==="scheduled" && !form.date) { showToast("⚠️ Please pick a delivery date"); return false; }
    return true;
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {showPay && (
        <PaymentModal amount={price} orderLabel={`Gas Refill (${form.cylinder})`}
          onPay={method=>{ setShowPay(false); onOrder({ label:`Gas Refill — ${form.cylinder}`, hostel:form.hostel, room:form.room, amount:price, payment:method, scheduledDate:mode==="scheduled"?form.date:null, scheduledTime:form.time }); }}
          onClose={()=>setShowPay(false)} />
      )}

      {/* MODE TOGGLE */}
      <div>
        <FLabel>Refill Type</FLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{id:"instant",label:"⚡ Instant",sub:"Within 45 minutes"},{id:"scheduled",label:"📅 Scheduled",sub:"Pick date & time"}].map(t=>(
            <div key={t.id} className={`toggle-opt${mode===t.id?" tog-active":""}`} onClick={()=>setMode(t.id)}
              style={{background:mode===t.id?T.accentDim:"transparent",borderColor:mode===t.id?T.accent:T.border}}>
              <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>{t.label}</div>
              <div style={{fontSize:12,color:T.muted}}>{t.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CYLINDER SIZE */}
      <div>
        <FLabel>Cylinder Size <span style={{color:T.accent}}>*</span></FLabel>
        {sizes.map(s=>(
          <div key={s.l} onClick={()=>setForm(p=>({...p,cylinder:s.l}))}
            style={{border:`2px solid ${form.cylinder===s.l?T.accent:T.border}`,borderRadius:12,padding:"13px 15px",cursor:"pointer",background:form.cylinder===s.l?T.accentDim:"transparent",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,transition:"all .2s"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontSize:24}}>🔥</div>
              <div><div style={{fontWeight:600,fontSize:14}}>{s.l} Cylinder</div><div style={{fontSize:12,color:T.muted}}>Standard refill</div></div>
            </div>
            <div className="syne" style={{fontSize:17,fontWeight:800,color:T.accent}}>GHS {s.p}</div>
          </div>
        ))}
      </div>

      {/* SCHEDULED OPTIONS */}
      {mode==="scheduled" && <SchedulerBlock form={form} setForm={setForm} />}

      <DeliveryDetailsBlock form={form} setForm={setForm} />
      <FInput label="Special instructions (optional)" value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="e.g. call before coming, gate code..."/>

      <div style={{background:T.accentDim,border:`1px solid ${T.accent}44`,borderRadius:14,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{color:T.muted,fontSize:14}}>Total</span>
        <span className="syne" style={{fontSize:22,fontWeight:800,color:T.accent}}>GHS {price}</span>
      </div>

      <button className="btn btn-p btn-lg btn-full" onClick={()=>{ if(validate()) setShowPay(true); }}>
        {mode==="instant"?"Order Instant Refill 🔥":"Schedule Gas Refill 📅"}
      </button>
    </div>
  );
}

// ─── LAUNDRY SERVICE PAGE ─────────────────────────────────────────────────────
function LaundryPage({ user, onOrder, showToast }) {
  const [mode, setMode] = useState("instant");
  const [form, setForm] = useState({ name:user?.name||"", hostel:user?.hostel||"", room:user?.room||"", phone:user?.phone||"", bags:"1", service:"", notes:"", date:"", time:"08:00" });
  const [showPay, setShowPay] = useState(false);

  const svcs = [{ id:"wash_fold",label:"Wash & Fold",price:"25",emoji:"🧺" },{ id:"wash_iron",label:"Wash & Iron",price:"35",emoji:"👔" },{ id:"dry_clean",label:"Dry Cleaning",price:"50",emoji:"✨" }];
  const svc = svcs.find(s=>s.id===form.service);
  const bags = parseInt(form.bags)||1;
  const total = svc ? String(parseInt(svc.price)*bags) : "0";

  const validate = () => {
    if (!form.name||!form.hostel||!form.room||!form.phone) { showToast("⚠️ Please fill all pickup details"); return false; }
    if (!form.service) { showToast("⚠️ Please select a service type"); return false; }
    if (mode==="scheduled" && !form.date) { showToast("⚠️ Please pick a pickup date"); return false; }
    return true;
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {showPay && (
        <PaymentModal amount={total} orderLabel={`Laundry — ${svc?.label} (${form.bags} bag${bags>1?"s":""})`}
          onPay={method=>{ setShowPay(false); onOrder({ label:`Laundry — ${svc?.label}`, hostel:form.hostel, room:form.room, amount:total, payment:method, scheduledDate:mode==="scheduled"?form.date:null, scheduledTime:form.time }); }}
          onClose={()=>setShowPay(false)} />
      )}

      <div>
        <FLabel>Pickup Type</FLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{id:"instant",label:"⚡ Instant Pickup",sub:"We come to you now"},{id:"scheduled",label:"📅 Schedule Pickup",sub:"Set date & time"}].map(t=>(
            <div key={t.id} className={`toggle-opt${mode===t.id?" tog-active":""}`} onClick={()=>setMode(t.id)}
              style={{background:mode===t.id?T.blueDim:"transparent",borderColor:mode===t.id?T.blue:T.border}}>
              <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>{t.label}</div>
              <div style={{fontSize:12,color:T.muted}}>{t.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <FLabel>Service Type <span style={{color:T.accent}}>*</span></FLabel>
        {svcs.map(s=>(
          <div key={s.id} onClick={()=>setForm(p=>({...p,service:s.id}))}
            style={{border:`2px solid ${form.service===s.id?T.blue:T.border}`,borderRadius:12,padding:"13px 15px",cursor:"pointer",background:form.service===s.id?T.blueDim:"transparent",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,transition:"all .2s"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontSize:24}}>{s.emoji}</div>
              <div style={{fontWeight:600,fontSize:14}}>{s.label}</div>
            </div>
            <div className="syne" style={{fontSize:15,fontWeight:800,color:T.blue}}>GHS {s.price}/bag</div>
          </div>
        ))}
      </div>

      <div>
        <FLabel>Number of Bags</FLabel>
        <div style={{display:"flex",gap:8}}>
          {["1","2","3","4","5+"].map(n=>(
            <button key={n} onClick={()=>setForm(p=>({...p,bags:n}))} style={{flex:1,padding:"11px 6px",border:`2px solid ${form.bags===n?T.blue:T.border}`,borderRadius:10,background:form.bags===n?T.blueDim:"transparent",color:form.bags===n?T.blue:T.text,cursor:"pointer",fontWeight:700,fontSize:14,transition:"all .2s"}}>{n}</button>
          ))}
        </div>
      </div>

      {mode==="scheduled" && (
        <div style={{background:T.blueDim,border:`1px solid ${T.blue}44`,borderRadius:14,padding:14}}>
          <div style={{fontSize:13,fontWeight:600,color:T.blue,marginBottom:12}}>📅 Schedule Your Pickup</div>
          <SchedulerBlock form={form} setForm={setForm} />
        </div>
      )}

      <DeliveryDetailsBlock form={form} setForm={setForm} />
      <FInput label="Special instructions (optional)" value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="e.g. handle delicates gently, separate whites..."/>

      {svc && (
        <div style={{background:T.blueDim,border:`1px solid ${T.blue}44`,borderRadius:14,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:13,color:T.muted}}>{svc.label} × {bags} bag{bags>1?"s":""}</div>
            <div style={{fontSize:12,color:T.muted}}>GHS {svc.price} per bag</div>
          </div>
          <span className="syne" style={{fontSize:22,fontWeight:800,color:T.blue}}>GHS {total}</span>
        </div>
      )}

      <button className="btn btn-lg btn-full" onClick={()=>{ if(validate()) setShowPay(true); }}
        style={{background:`linear-gradient(135deg,${T.blue},#60A5FA)`,color:"#fff",borderRadius:14,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"15px"}}>
        {mode==="instant"?"Book Instant Pickup 👕":"Schedule Laundry 📅"}
      </button>
    </div>
  );
}

// ─── MOVING SERVICE PAGE ──────────────────────────────────────────────────────
function MovingPage({ user, onOrder, showToast }) {
  const [form, setForm] = useState({ name:user?.name||"", phone:user?.phone||"", fromHostel:user?.hostel||"", fromRoom:user?.room||"", toHostel:"", toRoom:"", date:"", time:"08:00", items:[], notes:"" });
  const [custom, setCustom] = useState("");
  const [showPay, setShowPay] = useState(false);
  const preset = ["Mattress","Wardrobe","Fridge","TV","Boxes/Bags","Desk & Chair","Books & Study materials","Cooking Equipment","Fan","Mini-fridge"];
  const toggle = item => setForm(p=>({...p,items:p.items.includes(item)?p.items.filter(i=>i!==item):[...p.items,item]}));
  const addCustom = () => { if (!custom.trim()) return; toggle(custom.trim()); setCustom(""); };
  const price = form.items.length<=3?"80":form.items.length<=6?"130":"180";

  const validate = () => {
    if (!form.name||!form.phone||!form.fromHostel||!form.fromRoom||!form.toHostel||!form.toRoom) { showToast("⚠️ Please fill all required fields"); return false; }
    if (!form.date||!form.time) { showToast("⚠️ Please pick a moving date & time"); return false; }
    if (form.items.length===0) { showToast("⚠️ Please select items to move"); return false; }
    return true;
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {showPay && (
        <PaymentModal amount={price} orderLabel="Hostel Moving"
          onPay={method=>{ setShowPay(false); onOrder({ label:"Hostel Moving", hostel:form.toHostel, room:form.toRoom, amount:price, payment:method, scheduledDate:form.date, scheduledTime:form.time }); }}
          onClose={()=>setShowPay(false)} />
      )}

      <div style={{background:T.purpleDim,border:`1px solid ${T.purple}44`,borderRadius:14,padding:14}}>
        <div style={{fontSize:13,fontWeight:600,color:T.purple}}>📦 Pricing Guide</div>
        {[["1-3 items","GHS 80"],["4-6 items","GHS 130"],["7+ items","GHS 180"]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13,color:T.muted,marginTop:6}}>
            <span>{k}</span><span style={{fontWeight:700,color:T.purple}}>{v}</span>
          </div>
        ))}
        {form.items.length>0&&<div style={{marginTop:10,fontSize:13,fontWeight:700,color:T.purple}}>Your estimate: GHS {price}</div>}
      </div>

      <FSep>Moving From</FSep>
      <FSelect label="Current Hostel" required value={form.fromHostel} onChange={v=>setForm(p=>({...p,fromHostel:v}))} options={HOSTELS}/>
      <FInput label="Current Room Number" required value={form.fromRoom} onChange={v=>setForm(p=>({...p,fromRoom:v}))} placeholder="e.g. A-12"/>

      <FSep>Moving To</FSep>
      <FSelect label="Destination Hostel" required value={form.toHostel} onChange={v=>setForm(p=>({...p,toHostel:v}))} options={HOSTELS}/>
      <FInput label="Destination Room Number" required value={form.toRoom} onChange={v=>setForm(p=>({...p,toRoom:v}))} placeholder="e.g. C-305"/>

      <FSep>Moving Schedule</FSep>
      <SchedulerBlock form={form} setForm={setForm} />

      <div>
        <div style={{fontSize:14,fontWeight:600,marginBottom:10}}>
          Items to Move <span style={{color:T.purple,fontSize:13}}>({form.items.length} selected)</span>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
          {preset.map(item=>(
            <button key={item} className="chip" onClick={()=>toggle(item)}
              style={{borderColor:form.items.includes(item)?T.purple:T.border,background:form.items.includes(item)?T.purpleDim:"transparent",color:form.items.includes(item)?T.purple:T.muted}}>
              {form.items.includes(item)?"✓ ":""}{item}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input className="inp" placeholder="Add custom item..." value={custom} onChange={e=>setCustom(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustom()} style={{flex:1}}/>
          <button onClick={addCustom} style={{background:T.purple,border:"none",borderRadius:12,padding:"0 16px",cursor:"pointer",color:"#fff",fontSize:22,fontWeight:300}}>+</button>
        </div>
      </div>

      <FSep>Your Details</FSep>
      <FInput label="Full Name" required value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="Your full name"/>
      <FInput label="Phone Number" required type="tel" value={form.phone} onChange={v=>setForm(p=>({...p,phone:v}))} placeholder="024 XXX XXXX"/>
      <FInput label="Special instructions (optional)" value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="e.g. fragile items, need help packing"/>

      <button className="btn btn-lg btn-full" onClick={()=>{ if(validate()) setShowPay(true); }}
        style={{background:`linear-gradient(135deg,${T.purple},#C084FC)`,color:"#fff",borderRadius:14,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"15px"}}>
        Book Moving Service 📦
      </button>
    </div>
  );
}

// ─── GROCERIES PAGE ───────────────────────────────────────────────────────────
function GroceriesPage({ user, onOrder, showToast }) {
  const [items, setItems] = useState([{name:"",qty:"1",note:""}]);
  const [form, setForm] = useState({ name:user?.name||"", hostel:user?.hostel||"", room:user?.room||"", phone:user?.phone||"", notes:"", date:"", time:"08:00", mode:"instant" });
  const [showPay, setShowPay] = useState(false);
  const add = () => setItems(p=>[...p,{name:"",qty:"1",note:""}]);
  const remove = i => setItems(p=>p.filter((_,idx)=>idx!==i));
  const upd = (i,k,v) => setItems(p=>p.map((it,idx)=>idx===i?{...it,[k]:v}:it));
  const filled = items.filter(it=>it.name.trim());
  const validate = () => {
    if (filled.length===0) { showToast("⚠️ Please add at least one item"); return false; }
    if (!form.name||!form.hostel||!form.room||!form.phone) { showToast("⚠️ Please fill all delivery details"); return false; }
    return true;
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {showPay && (
        <PaymentModal amount="Varies" orderLabel={`Groceries — ${filled.length} item(s)`}
          onPay={method=>{ setShowPay(false); onOrder({ label:`Groceries (${filled.length} items)`, hostel:form.hostel, room:form.room, amount:"Varies", payment:method, scheduledDate:form.mode==="scheduled"?form.date:null, scheduledTime:form.time }); }}
          onClose={()=>setShowPay(false)} />
      )}
      <div style={{background:T.greenDim,border:`1px solid ${T.green}44`,borderRadius:14,padding:14}}>
        <div style={{fontSize:13,fontWeight:600,color:T.green}}>🛒 How Groceries Work</div>
        <div style={{fontSize:13,color:T.muted,marginTop:4,lineHeight:1.6}}>Tell us what you need. We source from nearby shops and deliver to your room. Final cost is confirmed at delivery.</div>
      </div>

      <div>
        <FLabel>Delivery Type</FLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{id:"instant",label:"⚡ Instant",sub:"ASAP delivery"},{id:"scheduled",label:"📅 Scheduled",sub:"Pick time slot"}].map(t=>(
            <div key={t.id} className={`toggle-opt${form.mode===t.id?" tog-active":""}`} onClick={()=>setForm(p=>({...p,mode:t.id}))}
              style={{background:form.mode===t.id?T.greenDim:"transparent",borderColor:form.mode===t.id?T.green:T.border}}>
              <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>{t.label}</div>
              <div style={{fontSize:12,color:T.muted}}>{t.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {form.mode==="scheduled" && <SchedulerBlock form={form} setForm={setForm} />}

      <div>
        <FLabel>Your Shopping List <span style={{color:T.accent}}>*</span></FLabel>
        {items.map((item,i)=>(
          <div key={i} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:14,marginBottom:10}}>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <input className="inp" placeholder="Item (e.g. sachet water, bread)" value={item.name} onChange={e=>upd(i,"name",e.target.value)} style={{flex:1}}/>
              <select className="inp" value={item.qty} onChange={e=>upd(i,"qty",e.target.value)} style={{width:72}}>
                {["1","2","3","4","5","6+"].map(n=><option key={n}>{n}</option>)}
              </select>
            </div>
            <div style={{display:"flex",gap:8}}>
              <input className="inp" placeholder="Brand or note (optional)" value={item.note} onChange={e=>upd(i,"note",e.target.value)} style={{flex:1}}/>
              {items.length>1&&<button onClick={()=>remove(i)} style={{background:"#EF444422",border:"none",borderRadius:10,width:42,cursor:"pointer",color:"#EF4444",fontSize:18}}>✕</button>}
            </div>
          </div>
        ))}
        <button className="btn btn-g btn-md btn-full" onClick={add} style={{fontSize:14}}>+ Add Another Item</button>
      </div>

      <DeliveryDetailsBlock form={form} setForm={setForm} />
      <FInput label="Additional notes (optional)" value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="e.g. if item unavailable, call me"/>

      <button className="btn btn-lg btn-full" onClick={()=>{ if(validate()) setShowPay(true); }}
        style={{background:`linear-gradient(135deg,${T.green},#4ADE80)`,color:"#fff",borderRadius:14,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:15,padding:"15px"}}>
        Place Grocery Order 🛒
      </button>
    </div>
  );
}

// ─── PHARMACY PAGE ────────────────────────────────────────────────────────────
function PharmacyPage({ user, onOrder, showToast }) {
  const [items, setItems] = useState([{name:"",qty:"1"}]);
  const [rx, setRx] = useState(false);
  const [form, setForm] = useState({ name:user?.name||"", hostel:user?.hostel||"", room:user?.room||"", phone:user?.phone||"", notes:"", date:"", time:"08:00", mode:"instant" });
  const [showPay, setShowPay] = useState(false);
  const add = () => setItems(p=>[...p,{name:"",qty:"1"}]);
  const upd = (i,k,v) => setItems(p=>p.map((it,idx)=>idx===i?{...it,[k]:v}:it));
  const filled = items.filter(it=>it.name.trim());
  const validate = () => {
    if (filled.length===0) { showToast("⚠️ Please add at least one medicine"); return false; }
    if (!form.name||!form.hostel||!form.room||!form.phone) { showToast("⚠️ Please fill all delivery details"); return false; }
    return true;
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {showPay && (
        <PaymentModal amount="Varies" orderLabel={`Pharmacy — ${filled.length} item(s)`}
          onPay={method=>{ setShowPay(false); onOrder({ label:`Pharmacy (${filled.length} items)`, hostel:form.hostel, room:form.room, amount:"Varies", payment:method, scheduledDate:form.mode==="scheduled"?form.date:null, scheduledTime:form.time }); }}
          onClose={()=>setShowPay(false)} />
      )}
      <div style={{background:T.pinkDim,border:`1px solid ${T.pink}44`,borderRadius:14,padding:14}}>
        <div style={{fontSize:13,fontWeight:600,color:T.pink}}>💊 Licensed Pharmacies Only</div>
        <div style={{fontSize:13,color:T.muted,marginTop:4,lineHeight:1.6}}>We source from licensed pharmacies only. Prescription-only medicines require a valid prescription image.</div>
      </div>

      <div>
        <FLabel>Delivery Type</FLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{id:"instant",label:"⚡ Instant",sub:"ASAP delivery"},{id:"scheduled",label:"📅 Scheduled",sub:"Pick time slot"}].map(t=>(
            <div key={t.id} className={`toggle-opt${form.mode===t.id?" tog-active":""}`} onClick={()=>setForm(p=>({...p,mode:t.id}))}
              style={{background:form.mode===t.id?T.pinkDim:"transparent",borderColor:form.mode===t.id?T.pink:T.border}}>
              <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>{t.label}</div>
              <div style={{fontSize:12,color:T.muted}}>{t.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {form.mode==="scheduled" && <SchedulerBlock form={form} setForm={setForm} />}

      <div>
        <FLabel>Medicines / Items Needed <span style={{color:T.accent}}>*</span></FLabel>
        {items.map((item,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
            <input className="inp" placeholder="e.g. Paracetamol 500mg, Amoxicillin 250mg" value={item.name} onChange={e=>upd(i,"name",e.target.value)} style={{flex:1}}/>
            <select className="inp" value={item.qty} onChange={e=>upd(i,"qty",e.target.value)} style={{width:72}}>
              {["1","2","3","5","10"].map(n=><option key={n}>{n}</option>)}
            </select>
          </div>
        ))}
        <button className="btn btn-g btn-md btn-full" onClick={add} style={{fontSize:14,marginTop:4}}>+ Add Item</button>
      </div>

      <div onClick={()=>setRx(!rx)} style={{border:`2px solid ${rx?T.pink:T.border}`,borderRadius:14,padding:"14px 16px",cursor:"pointer",background:rx?T.pinkDim:"transparent",display:"flex",alignItems:"center",gap:12,transition:"all .2s"}}>
        <div style={{width:22,height:22,borderRadius:7,border:`2px solid ${rx?T.pink:T.border}`,background:rx?T.pink:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {rx&&<span style={{color:"#fff",fontSize:13}}>✓</span>}
        </div>
        <div>
          <div style={{fontWeight:600,fontSize:14}}>I have a prescription</div>
          <div style={{fontSize:12,color:T.muted}}>Required for prescription-only medicines</div>
        </div>
      </div>
      {rx && (
        <div style={{border:`2px dashed ${T.pink}`,borderRadius:14,padding:"22px",textAlign:"center",cursor:"pointer",background:T.pinkDim}}>
          <div style={{fontSize:28,marginBottom:6}}>📷</div>
          <div style={{fontSize:14,fontWeight:600}}>Upload Prescription</div>
          <div style={{fontSize:12,color:T.muted,marginTop:4}}>Tap to take a photo or select from gallery</div>
        </div>
      )}

      <DeliveryDetailsBlock form={form} setForm={setForm} />
      <FInput label="Notes for pharmacist (optional)" value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="e.g. generic brand is fine, no substitutions"/>

      <button className="btn btn-lg btn-full" onClick={()=>{ if(validate()) setShowPay(true); }}
        style={{background:`linear-gradient(135deg,${T.pink},#F472B6)`,color:"#fff",borderRadius:14,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:15,padding:"15px"}}>
        Order from Pharmacy 💊
      </button>
    </div>
  );
}

// ─── QUICK DELIVERY PAGE ──────────────────────────────────────────────────────
function DeliveryPage({ user, onOrder, showToast }) {
  const [form, setForm] = useState({ name:user?.name||"", phone:user?.phone||"", pickup:"", dropHostel:user?.hostel||"", dropRoom:user?.room||"", desc:"", size:"", notes:"", date:"", time:"08:00", mode:"instant" });
  const [showPay, setShowPay] = useState(false);
  const sizes = [{id:"small",l:"Small",d:"Envelope, small box",p:"15"},{id:"medium",l:"Medium",d:"Shopping bag, parcel",p:"25"},{id:"large",l:"Large",d:"Multiple bags, large box",p:"40"}];
  const price = sizes.find(s=>s.id===form.size)?.p||"0";
  const validate = () => {
    if (!form.name||!form.phone||!form.pickup||!form.dropHostel||!form.dropRoom||!form.desc||!form.size) { showToast("⚠️ Please fill all required fields"); return false; }
    return true;
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {showPay && (
        <PaymentModal amount={price} orderLabel={`Quick Delivery (${form.size})`}
          onPay={method=>{ setShowPay(false); onOrder({ label:`Quick Delivery (${form.size})`, hostel:form.dropHostel, room:form.dropRoom, amount:price, payment:method, scheduledDate:form.mode==="scheduled"?form.date:null, scheduledTime:form.time }); }}
          onClose={()=>setShowPay(false)} />
      )}

      <div>
        <FLabel>Delivery Type</FLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{id:"instant",label:"⚡ Instant",sub:"Pickup ASAP"},{id:"scheduled",label:"📅 Scheduled",sub:"Set pickup time"}].map(t=>(
            <div key={t.id} className={`toggle-opt${form.mode===t.id?" tog-active":""}`} onClick={()=>setForm(p=>({...p,mode:t.id}))}
              style={{background:form.mode===t.id?T.yellowDim:"transparent",borderColor:form.mode===t.id?T.yellow:T.border}}>
              <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>{t.label}</div>
              <div style={{fontSize:12,color:T.muted}}>{t.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {form.mode==="scheduled" && <SchedulerBlock form={form} setForm={setForm} />}

      <FSep>Pickup Details</FSep>
      <FInput label="Pickup Location" required value={form.pickup} onChange={v=>setForm(p=>({...p,pickup:v}))} placeholder="e.g. University main gate, shop name, address"/>
      <FInput label="Item Description" required value={form.desc} onChange={v=>setForm(p=>({...p,desc:v}))} placeholder="e.g. 3 textbooks and a laptop charger"/>

      <div>
        <FLabel>Item Size <span style={{color:T.accent}}>*</span></FLabel>
        {sizes.map(s=>(
          <div key={s.id} onClick={()=>setForm(p=>({...p,size:s.id}))}
            style={{border:`2px solid ${form.size===s.id?T.yellow:T.border}`,borderRadius:12,padding:"13px 15px",cursor:"pointer",background:form.size===s.id?T.yellowDim:"transparent",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,transition:"all .2s"}}>
            <div>
              <div style={{fontWeight:600,fontSize:14}}>{s.l}</div>
              <div style={{fontSize:12,color:T.muted}}>{s.d}</div>
            </div>
            <div className="syne" style={{fontSize:16,fontWeight:800,color:T.yellow}}>GHS {s.p}</div>
          </div>
        ))}
      </div>

      <FSep>Delivery Address</FSep>
      <FSelect label="Deliver to Hostel" required value={form.dropHostel} onChange={v=>setForm(p=>({...p,dropHostel:v}))} options={HOSTELS}/>
      <FInput label="Room Number" required value={form.dropRoom} onChange={v=>setForm(p=>({...p,dropRoom:v}))} placeholder="e.g. B-204"/>
      <FInput label="Your Name" required value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="Recipient name"/>
      <FInput label="Phone Number" required type="tel" value={form.phone} onChange={v=>setForm(p=>({...p,phone:v}))} placeholder="024 XXX XXXX"/>
      <FInput label="Additional notes (optional)" value={form.notes} onChange={v=>setForm(p=>({...p,notes:v}))} placeholder="e.g. call on arrival, fragile"/>

      {form.size && (
        <div style={{background:T.yellowDim,border:`1px solid ${T.yellow}44`,borderRadius:14,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{color:T.muted,fontSize:14}}>{sizes.find(s=>s.id===form.size)?.l} delivery</span>
          <span className="syne" style={{fontSize:22,fontWeight:800,color:T.yellow}}>GHS {price}</span>
        </div>
      )}

      <button className="btn btn-lg btn-full" onClick={()=>{ if(validate()) setShowPay(true); }}
        style={{background:`linear-gradient(135deg,${T.yellow},#FCD34D)`,color:"#1A1A1A",borderRadius:14,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:15,padding:"15px"}}>
        Book Delivery 🚚
      </button>
    </div>
  );
}

// REMOVED - See TrackingPage with theme support below


// ─── ORDERS TAB ───────────────────────────────────────────────────────────────
function OrdersTab({ orders, onTrack }) {
  const sc = { pending:"#F59E0B", processing:T.blue, delivered:T.green, cancelled:"#EF4444" };
  const sl = { pending:"Pending",  processing:"On the way", delivered:"Delivered", cancelled:"Cancelled" };
  return (
    <div style={{padding:"24px 20px"}}>
      <div className="syne" style={{fontSize:22,fontWeight:800,marginBottom:20}}>My Orders</div>
      {orders.length===0 ? (
        <div style={{textAlign:"center",padding:"60px 20px"}}>
          <div style={{fontSize:52,marginBottom:14}}>📋</div>
          <div style={{fontSize:16,fontWeight:600,marginBottom:8}}>No orders yet</div>
          <div style={{color:T.muted,fontSize:14}}>Place your first order to see it here</div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {orders.map(o=>(
            <div key={o.id} className="order-card" onClick={()=>onTrack(o)} style={{cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{fontWeight:600,fontSize:15}}>{o.label}</div>
                  <div style={{fontSize:12,color:T.muted,marginTop:2}}>#{o.id} • {o.time}</div>
                </div>
                <span className="badge" style={{background:`${sc[o.status]}22`,color:sc[o.status]}}>{sl[o.status]}</span>
              </div>
              <div style={{fontSize:13,color:T.muted,marginBottom:10}}>{o.hostel} • Room {o.room}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontWeight:700,fontSize:15,color:T.accent}}>GHS {o.amount}</span>
                <span style={{fontSize:12,color:T.muted}}>{o.payment==="momo"?"📱 MoMo":"💵 Cash"} • Tap to track →</span>
              </div>
              {o.scheduledDate && <CountdownDisplay targetDate={o.scheduledDate+"T"+(o.scheduledTime||"08:00")} label="Pickup in" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PROFILE TAB ──────────────────────────────────────────────────────────────
function ProfileTab({ user, onSignOut, showToast }) {
  return (
    <div style={{padding:"24px 20px"}}>
      <div className="syne" style={{fontSize:22,fontWeight:800,marginBottom:20}}>My Profile</div>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:`linear-gradient(135deg,${T.accent},${T.accentL})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
          <span className="syne" style={{fontSize:32,fontWeight:800,color:"#fff"}}>{(user?.name||"S")[0]}</span>
        </div>
        <div className="syne" style={{fontSize:18,fontWeight:700}}>{user?.name}</div>
        <div style={{fontSize:14,color:T.muted,marginTop:4}}>{user?.email}</div>
        <div style={{fontSize:12,color:T.dim,marginTop:3}}>{user?.year||""} {user?.program ? `• ${user.program}`:""}</div>
      </div>
      {[
        {title:"Delivery Info",items:[{l:"Hostel",v:user?.hostel||"Not set"},{l:"Room",v:user?.room||"Not set"},{l:"Phone",v:user?.phone||"Not set"}]},
        {title:"Academic Info",items:[{l:"Year",v:user?.year||"Not set"},{l:"Programme",v:user?.program||"Not set"}]},
      ].map(sec=>(
        <div key={sec.title} className="card" style={{padding:"18px 16px",marginBottom:12}}>
          <div style={{fontSize:11,color:T.muted,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>{sec.title}</div>
          {sec.items.map(item=>(
            <div key={item.l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
              <span style={{color:T.muted,fontSize:14}}>{item.l}</span>
              <span style={{fontSize:14,fontWeight:500}}>{item.v}</span>
            </div>
          ))}
        </div>
      ))}
      <button className="btn btn-g btn-lg btn-full" style={{marginBottom:10}} onClick={()=>showToast("Edit profile — coming soon!")}>✏️ Edit Profile</button>
      <button onClick={onSignOut} style={{width:"100%",background:"#EF444420",color:"#EF4444",border:"1.5px solid #EF444430",borderRadius:14,padding:"13px",fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:600,cursor:"pointer"}}>🚪 Sign Out</button>
    </div>
  );
}

// ─── HOME TAB ─────────────────────────────────────────────────────────────────
function HomeTab({ user, onNavigate }) {
  const h = new Date().getHours();
  const greet = h<12?"Good morning ☀️":h<17?"Good afternoon 👋":"Good evening 🌙";
  return (
    <div style={{padding:"24px 20px 0"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <div style={{fontSize:14,color:T.muted}}>{greet}</div>
          <div className="syne" style={{fontSize:22,fontWeight:800,marginTop:2}}>{user?.name?.split(" ")[0]||"Student"}</div>
          {user?.hostel&&<div style={{fontSize:13,color:T.muted,marginTop:2}}>{user.hostel} • Room {user.room}</div>}
        </div>
        <div style={{width:46,height:46,borderRadius:"50%",background:`linear-gradient(135deg,${T.accent},${T.accentL})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span className="syne" style={{fontSize:18,fontWeight:800,color:"#fff"}}>{(user?.name||"S")[0]}</span>
        </div>
      </div>

      {/* GAS HERO */}
      <div onClick={()=>onNavigate("service","gas")} style={{background:"linear-gradient(135deg,#CC3300,#FF8C00)",borderRadius:24,padding:"22px",marginBottom:22,cursor:"pointer",position:"relative",overflow:"hidden",transition:"transform .2s"}} className="hoverable">
        <div style={{position:"absolute",top:-30,right:-30,width:130,height:130,borderRadius:"50%",background:"#ffffff12"}}/>
        <div style={{position:"absolute",bottom:-20,right:20,width:90,height:90,borderRadius:"50%",background:"#ffffff09"}}/>
        <div className="badge" style={{background:"#ffffff22",color:"#fff",marginBottom:12}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:"#fff",animation:"pulse 1.5s infinite"}}/>
          Most Popular
        </div>
        <h3 className="syne" style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:5}}>🔥 Gas Refill</h3>
        <p style={{color:"#ffffffCC",fontSize:13,marginBottom:18,lineHeight:1.5}}>Instant or scheduled cylinder refills — delivered right to your door</p>
        <div style={{display:"flex",gap:8}}>
          {["⚡ Instant","📅 Scheduled"].map(t=><span key={t} style={{background:"#ffffff22",color:"#fff",borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:600}}>{t}</span>)}
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="syne" style={{fontSize:16,fontWeight:700,marginBottom:14}}>All Services</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {SERVICES.filter(s=>s.id!=="gas").map((s,i)=>(
          <div key={s.id} className="card hoverable" style={{padding:"18px 16px",cursor:"pointer",animation:`fadeUp .4s ease ${i*.07}s both`,transition:"all .2s"}} onClick={()=>onNavigate("service",s.id)}>
            <div style={{width:44,height:44,borderRadius:14,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,fontSize:24}}>{s.emoji}</div>
            <div style={{fontWeight:600,fontSize:14,marginBottom:3}}>{s.label}</div>
            <div style={{fontSize:12,color:T.muted,lineHeight:1.4}}>{s.desc}</div>
          </div>
        ))}
      </div>

      <div style={{background:T.accentDim,border:`1px solid ${T.accent}44`,borderRadius:16,padding:"14px",marginBottom:24}}>
        <div style={{fontSize:13,fontWeight:600,color:T.accent,marginBottom:3}}>💡 Pro tip</div>
        <div style={{fontSize:13,color:T.muted}}>Your hostel & room are pre-filled on every order — no need to re-enter them!</div>
      </div>
    </div>
  );
}

// ─── DASHBOARD SHELL ──────────────────────────────────────────────────────────
function Dashboard({ user, orders, onPlaceOrder, onSignOut, showToast, theme = T, onThemeChange }) {
  const [activeNav, setActiveNav] = useState("home");
  const [serviceId, setServiceId] = useState(null);
  const [successOrder, setSuccessOrder] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const svc = SERVICES.find(s=>s.id===serviceId);

  const navigate = (dest, id=null) => {
    setSuccessOrder(null);
    if (dest==="service") { setServiceId(id); setActiveNav("service"); }
    else { setServiceId(null); setActiveNav(dest); }
  };

  const handleOrder = (orderData) => {
    const newOrder = onPlaceOrder(orderData);
    setSuccessOrder(newOrder);
    setActiveNav("success");
  };

  const handleTrack = (order) => { setTrackingOrder(order); setActiveNav("tracking"); };

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column"}}>
      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:84}}>
        {activeNav==="home"    && <HomeTab user={user} onNavigate={navigate}/>}
        {activeNav==="orders"  && <OrdersTab orders={orders} onTrack={handleTrack}/>}
        {activeNav==="profile" && <ProfileTab user={user} onSignOut={onSignOut} showToast={showToast}/>}
        {activeNav==="tracking" && trackingOrder && <TrackingPage order={trackingOrder} onBack={()=>navigate("orders")}/>}

        {activeNav==="success" && successOrder && (
          <OrderSuccess order={successOrder} onBack={()=>navigate("home")} />
        )}

        {activeNav==="service" && svc && (
          <div style={{minHeight:"100vh",background:T.bg}}>
            {/* SERVICE HEADER */}
            <div style={{padding:"20px 20px 0",display:"flex",alignItems:"center",gap:14,marginBottom:20,position:"sticky",top:0,background:T.bg,zIndex:10,borderBottom:`1px solid ${T.border}`,paddingBottom:16}}>
              <button onClick={()=>navigate("home")} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.text,fontSize:18,flexShrink:0}}>←</button>
              <div style={{width:44,height:44,borderRadius:14,background:svc.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{svc.emoji}</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="syne" style={{fontSize:18,fontWeight:700}}>{svc.label}</div>
                <div style={{fontSize:12,color:T.muted}}>{svc.desc}</div>
              </div>
            </div>
            <div style={{padding:"0 20px 60px"}}>
              {serviceId==="gas"       && <GasPage      user={user} onOrder={handleOrder} showToast={showToast}/>}
              {serviceId==="laundry"   && <LaundryPage  user={user} onOrder={handleOrder} showToast={showToast}/>}
              {serviceId==="moving"    && <MovingPage   user={user} onOrder={handleOrder} showToast={showToast}/>}
              {serviceId==="groceries" && <GroceriesPage user={user} onOrder={handleOrder} showToast={showToast}/>}
              {serviceId==="pharmacy"  && <PharmacyPage user={user} onOrder={handleOrder} showToast={showToast}/>}
              {serviceId==="delivery"  && <DeliveryPage user={user} onOrder={handleOrder} showToast={showToast}/>}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAV — hide on service/success/tracking screens */}
      {!["service","success","tracking"].includes(activeNav) && (
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:T.surface,borderTop:`1px solid ${T.border}`,padding:"6px 0",display:"flex",justifyContent:"space-around",zIndex:100}}>
          {[{id:"home",emoji:"🏠",label:"Home"},{id:"orders",emoji:"📋",label:"Orders"},{id:"profile",emoji:"👤",label:"Profile"}].map(n=>(
            <button key={n.id} className={`nav-btn${activeNav===n.id?" on":""}`} onClick={()=>navigate(n.id)}>
              <span style={{fontSize:22}}>{n.emoji}</span>{n.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── AUTH SCREENS ─────────────────────────────────────────────────────────────
function AuthWrap({ title, subtitle, children, onBack, theme = T }) {
  return (
    <div style={{minHeight:"100vh",background:theme.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 16px",position:"relative"}}>
      <div style={{position:"absolute",top:-80,right:-80,width:350,height:350,background:`radial-gradient(circle,${theme.accent}18 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{width:"100%",maxWidth:420}}>
        <div className="syne" style={{fontSize:24,fontWeight:800,color:theme.text,marginBottom:28,textAlign:"center"}}>Grubb<span style={{color:theme.accent}}>Move</span></div>
        <div className="card" style={{padding:"28px 24px",background:theme.card,border:`1px solid ${theme.border}`}}>
          <h2 className="syne" style={{fontSize:22,fontWeight:700,marginBottom:5,color:theme.text}}>{title}</h2>
          <p style={{color:theme.muted,fontSize:14,marginBottom:24}}>{subtitle}</p>
          {children}
        </div>
        {onBack&&<div style={{textAlign:"center",marginTop:18}}><span style={{fontSize:13,color:theme.dim,cursor:"pointer"}} onClick={onBack}>← Back</span></div>}
      </div>
    </div>
  );
}

function SignInScreen({ onSignIn, onGoSignUp, onBack, showToast, theme = T }) {
  const [f, setF] = useState({ email:"", password:"" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const go = () => {
    if (!f.email||!f.password) { showToast("Please fill all fields"); return; }
    setLoading(true);
    setTimeout(() => { onSignIn({ name:"Student", email:f.email, hostel:"Legon Hall", room:"A12", phone:"", year:"Level 300", program:"" }); setLoading(false); }, 1000);
  };
  return (
    <AuthWrap title="Welcome back" subtitle="Sign in to your GruBBmove account" onBack={onBack} theme={theme}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <FInput label="Email address" type="email" placeholder="you@university.edu.gh" value={f.email} onChange={v=>setF({...f,email:v})} theme={theme}/>
        <div>
          <FLabel theme={theme}>Password</FLabel>
          <div style={{position:"relative"}}>
            <input className="inp" type={showPw?"text":"password"} placeholder="Enter password" value={f.password} onChange={e=>setF({...f,password:e.target.value})} style={{paddingRight:46,background:theme.card,borderColor:theme.border,color:theme.text}}/>
            <button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:theme.muted,fontSize:18}}>{showPw?"🙈":"👁️"}</button>
          </div>
        </div>
        <div style={{textAlign:"right"}}><span style={{fontSize:13,color:theme.accent,cursor:"pointer"}}>Forgot password?</span></div>
        <button className="btn btn-p btn-lg btn-full" onClick={go}>{loading?"Signing in...":"Sign In"}</button>
        <div style={{textAlign:"center",fontSize:14,color:theme.muted}}>No account? <span style={{color:theme.accent,cursor:"pointer",fontWeight:600}} onClick={onGoSignUp}>Sign up free</span></div>
      </div>
    </AuthWrap>
  );
}

function SignUpScreen({ onSignUp, onGoSignIn, onBack, showToast, theme = T }) {
  const [f, setF] = useState({ name:"", email:"", phone:"", password:"", confirm:"" });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const go = () => {
    if (!f.name||!f.email||!f.phone||!f.password) { showToast("Please fill all fields"); return; }
    if (f.password.length<6) { showToast("Password must be at least 6 characters"); return; }
    if (f.password!==f.confirm) { showToast("Passwords don't match"); return; }
    if (!agree) { showToast("Please accept terms to continue"); return; }
    setLoading(true);
    setTimeout(() => { onSignUp({ name:f.name, email:f.email, phone:f.phone, hostel:"", room:"" }); setLoading(false); }, 1000);
  };
  return (
    <AuthWrap title="Create account" subtitle="Join thousands of students on GruBBmove" onBack={onBack} theme={theme}>
      <div style={{display:"flex",flexDirection:"column",gap:13}}>
        <FInput label="Full name" placeholder="e.g. Kwame Mensah" required value={f.name} onChange={v=>setF({...f,name:v})} theme={theme}/>
        <FInput label="Email address" type="email" required placeholder="you@university.edu.gh" value={f.email} onChange={v=>setF({...f,email:v})} theme={theme}/>
        <FInput label="Phone number" type="tel" required placeholder="024 XXX XXXX" value={f.phone} onChange={v=>setF({...f,phone:v})} theme={theme}/>
        <FInput label="Password" type="password" required placeholder="Min. 6 characters" value={f.password} onChange={v=>setF({...f,password:v})} theme={theme}/>
        <FInput label="Confirm password" type="password" required placeholder="Re-enter password" value={f.confirm} onChange={v=>setF({...f,confirm:v})} theme={theme}/>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",marginTop:4}} onClick={()=>setAgree(!agree)}>
          <div style={{width:22,height:22,borderRadius:7,border:`2px solid ${agree?theme.accent:theme.border}`,background:agree?theme.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>
            {agree&&<span style={{color:"#fff",fontSize:13}}>✓</span>}
          </div>
          <span style={{fontSize:13,color:theme.muted}}>I agree to GruBBmove's <span style={{color:theme.accent}}>Terms & Privacy Policy</span></span>
        </div>
        <button className="btn btn-p btn-lg btn-full" onClick={go}>{loading?"Creating account...":"Create Account"}</button>
        <div style={{textAlign:"center",fontSize:14,color:theme.muted}}>Have an account? <span style={{color:theme.accent,cursor:"pointer",fontWeight:600}} onClick={onGoSignIn}>Sign in</span></div>
      </div>
    </AuthWrap>
  );
}

function ProfileSetupScreen({ user, onComplete, showToast, theme = T }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState({ hostel:"", room:"", year:"", program:"" });
  const next = () => {
    if (step===1&&(!f.hostel||!f.room)) { showToast("Please fill hostel & room"); return; }
    if (step===2) { onComplete({...user,...f}); return; }
    setStep(2);
  };
  return (
    <AuthWrap title={step===1?"Where do you stay?":"About you"} subtitle={step===1?"We need this to deliver right to your door":"Just a couple more details"} theme={theme}>
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",gap:6,marginBottom:8}}>
          {[1,2].map(n=><div key={n} style={{flex:1,height:4,borderRadius:4,background:n<=step?theme.accent:theme.border,transition:"background .3s"}}/>)}
        </div>
        <div style={{fontSize:12,color:theme.muted}}>Step {step} of 2</div>
      </div>
      {step===1&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <FSelect label="Your hostel" required value={f.hostel} onChange={v=>setF({...f,hostel:v})} options={HOSTELS} theme={theme}/>
          <FInput label="Room number" required placeholder="e.g. B-204, Block C Room 12" value={f.room} onChange={v=>setF({...f,room:v})} theme={theme}/>
        </div>
      )}
      {step===2&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <FSelect label="Year of study" value={f.year} onChange={v=>setF({...f,year:v})} options={["Level 100","Level 200","Level 300","Level 400","Postgraduate"]} theme={theme}/>
          <FInput label="Programme / Faculty (optional)" placeholder="e.g. Computer Science" value={f.program} onChange={v=>setF({...f,program:v})} theme={theme}/>
        </div>
      )}
      <button className="btn btn-p btn-lg btn-full" style={{marginTop:20}} onClick={next}>{step===2?"Complete Setup 🚀":"Continue →"}</button>
      {step===2&&<button className="btn btn-g btn-md btn-full" style={{marginTop:10,borderColor:theme.border,color:theme.text}} onClick={()=>onComplete({...user,...f})}>Skip for now</button>}
    </AuthWrap>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onSignIn, onSignUp, theme = T, onThemeChange }) {
  return (
    <div style={{minHeight:"100vh",background:theme.bg,overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",top:-100,right:-100,width:450,height:450,background:`radial-gradient(circle,${theme.accent}18 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-80,left:-80,width:350,height:350,background:`radial-gradient(circle,${theme.blue}12 0%,transparent 70%)`,pointerEvents:"none"}}/>

      {/* NAVBAR */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 24px",position:"relative",zIndex:10}}>
        <div className="syne" style={{fontSize:22,fontWeight:800,color:theme.text}}>Grubb<span style={{color:theme.accent}}>Move</span></div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={()=>onThemeChange(!theme.bg.includes("0A0A"))} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:12,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16}}>{theme.bg.includes("0A0A")?"☀️":"🌙"}</button>
          <button className="btn btn-g btn-sm" onClick={onSignIn} style={{width:"auto",borderColor:theme.border,color:theme.text}}>Sign In</button>
          <button className="btn btn-p btn-sm" onClick={onSignUp} style={{width:"auto"}}>Get Started</button>
        </div>
      </div>

      {/* HERO */}
      <div style={{textAlign:"center",padding:"40px 24px 32px",position:"relative",zIndex:10}}>
        <div className="badge" style={{background:`${theme.green}22`,color:theme.green,marginBottom:18,display:"inline-flex"}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:theme.green,animation:"pulse 1.5s infinite"}}/>
          Live across campus
        </div>
        <h1 className="syne" style={{fontSize:"clamp(30px,7vw,56px)",fontWeight:800,lineHeight:1.1,marginBottom:20,color:theme.text}}>
          Everything delivered.<br/><span style={{color:theme.accent}}>Right to your door.</span>
        </h1>
        <p style={{fontSize:16,color:theme.muted,maxWidth:420,margin:"0 auto 32px",lineHeight:1.7}}>
          Gas refills, laundry, groceries, pharmacy & more. GruBBmove is the campus logistics platform built for students.
        </p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button className="btn btn-p btn-lg" onClick={onSignUp} style={{width:"auto"}}>Start Using GruBBmove</button>
          <button className="btn btn-g btn-lg" onClick={onSignIn} style={{width:"auto",borderColor:theme.border,color:theme.text}}>Sign In</button>
        </div>
      </div>

      {/* SERVICES PREVIEW */}
      <div style={{padding:"0 20px 32px",maxWidth:480,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {SERVICES.map((s,i)=>(
            <div key={s.id} className="card" style={{padding:14,textAlign:"center",animation:`fadeUp .5s ease ${i*.08}s both`,background:theme.card,border:`1px solid ${theme.border}`}}>
              <div style={{fontSize:26,marginBottom:6}}>{s.emoji}</div>
              <div style={{fontSize:11,fontWeight:700,color:theme.text}}>{s.label}</div>
              <div style={{fontSize:10,color:theme.muted,marginTop:3}}>{s.desc.split(" ").slice(0,3).join(" ")}...</div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",borderTop:`1px solid ${theme.border}`,borderBottom:`1px solid ${theme.border}`,marginBottom:48}}>
        {[["500+","Students"],["6","Services"],["< 45min","Avg Delivery"]].map(([v,l])=>(
          <div key={l} style={{padding:"20px 12px",textAlign:"center",borderRight:`1px solid ${theme.border}`}}>
            <div className="syne" style={{fontSize:24,fontWeight:800,color:theme.accent}}>{v}</div>
            <div style={{fontSize:12,color:theme.muted,marginTop:3}}>{l}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{padding:"0 20px 60px",textAlign:"center"}}>
        <div className="card" style={{padding:"28px 24px",maxWidth:420,margin:"0 auto",background:theme.card,border:`1px solid ${theme.border}`}}>
          <h2 className="syne" style={{fontSize:22,fontWeight:700,marginBottom:10,color:theme.text}}>Ready to simplify campus life?</h2>
          <p style={{color:theme.muted,marginBottom:20,fontSize:14}}>Join hundreds of students who already trust GruBBmove.</p>
          <button className="btn btn-p btn-lg btn-full" onClick={onSignUp}>Create Free Account</button>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
// ROLE SELECTOR SCREEN
function RoleSelector({ user, onSelectRole, onBack, showToast }) {
  return (
    <AuthWrap title="Choose your role" subtitle="Are you a student looking for delivery, or a rider offering services?" onBack={onBack}>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div onClick={()=>onSelectRole("student")} className="card hoverable" style={{padding:24,cursor:"pointer",border:`2px solid ${T.border}`,transition:"all .2s",textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:12}}>👤</div>
          <div className="syne" style={{fontSize:18,fontWeight:700,marginBottom:6}}>Student</div>
          <div style={{fontSize:13,color:T.muted,marginBottom:10}}>Order services & track deliveries</div>
          <div style={{fontSize:12,color:T.accent,fontWeight:600}}>Start ordering →</div>
        </div>
        <div onClick={()=>onSelectRole("rider")} className="card hoverable" style={{padding:24,cursor:"pointer",border:`2px solid ${T.border}`,transition:"all .2s",textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:12}}>🚴</div>
          <div className="syne" style={{fontSize:18,fontWeight:700,marginBottom:6}}>Rider</div>
          <div style={{fontSize:13,color:T.muted,marginBottom:10}}>Offer delivery services & earn</div>
          <div style={{fontSize:12,color:T.accent,fontWeight:600}}>Start earning →</div>
        </div>
      </div>
    </AuthWrap>
  );
}

// RIDER DASHBOARD
function RiderDashboard({ user, orders, onSignOut, showToast, theme, onThemeChange }) {
  const [activeNav, setActiveNav] = useState("home");
  const [trackingOrder, setTrackingOrder] = useState(null);

  const handleTrack = (order) => { setTrackingOrder(order); setActiveNav("tracking"); };

  return (
    <div style={{minHeight:"100vh",background:theme.bg,display:"flex",flexDirection:"column"}}>
      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:84}}>
        {activeNav==="home" && (
          <div style={{padding:"24px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <div>
                <div className="syne" style={{fontSize:22,fontWeight:800}}>🚴 Rider</div>
                <div style={{fontSize:13,color:theme.muted,marginTop:4}}>{user?.name}</div>
              </div>
              <button onClick={()=>onThemeChange(!theme.bg.includes("0A0A"))} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:12,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18}}>{theme.bg.includes("0A0A")?"☀️":"🌙"}</button>
            </div>

            <div className="card" style={{padding:20,marginBottom:20}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div style={{background:theme.accent+"22",borderRadius:14,padding:14,textAlign:"center"}}>
                  <div className="syne" style={{fontSize:24,fontWeight:800,color:theme.accent}}>0</div>
                  <div style={{fontSize:12,color:theme.muted,marginTop:4}}>Active Deliveries</div>
                </div>
                <div style={{background:theme.green+"22",borderRadius:14,padding:14,textAlign:"center"}}>
                  <div className="syne" style={{fontSize:24,fontWeight:800,color:theme.green}}>GHS 0</div>
                  <div style={{fontSize:12,color:theme.muted,marginTop:4}}>Today's Earnings</div>
                </div>
              </div>
            </div>

            <div className="syne" style={{fontSize:14,fontWeight:700,marginBottom:12}}>Available Deliveries</div>
            {orders.length===0 ? (
              <div style={{textAlign:"center",padding:"40px 20px",color:theme.muted}}>
                <div style={{fontSize:40,marginBottom:12}}>📦</div>
                <div style={{fontSize:14}}>No deliveries available</div>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {orders.slice(0,3).map(o=>(
                  <div key={o.id} className="card" style={{padding:14,cursor:"pointer",border:`1px solid ${theme.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                      <div>
                        <div style={{fontWeight:600,fontSize:14}}>{o.label}</div>
                        <div style={{fontSize:12,color:theme.muted,marginTop:2}}>{o.hostel} • Room {o.room}</div>
                      </div>
                      <span style={{fontSize:12,background:theme.accent+"33",color:theme.accent,padding:"4px 10px",borderRadius:20}}>GHS {o.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeNav==="track" && trackingOrder && (
          <TrackingPage order={trackingOrder} onBack={()=>setActiveNav("home")} theme={theme} />
        )}

        {activeNav==="profile" && (
          <div style={{padding:"24px 20px"}}>
            <div className="syne" style={{fontSize:22,fontWeight:800,marginBottom:20}}>My Profile</div>
            <div style={{textAlign:"center",marginBottom:28}}>
              <div style={{width:80,height:80,borderRadius:"50%",background:`linear-gradient(135deg,${theme.accent},${theme.accentL})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
                <span className="syne" style={{fontSize:32,fontWeight:800,color:"#fff"}}>{(user?.name||"R")[0]}</span>
              </div>
              <div className="syne" style={{fontSize:18,fontWeight:700}}>{user?.name}</div>
              <div style={{fontSize:14,color:theme.muted,marginTop:4}}>{user?.email}</div>
            </div>
            <button className="btn btn-g btn-lg btn-full" style={{marginBottom:10,color:theme.text,borderColor:theme.border}} onClick={()=>showToast("Edit profile — coming soon!")}>✏️ Edit Profile</button>
            <button onClick={onSignOut} style={{width:"100%",background:"#EF444420",color:"#EF4444",border:"1.5px solid #EF444430",borderRadius:14,padding:"13px",fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:600,cursor:"pointer"}}>🚪 Sign Out</button>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:theme.surface,borderTop:`1px solid ${theme.border}`,padding:"6px 0",display:"flex",justifyContent:"space-around",zIndex:100}}>
        {[{id:"home",emoji:"🏠",label:"Home"},{id:"track",emoji:"📍",label:"Track"},{id:"profile",emoji:"👤",label:"Profile"}].map(n=>(
          <button key={n.id} className={`nav-btn${activeNav===n.id?" on":""}`} onClick={()=>setActiveNav(n.id)} style={{color:activeNav===n.id?theme.accent:theme.muted,background:activeNav===n.id?theme.accentDim:"transparent"}}>
            <span style={{fontSize:22}}>{n.emoji}</span>{n.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// SHARED TRACKING PAGE (works for both student and rider)
function TrackingPage({ order, onBack, theme = T }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setProgress(p => p >= 3 ? 3 : p + 1), 4000);
    return () => clearInterval(id);
  }, []);
  const steps = [
    { label:"Order Received",    sub:"We've got your order",         icon:"✅", done: progress>=0 },
    { label:"Being Prepared",    sub:"Getting your order ready",     icon:"🔄", done: progress>=1 },
    { label:"Rider on the way",  sub:"Our rider has been assigned",  icon:"🚴", done: progress>=2 },
    { label:"Delivered",         sub:"Order delivered to your door", icon:"🎉", done: progress>=3 },
  ];

  return (
    <div style={{padding:"24px 20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
        <button onClick={onBack} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:12,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:theme.text,fontSize:18}}>←</button>
        <div>
          <div className="syne" style={{fontSize:18,fontWeight:700}}>Track Order</div>
          <div style={{fontSize:13,color:theme.muted}}>#{order?.id}</div>
        </div>
      </div>

      {/* MAP PLACEHOLDER */}
      <div style={{background:`linear-gradient(135deg,${theme.surface},${theme.card})`,border:`1px solid ${theme.border}`,borderRadius:20,height:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginBottom:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:20,left:20,background:theme.accent,borderRadius:8,padding:"4px 12px",fontSize:12,fontWeight:700,color:"#fff"}}>LIVE</div>
        <div style={{fontSize:40,marginBottom:8}}>🗺️</div>
        <div style={{fontSize:14,fontWeight:600}}>Live Map Tracking</div>
        <div style={{fontSize:12,color:theme.muted,marginTop:4}}>Real-time tracking</div>
      </div>

      {/* PROGRESS STEPS */}
      <div className="card" style={{padding:20,marginBottom:16,background:theme.card,border:`1px solid ${theme.border}`}}>
        <div className="syne" style={{fontSize:14,fontWeight:700,marginBottom:18}}>Delivery Progress</div>
        {steps.map((step,i)=>(
          <div key={i}>
            <div style={{display:"flex",gap:14}}>
              <div>
                <div style={{width:32,height:32,borderRadius:"50%",background:step.done?theme.accentDim:theme.surface,border:`2px solid ${step.done?theme.accent:theme.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,transition:"all .5s"}}>{step.done?step.icon:"○"}</div>
              </div>
              <div style={{paddingTop:4}}>
                <div style={{fontWeight:600,fontSize:14,color:step.done?theme.text:theme.muted}}>{step.label}</div>
                <div style={{fontSize:12,color:theme.muted,marginTop:2}}>{step.sub}</div>
              </div>
            </div>
            {i<steps.length-1 && <div style={{width:2,height:24,background:steps[i+1].done?theme.accent:theme.border,marginLeft:15,marginBottom:4,marginTop:4,transition:"background .5s"}}/>}
          </div>
        ))}
      </div>

      {order?.scheduledDate && <CountdownDisplay targetDate={order.scheduledDate+"T"+(order.scheduledTime||"08:00")} label="Scheduled in" theme={theme} />}
    </div>
  );
}

// UPDATE COUNTDOWN DISPLAY TO ACCEPT THEME
function CountdownDisplayThemed({ targetDate, label = "Scheduled in", theme = T }) {
  const delta = useCountdown(targetDate);
  if (!delta) return null;
  const isDone = delta.d===0&&delta.h===0&&delta.m===0&&delta.s===0;
  return (
    <div style={{background:theme.accentDim,border:`1px solid ${theme.accent}44`,borderRadius:16,padding:16,marginTop:8}}>
      <div style={{fontSize:12,fontWeight:600,color:theme.accent,marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
        ⏱ {isDone?"Ready for pickup!":label}
      </div>
      {isDone ? (
        <div className="syne" style={{fontSize:18,fontWeight:800,color:theme.green,textAlign:"center"}}>🚀 Ready Now!</div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[["d","Days"],["h","Hours"],["m","Mins"],["s","Secs"]].map(([k,lbl])=>(
            <div key={k} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:16,padding:18,textAlign:"center"}}>
              <div className="syne" style={{fontSize:28,fontWeight:800,color:theme.accent,lineHeight:1}}>{pad(delta[k])}</div>
              <div style={{fontSize:11,color:theme.muted,fontWeight:600,letterSpacing:".5px",textTransform:"uppercase",marginTop:4}}>{lbl}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = getTheme(isDarkMode);

  const showToast = (msg, type="error") => {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(null), 3200);
  };

  const handlePlaceOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: uid(),
      status: "pending",
      time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
    };
    setOrders(prev => [newOrder, ...prev]);
    showToast("Order placed! 🎉","success");
    return newOrder;
  };

  const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${theme.bg}; color: ${theme.text}; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 4px; }
  .syne { font-family: 'Syne', sans-serif; }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
  @keyframes pulse    { 0%,100% { opacity:1 } 50% { opacity:.4 } }
  @keyframes spin     { to { transform:rotate(360deg) } }
  @keyframes slideUp  { from { transform:translateY(100%); opacity:0 } to { transform:translateY(0); opacity:1 } }
  @keyframes countdown-tick { 0% { transform:scale(1.12); color:#FF6B2B } 100% { transform:scale(1); color:inherit } }
  .fu  { animation: fadeUp  .45s ease both; }
  .fi  { animation: fadeIn  .35s ease both; }
  .su  { animation: slideUp .4s  ease both; }
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; font-family:'DM Sans',sans-serif; font-weight:600; border:none; cursor:pointer; transition:all .2s; border-radius:14px; letter-spacing:.2px; }
  .btn-p  { background:linear-gradient(135deg,${theme.accent},${theme.accentL}); color:#fff; }
  .btn-p:hover  { transform:translateY(-2px); box-shadow:0 8px 28px ${theme.accent}55; }
  .btn-p:active { transform:translateY(0); }
  .btn-g  { background:transparent; color:${theme.text}; border:1.5px solid ${theme.border}; }
  .btn-g:hover  { border-color:${theme.accent}; color:${theme.accent}; }
  .btn-sm { padding:10px 20px; font-size:13px; border-radius:11px; }
  .btn-md { padding:13px 26px; font-size:14px; }
  .btn-lg { padding:15px 32px; font-size:15px; }
  .btn-full { width:100%; }
  .inp { width:100%; background:${theme.card}; border:1.5px solid ${theme.border}; border-radius:12px; padding:13px 15px; color:${theme.text}; font-family:'DM Sans',sans-serif; font-size:14px; outline:none; transition:border .2s; }
  .inp:focus { border-color:${theme.accent}; }
  .inp::placeholder { color:${theme.dim}; }
  select.inp { cursor:pointer; appearance:none; }
  .card { background:${theme.card}; border:1px solid ${theme.border}; border-radius:20px; }
  .card-sm { border-radius:14px; }
  .hoverable:hover { border-color:${theme.accent}44; transform:translateY(-2px); box-shadow:0 4px 20px #00000033; }
  .pay-opt { border:1.5px solid ${theme.border}; border-radius:14px; padding:15px; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:14px; }
  .pay-opt.sel { border-color:${theme.accent}; background:${theme.accentDim}; }
  .pay-opt:hover:not(.sel) { border-color:${theme.accent}66; }
  .toggle-opt { border:2px solid ${theme.border}; border-radius:14px; padding:13px; cursor:pointer; transition:all .2s; }
  .toggle-opt:hover:not(.tog-active) { border-color:${theme.muted}; }
  .nav-btn { display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; padding:7px 18px; border-radius:12px; transition:all .2s; color:${theme.muted}; font-size:11px; font-weight:500; background:none; border:none; font-family:'DM Sans',sans-serif; }
  .nav-btn.on { color:${theme.accent}; background:${theme.accentDim}; }
  .nav-btn:hover:not(.on) { color:${theme.text}; }
  .toast { position:fixed; bottom:96px; left:50%; transform:translateX(-50%); padding:11px 22px; border-radius:12px; font-weight:600; font-size:13px; z-index:9999; white-space:nowrap; animation:fadeUp .3s ease; pointer-events:none; }
  .badge { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:.3px; }
  .sec-div { font-family:'Syne',sans-serif; font-size:11px; font-weight:700; color:${theme.muted}; letter-spacing:1px; text-transform:uppercase; border-top:1px solid ${theme.border}; padding-top:14px; margin-top:4px; }
  .countdown-box { background:${theme.card}; border:1px solid ${theme.border}; border-radius:16px; padding:18px; text-align:center; }
  .countdown-num { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; color:${theme.accent}; line-height:1; }
  .countdown-lbl { font-size:11px; color:${theme.muted}; font-weight:600; letter-spacing:.5px; text-transform:uppercase; margin-top:4px; }
  .tick { animation: countdown-tick .5s ease; }
  .cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; }
  .cal-day { aspect-ratio:1; display:flex; align-items:center; justify-content:center; border-radius:10px; font-size:13px; cursor:pointer; transition:all .15s; }
  .cal-day:hover:not(.cal-empty):not(.cal-past) { background:${theme.accentDim}; color:${theme.accent}; }
  .cal-day.cal-sel { background:${theme.accent}; color:#fff; font-weight:700; }
  .cal-day.cal-today { border:2px solid ${theme.accent}; color:${theme.accent}; font-weight:700; }
  .cal-day.cal-past { opacity:.3; cursor:not-allowed; }
  .cal-day.cal-empty { cursor:default; }
  .timeline-step { display:flex; gap:14px; }
  .tl-dot { width:12px; height:12px; border-radius:50%; flex-shrink:0; margin-top:4px; }
  .tl-line { width:2px; background:${theme.border}; flex:1; min-height:30px; margin:4px 0 4px 5px; }
  .order-card { background:${theme.card}; border:1px solid ${theme.border}; border-radius:18px; padding:18px; transition:all .2s; }
  .order-card:hover { border-color:${theme.accent}33; }
  .scroll-x { display:flex; gap:10px; overflow-x:auto; padding-bottom:4px; scrollbar-width:none; }
  .scroll-x::-webkit-scrollbar { display:none; }
  .chip { display:inline-flex; align-items:center; padding:7px 14px; border-radius:20px; border:1.5px solid; font-size:13px; font-weight:500; cursor:pointer; transition:all .2s; white-space:nowrap; flex-shrink:0; }
  `;

  return (
    <div style={{background:theme.bg,minHeight:"100vh"}}>
      <style>{css}</style>
      {toast && (
        <div className="toast" style={{background:toastType==="success"?theme.green:"#EF4444"}}>
          {toast}
        </div>
      )}
      <div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",position:"relative",background:theme.bg}}>
        {screen==="landing"       && <LandingPage onSignIn={()=>setScreen("signin")} onSignUp={()=>setScreen("signup")} theme={theme} onThemeChange={setIsDarkMode}/>}
        {screen==="signin"        && <SignInScreen onSignIn={u=>{setUser(u);setScreen("role-select");}} onGoSignUp={()=>setScreen("signup")} onBack={()=>setScreen("landing")} showToast={showToast} theme={theme}/>}
        {screen==="signup"        && <SignUpScreen onSignUp={u=>{setUser(u);setScreen("profile-setup");}} onGoSignIn={()=>setScreen("signin")} onBack={()=>setScreen("landing")} showToast={showToast} theme={theme}/>}
        {screen==="role-select"   && <RoleSelector user={user} onSelectRole={r=>{setRole(r);setScreen("profile-setup");}} onBack={()=>setScreen("signin")} showToast={showToast}/>}
        {screen==="profile-setup" && <ProfileSetupScreen user={user} onComplete={u=>{setUser(u);showToast("Welcome to GruBBmove! 🚀","success");setScreen(role==="student"?"dashboard":"rider-dashboard");}} showToast={showToast} theme={theme}/>}
        {screen==="dashboard"     && <Dashboard user={user} orders={orders} onPlaceOrder={handlePlaceOrder} onSignOut={()=>{setUser(null);setRole(null);setScreen("landing");}} showToast={showToast} theme={theme} onThemeChange={setIsDarkMode}/>}
        {screen==="rider-dashboard" && role==="rider" && <RiderDashboard user={user} orders={orders} onSignOut={()=>{setUser(null);setRole(null);setScreen("landing");}} showToast={showToast} theme={theme} onThemeChange={setIsDarkMode}/>}
      </div>
    </div>
  );
}
