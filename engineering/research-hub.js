(() => {
const db=window.EnziVoltSupabase;
const $=id=>document.getElementById(id);
if(!db){$('eh-library').textContent='ডেটাবেস সংযোগ পাওয়া যায়নি। পেজটি রিফ্রেশ করুন।';return;}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let adminUser=null,adminActive=false;
const say=(id,msg)=>{if($(id))$(id).textContent=msg;};
async function loadLibrary(){
 const host=$('eh-library'),discussion=$('eh-discussion');
 const r=await db.from('research_submissions').select('id,author_name,title,field,abstract,research_body,reference_url,submitted_at,status').in('status',['approved','featured']).order('submitted_at',{ascending:false});
 if(r.error){host.textContent='লাইব্রেরি লোড করা যায়নি: '+r.error.message;return;}
 const rows=r.data||[];
 host.innerHTML=rows.map(x=>'<article class="eh-card"><div class="eh-meta">'+esc(x.field)+' · '+new Date(x.submitted_at).toLocaleDateString('bn-BD')+'</div><h3>'+esc(x.title)+'</h3><div class="eh-meta">গবেষক: '+esc(x.author_name)+'</div><p>'+esc(x.abstract)+'</p><details><summary>সম্পূর্ণ গবেষণা পড়ুন</summary><p>'+esc(x.research_body)+'</p>'+(x.reference_url?'<p><a href="'+esc(x.reference_url)+'" target="_blank" rel="noopener noreferrer">গবেষণার রেফারেন্স</a></p>':'')+'</details><div id="comments-'+x.id+'"></div><form class="eh-form comment-form" data-id="'+x.id+'"><label>আপনার নাম<input name="author_name" required minlength="2" maxlength="100"></label><label class="wide">মন্তব্য / প্রশ্ন<textarea name="comment" required minlength="2" maxlength="3000"></textarea></label><div class="wide"><button class="eh-btn">মন্তব্য জমা দিন</button></div></form><div class="eh-status" id="comment-status-'+x.id+'"></div></article>').join('')||'<p class="eh-muted">এখনো কোনো গবেষণা প্রকাশিত হয়নি। প্রথম গবেষণাটি আপনিও জমা দিতে পারেন।</p>';
 if(!rows.length){discussion.textContent='প্রকাশিত গবেষণা এলে এখান থেকে আলোচনা শুরু হবে।';return;}
 discussion.innerHTML='<p class="eh-muted">নিচের প্রকাশিত গবেষণাগুলোর মন্তব্য ও প্রশ্ন এই অংশে দেখানো হয়।</p>'+rows.map(x=>'<p><a href="#comments-'+x.id+'">'+esc(x.title)+'</a> — <span class="eh-meta">'+esc(x.author_name)+'</span></p>').join('');
 for(const x of rows)await loadComments(x.id);
 document.querySelectorAll('.comment-form').forEach(form=>form.addEventListener('submit',async e=>{
  e.preventDefault();const fd=new FormData(form),id=form.dataset.id;
  const w=await db.from('research_comments').insert({submission_id:id,author_name:String(fd.get('author_name')).trim(),comment:String(fd.get('comment')).trim()});
  if(w.error){say('comment-status-'+id,'মন্তব্য জমা হয়নি: '+w.error.message);return;}
  form.reset();say('comment-status-'+id,'মন্তব্য জমা হয়েছে। প্রকাশের আগে পর্যালোচনা করা হবে।');
 }));
}
async function loadComments(id){
 const host=$('comments-'+id);if(!host)return;
 const r=await db.from('research_comments').select('author_name,comment,submitted_at').eq('submission_id',id).eq('status','approved').order('submitted_at');
 if(r.error){host.textContent='মন্তব্য লোড করা যায়নি।';return;}
 host.innerHTML=(r.data||[]).map(c=>'<div class="eh-comment"><b>'+esc(c.author_name)+'</b><div>'+esc(c.comment)+'</div><small class="eh-meta">'+new Date(c.submitted_at).toLocaleDateString('bn-BD')+'</small></div>').join('')||'<p class="eh-meta">এখনো কোনো অনুমোদিত মন্তব্য নেই।</p>';
}
async function loadSpotlight(){
 const host=$('eh-spotlight');
 const r=await db.from('research_spotlights').select('id,spotlight_month,editor_note,published_at,submission_id').order('spotlight_month',{ascending:false});
 if(r.error){host.textContent='প্রকাশনা লোড করা যায়নি: '+r.error.message;return;}
 const items=r.data||[];
 if(!items.length){host.innerHTML='<p class="eh-muted">প্রথম মাসিক Research Spotlight এখনো প্রকাশিত হয়নি।</p>';return;}
 const ids=items.map(x=>x.submission_id);
 const s=await db.from('research_submissions').select('id,author_name,title,field,abstract,research_body,reference_url').in('id',ids);
 if(s.error){host.textContent=s.error.message;return;}
 host.innerHTML=items.map(x=>{const a=(s.data||[]).find(v=>v.id===x.submission_id);if(!a)return '';return '<article class="eh-card"><div class="eh-meta">মাসিক প্রকাশনা · '+new Date(x.spotlight_month+'T00:00:00').toLocaleDateString('bn-BD',{year:'numeric',month:'long'})+'</div><h3>'+esc(a.title)+'</h3><p><b>নির্বাচিত গবেষক:</b> '+esc(a.author_name)+' · '+esc(a.field)+'</p><p>'+esc(a.abstract)+'</p><p>'+esc(x.editor_note)+'</p><details><summary>গবেষণার বিস্তারিত</summary><p>'+esc(a.research_body)+'</p>'+(a.reference_url?'<a href="'+esc(a.reference_url)+'" target="_blank" rel="noopener noreferrer">রেফারেন্স</a>':'')+'</details></article>';}).join('');
}
$('eh-submit').addEventListener('submit',async e=>{
 e.preventDefault();const f=new FormData(e.currentTarget);
 const payload={author_name:String(f.get('author_name')).trim(),field:String(f.get('field')).trim(),title:String(f.get('title')).trim(),abstract:String(f.get('abstract')).trim(),research_body:String(f.get('research_body')).trim(),reference_url:String(f.get('reference_url')||'').trim()};
 const b=e.currentTarget.querySelector('button[type=submit]');b.disabled=true;say('eh-submit-status','গবেষণা জমা হচ্ছে…');
 const r=await db.from('research_submissions').insert(payload).select('id').single();b.disabled=false;
 if(r.error){say('eh-submit-status','জমা দেওয়া যায়নি: '+r.error.message);return;}
 e.currentTarget.reset();say('eh-submit-status','গবেষণা সফলভাবে জমা হয়েছে। পর্যালোচনা শেষে অনুমোদিত হলে Research Library-তে প্রকাশিত হবে। Submission ID: '+r.data.id);
});
async function checkAdmin(){
 const {data}=await db.auth.getSession();adminUser=data.session?.user||null;adminActive=false;
 if(adminUser){const m=await db.from('admin_memberships').select('role,active').eq('user_id',adminUser.id).maybeSingle();adminActive=!!m.data?.active;}
 $('eh-admin-out').style.display=adminUser?'inline-block':'none';
 if(adminActive){say('eh-admin-status','Admin access সক্রিয়।');await loadReview();}else if(adminUser){say('eh-admin-status','এই অ্যাকাউন্টে সক্রিয় Admin অনুমতি নেই।');$('eh-review').innerHTML='';}
}
$('eh-admin-login').addEventListener('submit',async e=>{
 e.preventDefault();const f=new FormData(e.currentTarget);
 const r=await db.auth.signInWithPassword({email:f.get('email'),password:f.get('password')});
 if(r.error){say('eh-admin-status','সাইন ইন ব্যর্থ: '+r.error.message);return;}
 await checkAdmin();
});
$('eh-admin-out').addEventListener('click',async()=>{await db.auth.signOut();$('eh-review').innerHTML='';await checkAdmin();say('eh-admin-status','সাইন আউট হয়েছে।');});
async function loadReview(){
 if(!adminActive)return;const host=$('eh-review');
 const [sr,cr]=await Promise.all([
  db.from('research_submissions').select('*').eq('status','pending').order('submitted_at'),
  db.from('research_comments').select('*').eq('status','pending').order('submitted_at')
 ]);
 if(sr.error||cr.error){host.textContent=sr.error?.message||cr.error?.message;return;}
 const submissions=sr.data||[],comments=cr.data||[];
 host.innerHTML='<h3>অপেক্ষমাণ গবেষণা ('+submissions.length+')</h3>'+submissions.map(x=>'<article class="eh-card"><div class="eh-meta">'+esc(x.field)+' · '+esc(x.author_name)+'</div><h3>'+esc(x.title)+'</h3><p>'+esc(x.abstract)+'</p><details><summary>পূর্ণ লেখা</summary><p>'+esc(x.research_body)+'</p></details><div class="eh-inline"><button class="eh-btn" data-review-sub="'+x.id+'" data-status="approved">অনুমোদন</button><button class="eh-btn" data-review-sub="'+x.id+'" data-status="rejected">প্রত্যাখ্যান</button></div></article>').join('')||'<p class="eh-muted">নতুন কোনো গবেষণা অপেক্ষমাণ নেই।</p>';
 host.innerHTML+='<h3>অপেক্ষমাণ মন্তব্য ('+comments.length+')</h3>'+comments.map(x=>'<article class="eh-card"><b>'+esc(x.author_name)+'</b><p>'+esc(x.comment)+'</p><div class="eh-inline"><button class="eh-btn" data-review-comment="'+x.id+'" data-status="approved">অনুমোদন</button><button class="eh-btn" data-review-comment="'+x.id+'" data-status="rejected">প্রত্যাখ্যান</button></div></article>').join('')||'<p class="eh-muted">নতুন কোনো মন্তব্য অপেক্ষমাণ নেই।</p>';
 host.innerHTML+='<h3>মাসিক Spotlight নির্বাচন</h3><form id="eh-spot-form" class="eh-form"><label class="wide">অনুমোদিত গবেষণা<select name="submission_id" required><option value="">গবেষণা নির্বাচন করুন</option>'+((await db.from('research_submissions').select('id,title,author_name').in('status',['approved','featured']).order('submitted_at',{ascending:false})).data||[]).map(x=>'<option value="'+x.id+'">'+esc(x.title)+' — '+esc(x.author_name)+'</option>').join('')+'</select></label><label>প্রকাশনার মাস<input type="month" name="spotlight_month" required></label><label>সম্পাদকীয় নোট<input name="editor_note" maxlength="1000" placeholder="কেন নির্বাচিত হয়েছে"></label><div class="wide"><button class="eh-btn">Spotlight প্রকাশ করুন</button></div></form>';
 host.querySelectorAll('[data-review-sub]').forEach(b=>b.onclick=async()=>{const r=await db.from('research_submissions').update({status:b.dataset.status,reviewed_at:new Date().toISOString(),reviewed_by:adminUser.id}).eq('id',b.dataset.reviewSub);if(r.error){say('eh-admin-status',r.error.message);return;}say('eh-admin-status','গবেষণার সিদ্ধান্ত সংরক্ষিত হয়েছে।');await loadReview();await loadLibrary();});
 host.querySelectorAll('[data-review-comment]').forEach(b=>b.onclick=async()=>{const r=await db.from('research_comments').update({status:b.dataset.status,reviewed_at:new Date().toISOString(),reviewed_by:adminUser.id}).eq('id',b.dataset.reviewComment);if(r.error){say('eh-admin-status',r.error.message);return;}say('eh-admin-status','মন্তব্যের সিদ্ধান্ত সংরক্ষিত হয়েছে।');await loadReview();await loadLibrary();});
 const sf=$('eh-spot-form');sf.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(sf),month=String(f.get('spotlight_month'))+'-01';const r=await db.from('research_spotlights').insert({submission_id:f.get('submission_id'),spotlight_month:month,editor_note:String(f.get('editor_note')||'').trim(),published_by:adminUser.id});if(r.error){say('eh-admin-status','প্রকাশ করা যায়নি: '+r.error.message);return;}await db.from('research_submissions').update({status:'featured'}).eq('id',f.get('submission_id'));say('eh-admin-status','মাসিক Research Spotlight প্রকাশিত হয়েছে।');await loadSpotlight();await loadReview();});
}
loadLibrary();loadSpotlight();checkAdmin();db.auth.onAuthStateChange(()=>queueMicrotask(checkAdmin));
})();