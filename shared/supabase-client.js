/* Public browser client: publishable key only. Never place service_role keys here. */
(function(){
  const url="https://yvbwtdurxesdcorkydby.supabase.co";
  const key="sb_publishable_ya9bJ-RpI_Qpas6icJjvoQ_oe1f_i6k";
  if(!window.supabase||!window.supabase.createClient){
    console.error("Supabase JS library failed to load");
    return;
  }
  window.EnziVoltSupabase=window.supabase.createClient(url,key,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
  });
})();