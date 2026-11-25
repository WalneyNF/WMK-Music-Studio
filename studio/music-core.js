/* WMK Music Core — MIT */
(function(g){
"use strict";
const integer=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
function validate(p){
 if(!p||!Number.isFinite(p.bpm)||p.bpm<30||p.bpm>300||!Array.isArray(p.faixas)||p.faixas.length<1||p.faixas.length>16)throw Error("Projeto inválido");
 for(const f of p.faixas){if(!integer(f.programa??0,0,127)||!integer(f.canal??0,0,15)||!Array.isArray(f.notas)||f.notas.length>10000)throw Error("Faixa inválida");
 for(const n of f.notas)if(!integer(n.midi,0,127)||!integer(n.velocity??90,1,127)||!Number.isFinite(n.inicio)||n.inicio<0||n.inicio>100000||!Number.isFinite(n.duracao)||n.duracao<=0||n.duracao>10000)throw Error("Nota inválida");}return p;
}
const be=(n,k)=>Array.from({length:k},(_,i)=>(n>>>((k-i-1)*8))&255);
function vlq(n){const a=[n&127];while(n>>>=7)a.unshift((n&127)|128);return a}
function chunk(id,b){return [...Array.from(id,c=>c.charCodeAt(0)),...be(b.length,4),...b]}
function midi(p){validate(p);const tempo=Math.round(60000000/p.bpm),tracks=[chunk("MTrk",[0,255,81,3,...be(tempo,3),0,255,47,0])];
for(const f of p.faixas){const ch=f.canal??0,ev=[];for(const n of f.notas){const a=Math.round(n.inicio*480),b=Math.max(a+1,Math.round((n.inicio+n.duracao)*480));ev.push([a,1,[144|ch,n.midi,n.velocity??90]],[b,0,[128|ch,n.midi,0]])}ev.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);let last=0,bytes=[0,192|ch,f.programa??0];for(const [t,_,data] of ev){bytes.push(...vlq(t-last),...data);last=t}bytes.push(0,255,47,0);tracks.push(chunk("MTrk",bytes))}
return Uint8Array.from([...chunk("MThd",[0,1,...be(tracks.length,2),1,224]),...tracks.flat()]);}
function readMidi(input){
const b=new Uint8Array(input),v=new DataView(b.buffer,b.byteOffset,b.byteLength);let i=0,end=b.length;function byte(){if(i>=end)throw Error("MIDI truncado");return b[i++]}function num(k){let n=0;while(k--)n=n*256+byte();return n}function tag(){return String.fromCharCode(byte(),byte(),byte(),byte())}function delta(){let n=0;for(let k=0;k<4;k++){let x=byte();n=n*128+(x&127);if(x<128)return n}throw Error("VLQ inválido")}
if(tag()!=="MThd")throw Error("Não é MIDI");let len=num(4);if(len<6||8+len>b.length)throw Error("Cabeçalho inválido");let format=num(2),count=num(2),ppq=num(2);if(format>1||!ppq||ppq>=32768||count>256||!count)throw Error("Formato MIDI não suportado");i=8+len;let bpm=120,tempoTick=Infinity,faixas=[];
for(let t=0;t<count;t++){end=b.length;if(tag()!=="MTrk")throw Error("Faixa inválida");let size=num(4);end=i+size;if(end>b.length)throw Error("Faixa truncada");let tick=0,run=0,active=new Map(),channels=new Map();function channel(c){if(!channels.has(c))channels.set(c,{canal:c,programa:0,notas:[]});return channels.get(c)}
while(i<end){tick+=delta();let s=byte();if(s<128){if(!run)throw Error("Status MIDI inválido");i--;s=run}if(s===255){let type=byte(),n=delta();if(i+n>end)throw Error("Meta inválida");if(type===81&&n===3&&tick<tempoTick){let us=b[i]*65536+b[i+1]*256+b[i+2];if(us){bpm=60000000/us;tempoTick=tick}}i+=n;continue}if(s===240||s===247){let n=delta();i+=n;if(i>end)throw Error("SysEx inválido");run=0;continue}if(s>=240)throw Error("Evento não suportado");run=s;let k=s>>4,c=s&15,a=byte(),d=k===12||k===13?0:byte();if(a>127||d>127)throw Error("Dados MIDI inválidos");if(k===12)channel(c).programa=a;if(k===9&&d){let key=c*128+a,q=active.get(key)||[];q.push([tick,d]);active.set(key,q)}else if(k===8||k===9){let q=active.get(c*128+a);if(q&&q.length){let [start,velocity]=q.shift();channel(c).notas.push({midi:a,inicio:start/ppq,duracao:Math.max(1,tick-start)/ppq,velocity})}}}
faixas.push(...[...channels.values()].filter(f=>f.notas.length));i=end}
return validate({versao:"1.0",titulo:"MIDI importado",bpm,faixas});}
g.WMKMusic={validate,midi,readMidi};
})(globalThis);
