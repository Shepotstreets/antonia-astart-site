const langButton=document.querySelector('.lang');
let lang='ru';
langButton.addEventListener('click',()=>{
  lang=lang==='ru'?'en':'ru';
  document.documentElement.lang=lang;
  langButton.textContent=lang==='ru'?'EN':'RU';
  document.querySelectorAll('[data-ru]').forEach(el=>{el.textContent=el.dataset[lang]});
});

/*
  Reversible editorial motion without disappearing frames:
  – scrolling down: each frame rises softly from below;
  – after appearing, it remains visible while the user scrolls farther down;
  – scrolling back up: the approaching frames are already visible;
  – only after a frame has completely left through the bottom edge does it
    reset to the lower hidden position for the next downward visit.
*/
let previousY=window.scrollY;
let scrollDirection='down';
window.addEventListener('scroll',()=>{
  const currentY=window.scrollY;
  if(Math.abs(currentY-previousY)>1){
    scrollDirection=currentY>previousY?'down':'up';
    previousY=currentY;
  }
},{passive:true});

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    const el=entry.target;

    if(entry.isIntersecting){
      /* Always keep a frame visible when it enters from either direction.
         This prevents photographs above the viewport from disappearing
         while the page is being scrolled back upward. */
      el.classList.add('visible');
      return;
    }

    /* During upward scrolling the document moves downward. Reset only once
       the complete frame has actually passed below the viewport. */
    if(scrollDirection==='up' && entry.boundingClientRect.top>=window.innerHeight){
      el.classList.remove('visible');
    }
  });
},{threshold:[0,.06,.16],rootMargin:'0px 0px -2% 0px'});

document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const syncScrollCue=()=>{
  document.body.classList.toggle('has-scrolled',window.scrollY>2);
};
syncScrollCue();
window.addEventListener('scroll',syncScrollCue,{passive:true});
