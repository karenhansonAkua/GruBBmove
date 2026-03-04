import { pad } from "../utils/helpers";
import { T } from "../theme";

export default function TimePicker({ value, onChange }) {
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
