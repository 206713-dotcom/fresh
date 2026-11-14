var U='Users',S='Students',P='Progress';
var UH=['access_code','name','password_hash','salt','failed_attempts','locked_until','created_at','updated_at'];
var SH=['access_code','student_id','name','coins','streak','time_spent_sec','mcq_completed','mcq_errors','two_mark_scores','four_mark_scores','six_mark_scores','eight_mark_scores','twelve_mark_scores','missed_marks_breakdown','topical_log','recommended_focus','updated_at'];
var PH=['access_code','coins','streak','unlocked_themes','progress_json','updated_at'];
var J=['mcq_errors','two_mark_scores','four_mark_scores','six_mark_scores','eight_mark_scores','twelve_mark_scores','missed_marks_breakdown','topical_log','unlocked_themes','progress_json'];
var N=['coins','streak','time_spent_sec','mcq_completed'];
var TTL=2592000,ITER=250,MAX=5,LOCK=15,MIN=6;

function out(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
function s(v){return v==null?'':String(v).trim();}

function doGet(e){
  var p=e.parameter||{},a=p.action||'student',c=tok(p.token);
  if(!c)return out({success:false,error:'unauthorized'});
  return out({success:true,data:read(a=='progress'?P:S,a=='progress'?PH:SH,c)});
}

function doPost(e){
  var b=JSON.parse((e.postData||{}).contents||'{}'),a=b.action||'';
  if(a=='register')return reg(b);
  if(a=='login')return log(b);
  var c=tok(b.token);
  if(!c)return out({success:false,error:'unauthorized'});
  if(a=='progress')up(P,PH,c,b);else up(S,SH,c,b);
  return out({success:true});
}

function reg(b){
  var c=s(b.access_code),pw=String(b.password||''),nm=s(b.name);
  if(!/^\d{6}$/.test(c))return out({success:false,error:'Student number must be exactly 6 digits.'});
  if(pw.length<MIN)return out({success:false,error:'Password must be at least 6 characters.'});
  var sh=get(U,UH),lk=LockService.getScriptLock();lk.waitLock(15000);
  try{
    var r=find(sh,c);
    if(r>0&&sh.getRange(r,3).getValue())return out({success:false,error:'That student number is already registered. Sign in instead.'});
    var salt=Utilities.getUuid().replace(/-/g,''),now=new Date().toISOString();
    var rec={name:nm||'Student',password_hash:hash(pw,salt),salt:salt,failed_attempts:0,locked_until:'',created_at:now,updated_at:now};
    if(r>0)put(sh,UH,r,c,rec);else add(sh,UH,c,rec);
    return out({success:true,token:sgn(c),access_code:c,name:rec.name});
  }finally{lk.releaseLock();}
}

function log(b){
  var c=s(b.access_code),pw=String(b.password||''),bad='Incorrect student number or password.';
  var sh=get(U,UH),r=find(sh,c);
  if(r<0)return out({success:false,error:bad});
  var u=obj(sh,UH,r),now=Date.now();
  if(!u.password_hash)return out({success:false,error:'This account has not been set up yet. Sign up first.'});
  if(u.locked_until&&new Date(u.locked_until).getTime()>now)return out({success:false,error:'Too many attempts. Try again in '+Math.ceil((new Date(u.locked_until).getTime()-now)/60000)+' minute(s).'});
  if(hash(pw,u.salt)!==u.password_hash){
    var n=Number(u.failed_attempts||0)+1;
    put(sh,UH,r,c,{failed_attempts:n>=MAX?0:n,locked_until:n>=MAX?new Date(now+LOCK*60000).toISOString():'',updated_at:new Date().toISOString()});
    return out({success:false,error:bad});
  }
  put(sh,UH,r,c,{failed_attempts:0,locked_until:'',updated_at:new Date().toISOString()});
  return out({success:true,token:sgn(c),access_code:c,name:u.name||'Student'});
}

function hash(pw,salt){var x=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,salt+':'+pw,Utilities.Charset.UTF_8);for(var i=0;i<ITER;i++)x=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,x);return hex(x);}
function hex(b){var o='';for(var i=0;i<b.length;i++){var v=(b[i]<0?b[i]+256:b[i]).toString(16);o+=v.length<2?'0'+v:v;}return o;}
function eq(a,b){a=String(a||'');b=String(b||'');if(a.length!=b.length)return false;var d=0;for(var i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0;}
function sec(){var p=PropertiesService.getScriptProperties(),v=p.getProperty('ECBIZ_TOKEN_SECRET');if(!v){v=Utilities.getUuid()+Utilities.getUuid();p.setProperty('ECBIZ_TOKEN_SECRET',v);}return v;}
function sgn(c){var pl=Utilities.base64EncodeWebSafe(JSON.stringify({sub:c,exp:Math.floor(Date.now()/1000)+TTL}),Utilities.Charset.UTF_8);return pl+'.'+Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(pl,sec()));}
function tok(t){if(!t)return null;var p=String(t).split('.');if(p.length!=2)return null;if(!eq(Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(p[0],sec())),p[1]))return null;try{var o=JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(p[0])).getDataAsString());return o&&o.sub&&Number(o.exp)>Math.floor(Date.now()/1000)?String(o.sub):null;}catch(e){return null;}}

function get(n,h){var ss=SpreadsheetApp.getActiveSpreadsheet(),sh=ss.getSheetByName(n);if(!sh)sh=ss.insertSheet(n);var r=sh.getRange(1,1,1,h.length).getValues()[0],ok=true;for(var i=0;i<h.length;i++)if(String(r[i]||'').trim()!==h[i])ok=false;if(!ok){sh.getRange(1,1,1,h.length).setValues([h]);sh.setFrozenRows(1);}return sh;}
function find(sh,c){var n=sh.getLastRow();if(n<2)return -1;var v=sh.getRange(2,1,n-1,1).getValues();for(var i=0;i<v.length;i++)if(s(v[i][0])===c)return i+2;return -1;}
function obj(sh,h,r){var v=sh.getRange(r,1,1,h.length).getValues()[0],o={};for(var i=0;i<h.length;i++){var k=h[i],x=v[i];o[k]=J.indexOf(k)>=0?pj(x,k):N.indexOf(k)>=0?(x===''?0:Number(x)):x;}return o;}
function pj(x,k){if(x===''||x==null)return k=='topical_log'||k=='progress_json'?{}:[];if(typeof x!='string')return x;try{return JSON.parse(x);}catch(e){return x;}}
function read(n,h,c){var sh=get(n,h),r=find(sh,c);return r<0?null:obj(sh,h,r);}
function sv(k,v){if(J.indexOf(k)>=0)return typeof v=='string'?v:JSON.stringify(v);if(v instanceof Date)return v.toISOString();return (typeof v=='number'||typeof v=='boolean')?v:String(v);}
function add(sh,h,c,rec){var now=new Date().toISOString();sh.appendRow(h.map(function(k){if(k=='access_code')return c;if(k=='updated_at')return rec[k]||now;var v=rec[k];return v==null?'':sv(k,v);}));}
function put(sh,h,r,c,p){var old=sh.getRange(r,1,1,h.length).getValues()[0],now=new Date().toISOString();sh.getRange(r,1,1,h.length).setValues([h.map(function(k,i){if(k=='access_code')return c;if(p[k]!=null)return sv(k,p[k]);if(k=='updated_at')return now;return old[i];})]);}
function up(n,h,c,b){var sh=get(n,h),lk=LockService.getScriptLock();lk.waitLock(15000);try{var r=find(sh,c),p={};for(var k in b)if(b.hasOwnProperty(k)&&k!='action'&&k!='token'&&k!='access_code')p[k]=b[k];if(r<0)add(sh,h,c,p);else put(sh,h,r,c,p);}finally{lk.releaseLock();}}
