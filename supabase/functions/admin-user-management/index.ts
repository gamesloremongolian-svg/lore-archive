import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const allowedOrigins = new Set([
    "https://loreverse-ctrl.github.io",
    "https://gamesloremongolian-svg.github.io",
    "https://lore-archive.pages.dev",
    "https://e-archive.pages.dev",
    "https://localhost",
    "capacitor://localhost",
  ]);
  const headers = new Headers({
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
  });
  if (allowedOrigins.has(origin)) headers.set("Access-Control-Allow-Origin", origin);
  return headers;
}
Deno.serve(async(req:Request)=>{
 const cors=getCorsHeaders(req);
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return new Response(JSON.stringify({error:"Method not allowed"}),{status:405,headers:cors});
 try{
  const url=Deno.env.get("SUPABASE_URL")!,anonKey=Deno.env.get("SUPABASE_ANON_KEY")!,serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const h=req.headers.get("Authorization")||"";if(!h.startsWith("Bearer "))return new Response(JSON.stringify({error:"Нэвтрэх шаардлагатай."}),{status:401,headers:cors});
  const token=h.slice(7),uc=createClient(url,anonKey,{global:{headers:{Authorization:`Bearer ${token}`}}});
  const {data:{user},error:ue}=await uc.auth.getUser(token);if(ue||!user)return new Response(JSON.stringify({error:"Нэвтрэлт хүчингүй."}),{status:401,headers:cors});
  const admin=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:staff,error:se}=await admin.from("staff_members").select("role,active").eq("user_id",user.id).maybeSingle();
  if(se||!staff?.active||!["owner","admin"].includes(staff.role))return new Response(JSON.stringify({error:"Owner/Admin эрх шаардлагатай."}),{status:403,headers:cors});
  const body=await req.json();
  if(body.action==="delete"&&staff.role!=="owner")return new Response(JSON.stringify({error:"Хэрэглэгчийн бүртгэл устгах эрх зөвхөн Owner-д байна."}),{status:403,headers:cors});
  if(body.action==="list"){
   const {data,error}=await admin.auth.admin.listUsers({page:1,perPage:200});if(error)throw error;
   return new Response(JSON.stringify({users:(data.users||[]).map(u=>({id:u.id,email:u.email||"",created_at:u.created_at,last_sign_in_at:u.last_sign_in_at||null,email_confirmed_at:u.email_confirmed_at||null,is_current:u.id===user.id}))}),{headers:cors});
  }
  if(body.action==="delete"){
   const id=String(body.user_id||""),email=String(body.confirm_email||"").trim().toLowerCase();
   if(!id||id===user.id)return new Response(JSON.stringify({error:"Өөрийн админ бүртгэлийг устгах боломжгүй."}),{status:400,headers:cors});
   const {data:t,error:ge}=await admin.auth.admin.getUserById(id);if(ge||!t.user)return new Response(JSON.stringify({error:"Хэрэглэгч олдсонгүй."}),{status:404,headers:cors});
   if(!t.user.email||t.user.email.toLowerCase()!==email)return new Response(JSON.stringify({error:"Баталгаажуулах имэйл таарахгүй."}),{status:400,headers:cors});
   const {data:ts}=await admin.from("staff_members").select("role,active").eq("user_id",id).maybeSingle();
   if(ts?.active)return new Response(JSON.stringify({error:"Идэвхтэй багийн гишүүнийг эхлээд багийн эрхээс гаргана уу."}),{status:409,headers:cors});
   const {error}=await admin.auth.admin.deleteUser(id);if(error)throw error;
   return new Response(JSON.stringify({success:true,message:"Auth бүртгэлийг устгалаа."}),{headers:cors});
  }
  if(body.action==="approve_application"){
   const appId=String(body.application_id||""),role=String(body.role||"editor");
   if(!appId||!["editor","ads_manager"].includes(role))return new Response(JSON.stringify({error:"Хүсэлт эсвэл эрхийн төрөл буруу."}),{status:400,headers:cors});
   const {data:app,error:ae}=await admin.from("staff_applications").select("*").eq("id",appId).single();if(ae||!app)return new Response(JSON.stringify({error:"Хүсэлт олдсонгүй."}),{status:404,headers:cors});
   if(app.status!=="pending")return new Response(JSON.stringify({error:"Энэ хүсэлт аль хэдийн шийдвэрлэгдсэн."}),{status:409,headers:cors});
   const {data:list,error:le}=await admin.auth.admin.listUsers({page:1,perPage:1000});if(le)throw le;
   const target=(list.users||[]).find(u=>(u.email||"").toLowerCase()===String(app.email).toLowerCase());
   if(!target)return new Response(JSON.stringify({error:"Энэ имэйлээр LOREVERSE хэрэглэгч бүртгүүлээгүй байна. Эхлээд бүртгүүлсний дараа дахин зөвшөөрнө үү."}),{status:404,headers:cors});
   const {error:up}=await admin.from("staff_members").upsert({user_id:target.id,role,active:true},{onConflict:"user_id"});if(up)throw up;
   const {error:upd}=await admin.from("staff_applications").update({status:"approved",applicant_user_id:target.id,reviewed_by:user.id,reviewed_at:new Date().toISOString()}).eq("id",appId);if(upd)throw upd;
   return new Response(JSON.stringify({success:true,message:"Хүсэлтийг зөвшөөрч багийн эрх олголоо."}),{headers:cors});
  }
  if(body.action==="reject_application"){
   const appId=String(body.application_id||"");if(!appId)return new Response(JSON.stringify({error:"Хүсэлтийн ID шаардлагатай."}),{status:400,headers:cors});
   const {error}=await admin.from("staff_applications").update({status:"rejected",reviewed_by:user.id,reviewed_at:new Date().toISOString()}).eq("id",appId).eq("status","pending");if(error)throw error;
   return new Response(JSON.stringify({success:true,message:"Хүсэлтийг татгалзлаа."}),{headers:cors});
  }
  return new Response(JSON.stringify({error:"Үл мэдэгдэх үйлдэл."}),{status:400,headers:cors});
 }catch(e){return new Response(JSON.stringify({error:e?.message||"Серверийн алдаа."}),{status:500,headers:cors});}
});