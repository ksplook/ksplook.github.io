const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{webcrypto}=require('node:crypto'),path=require('node:path');
const storage=new Map();
function boot(file){const source=fs.readFileSync(path.join(__dirname,'..',file),'utf8').match(/<script>([\s\S]*)<\/script>/)[1].replace(/renderShell\(\);renderPage\(\);(?=\r?\n\/\/ When)/,'');
const element={addEventListener(){},classList:{remove(){}}};const ctx=vm.createContext({console,crypto:webcrypto,TextEncoder,TextDecoder,Uint8Array,Uint32Array,DataView,ArrayBuffer,Blob,URL,setTimeout(){},document:{getElementById(){return element},addEventListener(){},querySelector(){return null},createElement(){return {className:'',textContent:'',remove(){}}},body:{appendChild(){}}},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},navigator:{},window:{},confirm:()=>true});vm.runInContext(source,ctx,{timeout:15000});return s=>vm.runInContext(s,ctx,{timeout:15000});}
const main=boot('index.html');main('buildingState={...buildingDefaults(),enabled:true,length:47};persist()');
const cfd=boot('room-cfd/index.html');assert.equal(cfd('buildingState.length'),47);assert.equal(cfd('buildingState.enabled'),true);cfd('buildingState.width=22;persist()');
const again=boot('index.html');assert.equal(again('buildingState.length'),47);assert.equal(again('buildingState.width'),22);assert(again('reportBook().chapters.some(x=>x.id==="building")'));
console.log('PASS public shared project: main → CFD → main retains building inputs and report chapter');
