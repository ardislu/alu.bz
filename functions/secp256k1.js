var C=2n**256n,B=C-0x1000003d1n,x=C-0x14551231950b75fc4402da1732fc9bebfn,D=0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n,W=0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n,J={p:B,n:x,a:0n,b:7n,Gx:D,Gy:W},v=32,G=t=>s(s(t*t)*t+J.b),u=(t="")=>{throw new Error(t)},U=t=>typeof t=="bigint",$=t=>typeof t=="string",Y=t=>U(t)&&0n<t&&t<B,K=t=>U(t)&&0n<t&&t<x,_=(t,n)=>!(t instanceof Uint8Array)||typeof n=="number"&&n>0&&t.length!==n?u("Uint8Array expected"):t,N=t=>new Uint8Array(t),R=(t,n)=>_($(t)?E(t):N(t),n),s=(t,n=B)=>{let e=t%n;return e>=0n?e:n+e},M=t=>t instanceof S?t:u("Point expected"),Q,S=class t{constructor(n,e,r){this.px=n,this.py=e,this.pz=r}static fromAffine(n){return new t(n.x,n.y,1n)}static fromHex(n){n=R(n);let e,r=n[0],o=n.subarray(1),i=q(o,0,v),a=n.length;if(a===33&&[2,3].includes(r)){Y(i)||u("Point hex invalid: x not FE");let l=nt(G(i)),y=(l&1n)===1n;(r&1)===1!==y&&(l=s(-l)),e=new t(i,l,1n)}return a===65&&r===4&&(e=new t(i,q(o,v,2*v),1n)),e?e.ok():u("Point is not on curve")}static fromPrivateKey(n){return H.mul(et(n))}get x(){return this.aff().x}get y(){return this.aff().y}equals(n){let{px:e,py:r,pz:o}=this,{px:i,py:a,pz:l}=M(n),y=s(e*l),g=s(i*o),c=s(r*l),d=s(a*o);return y===g&&c===d}negate(){return new t(this.px,s(-this.py),this.pz)}double(){return this.add(this)}add(n){let{px:e,py:r,pz:o}=this,{px:i,py:a,pz:l}=M(n),{a:y,b:g}=J,c=0n,d=0n,f=0n,z=s(g*3n),p=s(e*i),m=s(r*a),b=s(o*l),P=s(e+r),h=s(i+a);P=s(P*h),h=s(p+m),P=s(P-h),h=s(e+o);let w=s(i+l);return h=s(h*w),w=s(p+b),h=s(h-w),w=s(r+o),c=s(a+l),w=s(w*c),c=s(m+b),w=s(w-c),f=s(y*h),c=s(z*b),f=s(c+f),c=s(m-f),f=s(m+f),d=s(c*f),m=s(p+p),m=s(m+p),b=s(y*b),h=s(z*h),m=s(m+b),b=s(p-b),b=s(y*b),h=s(h+b),p=s(m*h),d=s(d+p),p=s(w*h),c=s(P*c),c=s(c-p),p=s(P*m),f=s(w*f),f=s(f+p),new t(c,d,f)}mul(n,e=!0){if(!e&&n===0n)return T;if(K(n)||u("invalid scalar"),this.equals(H))return ut(n).p;let r=T,o=H;for(let i=this;n>0n;i=i.double(),n>>=1n)n&1n?r=r.add(i):e&&(o=o.add(i));return r}mulAddQUns(n,e,r){return this.mul(e,!1).add(n.mul(r,!1)).ok()}toAffine(){let{px:n,py:e,pz:r}=this;if(this.equals(T))return{x:0n,y:0n};if(r===1n)return{x:n,y:e};let o=O(r);return s(r*o)!==1n&&u("invalid inverse"),{x:s(n*o),y:s(e*o)}}assertValidity(){let{x:n,y:e}=this.aff();return(!Y(n)||!Y(e))&&u("Point invalid: x or y"),s(e*e)===G(n)?this:u("Point invalid: not on curve")}multiply(n){return this.mul(n)}aff(){return this.toAffine()}ok(){return this.assertValidity()}toHex(n=!0){let{x:e,y:r}=this.aff();return(n?(r&1n)===0n?"02":"03":"04")+k(e)+(n?"":k(r))}toRawBytes(n=!0){return E(this.toHex(n))}};S.BASE=new S(D,W,1n);S.ZERO=new S(0n,1n,0n);var{BASE:H,ZERO:T}=S,tt=(t,n)=>t.toString(16).padStart(n,"0"),X=t=>Array.from(t).map(n=>tt(n,2)).join(""),E=t=>{let n=t.length;(!$(t)||n%2)&&u("hex invalid 1");let e=N(n/2);for(let r=0;r<e.length;r++){let o=r*2,i=t.slice(o,o+2),a=Number.parseInt(i,16);(Number.isNaN(a)||a<0)&&u("hex invalid 2"),e[r]=a}return e},Z=t=>BigInt("0x"+(X(t)||"0")),q=(t,n,e)=>Z(t.slice(n,e)),I=t=>U(t)&&t>=0n&&t<C?E(tt(t,2*v)):u("bigint expected"),k=t=>X(I(t)),F=(...t)=>{let n=N(t.reduce((r,o)=>r+_(o).length,0)),e=0;return t.forEach(r=>{n.set(r,e),e+=r.length}),n},O=(t,n=B)=>{(t===0n||n<=0n)&&u("no inverse n="+t+" mod="+n);let e=s(t,n),r=n,o=0n,i=1n,a=1n,l=0n;for(;e!==0n;){let y=r/e,g=r%e,c=o-a*y,d=i-l*y;r=e,e=g,o=a,i=l,a=c,l=d}return r===1n?s(o,n):u("no inverse")},nt=t=>{let n=1n;for(let e=t,r=(B+1n)/4n;r>0n;r>>=1n)r&1n&&(n=n*e%B),e=e*e%B;return s(n*n)===t?n:u("sqrt invalid")},et=t=>(U(t)||(t=Z(R(t,v))),K(t)?t:u("private key out of range")),rt=t=>t>x>>1n;var j=class t{constructor(n,e,r){this.r=n,this.s=e,this.recovery=r,this.assertValidity()}static fromCompact(n){return n=R(n,64),new t(q(n,0,v),q(n,v,2*v))}assertValidity(){return K(this.r)&&K(this.s)?this:u()}addRecoveryBit(n){return new t(this.r,this.s,n)}hasHighS(){return rt(this.s)}recoverPublicKey(n){let{r:e,s:r,recovery:o}=this;[0,1,2,3].includes(o)||u("recovery id invalid");let i=ot(R(n,32)),a=o===2||o===3?e+x:e;a>=B&&u("q.x invalid");let l=o&1?"03":"02",y=S.fromHex(l+k(a)),g=O(a,x),c=s(-i*g,x),d=s(r*g,x);return H.mulAddQUns(y,c,d)}toCompactRawBytes(){return E(this.toCompactHex())}toCompactHex(){return k(this.r)+k(this.s)}},st=t=>{let n=t.length*8-256,e=Z(t);return n>0?e>>BigInt(n):e},ot=t=>s(st(t),x);var L=()=>typeof globalThis=="object"&&"crypto"in globalThis?globalThis.crypto:void 0,V;function it(t){t=R(t);let n=v+8;(t.length<n||t.length>1024)&&u("expected proper params");let e=s(Z(t),x-1n)+1n;return I(e)}var ct={hexToBytes:E,bytesToHex:X,concatBytes:F,bytesToNumberBE:Z,numberToBytesBE:I,mod:s,invert:O,hmacSha256Async:async(t,...n)=>{let e=L();if(!e)return u("etc.hmacSha256Async not set");let r=e.subtle,o=await r.importKey("raw",t,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]);return N(await r.sign("HMAC",o,F(...n)))},hmacSha256Sync:V,hashToPrivateKey:it,randomBytes:t=>{let n=L();return n||u("crypto.getRandomValues must be defined"),n.getRandomValues(N(t))}};Object.defineProperties(ct,{hmacSha256Sync:{configurable:!1,get(){return V},set(t){V||(V=t)}}});var A=8,at=()=>{let t=[],n=256/A+1,e=H,r=e;for(let o=0;o<n;o++){r=e,t.push(r);for(let i=1;i<2**(A-1);i++)r=r.add(e),t.push(r);e=r.double()}return t},ut=t=>{let n=Q||(Q=at()),e=(c,d)=>{let f=d.negate();return c?f:d},r=T,o=H,i=1+256/A,a=2**(A-1),l=BigInt(2**A-1),y=2**A,g=BigInt(A);for(let c=0;c<i;c++){let d=c*a,f=Number(t&l);t>>=g,f>a&&(f-=y,t+=1n);let z=d,p=d+Math.abs(f)-1,m=c%2!==0,b=f<0;f===0?o=o.add(e(m,n[z])):r=r.add(e(b,n[p]))}return{p:r,f:o}};export{j as Signature};
/*! Bundled license information:

@noble/secp256k1/index.js:
  (*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) *)
*/