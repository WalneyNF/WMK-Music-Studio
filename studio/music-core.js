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
g.WMKMusic={validate,midi};
})(globalThis);
