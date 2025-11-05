(function(){function isMobile(){const ua=navigator.userAgent||navigator.vendor||window.opera;return/android|iphone|ipad|ipod|windows phone/i.test(ua)}
function getMode(){return new URLSearchParams(window.location.search).get('mode')}
document.addEventListener('DOMContentLoaded',function(){if(getMode()==='1'){const navbar=document.querySelector('nav.navbar');if(navbar)navbar.style.display='none';const footerLinks=document.querySelectorAll('footer a');footerLinks.forEach(el=>el.style.display='none')}
if(isMobile()){let showModal=!0;if(navigator.standalone||window.matchMedia('(display-mode: standalone)').matches){showModal=!1}
if(showModal){const el=document.getElementById('cf-install-modal');if(el)new bootstrap.Modal(el).show();}}})})()