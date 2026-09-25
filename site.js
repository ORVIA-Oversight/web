const enquiryForm=document.getElementById('enquiry-form');
enquiryForm?.addEventListener('submit',event=>{
  event.preventDefault();
  if(!enquiryForm.reportValidity())return;
  const data=new FormData(enquiryForm);
  const fields=[['Name','name'],['Business','business'],['Email','email'],['Telephone','phone'],['Interested in','interest'],['Message','message']];
  const body=fields.map(([label,key])=>`${label}: ${String(data.get(key)||'').trim()}`).join('\n');
  const subject=`ORVIA Web enquiry: ${String(data.get('interest')||'Website')}`;
  window.location.href=`mailto:web@orvia.org.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const consentKey='orvia-web-consent-v1';
const banner=document.getElementById('cookie-banner');
const consentDialog=document.getElementById('cookie-dialog');
const analyticsChoice=document.getElementById('consent-analytics');
const marketingChoice=document.getElementById('consent-marketing');
const tracking={gaId:'',metaPixelId:''}; // Add verified IDs here before activating tracking.
let gaLoaded=false,metaLoaded=false;
function getConsent(){try{return JSON.parse(localStorage.getItem(consentKey))}catch{return null}}
function loadAnalytics(){
  if(!tracking.gaId||gaLoaded)return;
  gaLoaded=true;
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments)};
  window.gtag('js',new Date());window.gtag('config',tracking.gaId);
  const script=document.createElement('script');script.async=true;
  script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tracking.gaId)}`;
  document.head.append(script);
}
function loadMarketing(){
  if(!tracking.metaPixelId||metaLoaded)return;
  metaLoaded=true;
  window.fbq=function(){if(window.fbq.callMethod)window.fbq.callMethod.apply(window.fbq,arguments);else window.fbq.queue.push(arguments)};
  window.fbq.queue=[];window.fbq.loaded=true;window.fbq.version='2.0';
  const script=document.createElement('script');script.async=true;
  script.src='https://connect.facebook.net/en_US/fbevents.js';document.head.append(script);
  window.fbq('init',tracking.metaPixelId);window.fbq('track','PageView');
}
function applyConsent(choice){
  if(!choice)return;
  banner.hidden=true;
  if(choice.analytics)loadAnalytics();
  if(choice.marketing)loadMarketing();
  if(choice.marketing){
    const allowed=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
    const params=new URLSearchParams(location.search);
    const attribution=Object.fromEntries(allowed.filter(key=>params.has(key)).map(key=>[key,params.get(key)]));
    try{if(Object.keys(attribution).length)sessionStorage.setItem('orvia-web-attribution',JSON.stringify(attribution))}catch{}
  }else try{sessionStorage.removeItem('orvia-web-attribution')}catch{}
}
function saveConsent(analytics,marketing){
  const previous=getConsent();
  const choice={analytics:!!analytics,marketing:!!marketing,recordedAt:new Date().toISOString()};
  try{localStorage.setItem(consentKey,JSON.stringify(choice))}catch{}
  if(consentDialog.open)consentDialog.close();
  if((previous?.analytics&&!choice.analytics)||(previous?.marketing&&!choice.marketing)){location.reload();return}
  applyConsent(choice);
}
const saved=getConsent();
if(saved)applyConsent(saved);else banner.hidden=false;
document.getElementById('cookie-reject')?.addEventListener('click',()=>saveConsent(false,false));
document.getElementById('cookie-accept')?.addEventListener('click',()=>saveConsent(true,true));
function openSettings(){
  const choice=getConsent();analyticsChoice.checked=!!choice?.analytics;marketingChoice.checked=!!choice?.marketing;
  consentDialog.showModal();
}
document.getElementById('cookie-customise')?.addEventListener('click',openSettings);
document.getElementById('cookie-settings-open')?.addEventListener('click',openSettings);
document.getElementById('cookie-save')?.addEventListener('click',()=>saveConsent(analyticsChoice.checked,marketingChoice.checked));


// Connected package builder
const packageBoxes=[...document.querySelectorAll('.package-option input[data-package]')];
const packageSelected=document.getElementById('package-selected');
const packageDescription=document.getElementById('package-description');
const packageEnquiry=document.getElementById('package-enquiry');
function updatePackage(){
  if(!packageSelected)return;
  const selected=['Website',...packageBoxes.filter(x=>x.checked).map(x=>x.dataset.package)];
  packageSelected.innerHTML=selected.map(x=>'<span>'+x+'</span>').join('');
  const extras=selected.slice(1);
  packageDescription.textContent=extras.length
    ? 'A website with '+extras.join(', ')+' added around it. Final scope depends on your systems, integrations and managed-service needs.'
    : 'A professionally built website, ready to add more when the business needs it.';
  if(packageEnquiry) packageEnquiry.href='#contact';
  const interest=document.querySelector('#enquiry-form select[name="interest"]');
  const msg=document.querySelector('#enquiry-form textarea[name="message"]');
  packageEnquiry?.addEventListener('click',()=>{
    if(interest) interest.value='Not Sure Yet';
    if(msg) msg.value='I am interested in this ORVIA package: '+selected.join(' + ')+'.';
  },{once:true});
}
packageBoxes.forEach(x=>x.addEventListener('change',updatePackage));
updatePackage();
