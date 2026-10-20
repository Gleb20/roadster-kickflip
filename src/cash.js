// Cosmetic world-space notes. Simulation owns emission/lifetime; drawing is read-only.
export function createCash({reduced=false,limit=144}={}){return {notes:[],time:0,sequence:0,clock:0,reduced,limit};}
const wave=n=>((Math.imul(n+1,2654435761)>>>8)%1000)/1000;
export function advanceCash(cash,dt,{streams=[],speed=0}={}){
 cash.time+=dt;
 if(!streams.length)for(const p of cash.notes)if(!p.falling){p.falling=true;p.vx*=.18;p.vy=18+wave(p.id)*20;}
 for(const p of cash.notes){
  p.age+=dt;
  if(!p.falling&&p.age>=p.flight){p.falling=true;p.vx*=.18;p.vy=18+wave(p.id)*20;}
  const gravity=p.falling?18:34;p.x+=(p.vx-speed)*dt;p.y+=p.vy*dt+gravity*dt*dt/2;p.vy+=gravity*dt;
 }
 cash.notes=cash.notes.filter(p=>p.age<p.life);
 if(!streams.length){cash.clock=0;return;}
 cash.clock+=dt;const interval=cash.reduced?.4:.12;
 while(cash.clock+1e-9>=interval){
  cash.clock-=interval;
  for(const stream of streams){
   if(cash.notes.length>=cash.limit)cash.notes.shift();
   const id=++cash.sequence,flight=.85+wave(id)*.3,from=stream.from,to=stream.to;
   cash.notes.push({id,x:from.x,y:from.y,vx:(to.x-from.x)/flight+(stream.targetMoves?0:speed),vy:(to.y-from.y)/flight-17*flight,age:0,flight,life:cash.reduced?2.8:4.3+wave(id+37),falling:false,phase:wave(id+91)*Math.PI*2});
  }
 }
}
