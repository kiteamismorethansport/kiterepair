
function toggleMenu(){const btn=document.querySelector('.hamburger');const menu=document.getElementById('menu');const open=menu.style.display==='flex';menu.style.display=open?'none':'flex';btn.setAttribute('aria-expanded',(!open).toString());}
function setYear(){const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();}
document.addEventListener('DOMContentLoaded', setYear);
function waLink(text){ const t = encodeURIComponent(text); return 'https://wa.me/351963317182?text='+t; }

async function startWidget(){
  const wrap = document.getElementById('review-widget'); if(!wrap) return;
  function mount(slides){
    if(!slides || !slides.length){ wrap.innerHTML = '<div style="color:#fff;padding:1rem">Add photos in <code>content/photos.json</code> and reviews in <code>content/reviews.json</code>.</div>'; return; }
    wrap.innerHTML = slides.map((s,idx)=>`
      <div class="slide${idx===0?' active':''}">
        <img class="photo" src="${s.photo}" alt="Kite repair photo">
        <div class="review">
          
          <p style="margin:.5rem 0 0 0">${s.text||''}</p>
          <div class="author">— ${s.author||'KiteRepair.pt'} · <span style="opacity:.8">${s.time||''}</span></div>
        </div>
        <div class="dots"></div>
      </div>`).join('');
    const slidesEls = Array.from(wrap.querySelectorAll('.slide'));
    slidesEls.forEach((el,i)=>{ const dots=el.querySelector('.dots'); slidesEls.forEach((_,j)=>{const d=document.createElement('div'); d.className='dot'+(j===i?' active':''); dots.appendChild(d);}); });
    let idx=0; setInterval(()=>{ slidesEls[idx].classList.remove('active'); idx=(idx+1)%slidesEls.length; slidesEls[idx].classList.add('active'); }, 4500);
  }
  try {
    const [photos, reviews] = await Promise.all([
      fetch('./content/photos.json').then(r=>r.ok?r.json():[]).catch(()=>[]),
      fetch('./content/reviews.json').then(r=>r.ok?r.json():[]).catch(()=>[])
    ]);
    let slides=[];
    if(Array.isArray(reviews)&&reviews.length) slides = reviews.map((rev,i)=>({ photo: (Array.isArray(photos)&&photos[i%photos.length])||'assets/photo-1.jpg', ...rev }));
    else if(Array.isArray(photos)&&photos.length) slides = photos.map(p=>({ photo:p, author:'', rating:5, text:'', time:'' }));
    else slides=[{photo:'assets/photo-1.jpg',author:'KiteRepair.pt',rating:5,text:'Quality repairs. Algarve pickup available.',time:''}];
    mount(slides);
  } catch(e){ mount([{photo:'assets/photo-1.jpg',author:'KiteRepair.pt',rating:5,text:'Quality repairs. Algarve pickup available.',time:''}]); }
}
document.addEventListener('DOMContentLoaded', startWidget);
