import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
let ready=true;
const publicKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secretKey=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
const entries={NEXT_PUBLIC_SUPABASE_URL:process.env.NEXT_PUBLIC_SUPABASE_URL,'Supabase publishable/anon key':publicKey,'Supabase secret/service-role key':secretKey};
for(const name of ['NETOPIA_API_KEY','NETOPIA_SIGNATURE','NETOPIA_IPN_PUBLIC_KEY','NETOPIA_VAT_RATE','NETOPIA_SANDBOX','NEXT_PUBLIC_NETOPIA_CONFIRM_URL','NEXT_PUBLIC_NETOPIA_RETURN_URL'])entries[name]=process.env[name];
for(const [name,value] of Object.entries(entries)){console.log(`${value?'OK':'MISSING'} ${name}`);if(!value)ready=false;}
for(const name of ['RESEND_API_KEY','NOTIFICATION_EMAIL','NOTIFICATION_FROM_EMAIL'])console.log(`${process.env[name]?'OK':'OPTIONAL MISSING'} ${name}`);
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
async function check(label,path,key){
 try{
  const response=await fetch(`${url}${path}`,{headers:{apikey:key||''},signal:AbortSignal.timeout(10000)});
  if(!response.ok){let code='';try{const body=await response.json();if(/^[A-Z0-9_]+$/.test(body.code||''))code=` (${body.code})`;}catch{}throw new Error(`HTTP ${response.status}${code}`);}
  console.log(`OK ${label}`);
 }catch(e){ready=false;console.log(`BLOCKED ${label}: ${e.cause?.code||e.message}`);}
}
if(url){
 await check('Supabase public connection','/auth/v1/health',publicKey);
 if(secretKey){
  await check('Supabase server authorization','/auth/v1/admin/users?page=1&per_page=1',secretKey);
  await check('Supabase schema','/rest/v1/blueprints?select=id,workflow_status,admin_revision&limit=0',secretKey);
 }
}
console.log(ready?'Configuration checks passed. Verify migrations and sandbox payment before production.':'Backend activation is blocked by the items above. No secrets were printed.');
process.exitCode=ready?0:1;
