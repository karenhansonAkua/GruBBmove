import { useState } from "react";
import { T } from "../theme";

export default function MiniCalendar({ value, onChange }) {
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
          if(!d) return <div key={i} className="cal-day cal-empty" />;
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
