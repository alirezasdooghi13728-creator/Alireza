const DB_NAME='virtual-school-local',DB_VERSION=1;
function open(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,DB_VERSION);r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains('outbox'))d.createObjectStore('outbox',{keyPath:'id'});if(!d.objectStoreNames.contains('cache'))d.createObjectStore('cache',{keyPath:'key'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function store(name,mode,action){const d=await open();return new Promise((resolve,reject)=>{const t=d.transaction(name,mode),s=t.objectStore(name),v=action(s);if(v?.onsuccess!==undefined){v.onsuccess=()=>resolve(v.result);v.onerror=()=>reject(v.error)}else{t.oncomplete=()=>resolve(v)}t.onerror=()=>reject(t.error)})}
export const putOutbox=item=>store('outbox','readwrite',s=>s.put(item));
export const allOutbox=()=>store('outbox','readonly',s=>s.getAll());
export const clearOutbox=ids=>store('outbox','readwrite',s=>{ids.forEach(x=>s.delete(x));return null});
export async function clearLocal(){const d=await open();for(const n of ['outbox','cache'])await new Promise((res,rej)=>{const t=d.transaction(n,'readwrite');t.objectStore(n).clear();t.oncomplete=res;t.onerror=()=>rej(t.error)})}
