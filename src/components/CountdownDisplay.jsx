import { pad, useCountdown } from "../utils/helpers";
import { T } from "../theme";

export default function CountdownDisplay({ targetDate, label = "Scheduled in" }) {
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
