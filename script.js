const burgers=[
  {id:1,name:"La Clásica Matteo",desc:"Medallón 180g, cheddar x2, lechuga, tomate, salsa casera. La que nunca falla.",price:8900,cat:"clasica",badge:"MÁS PEDIDA"},
  {id:2,name:"Doble Bacon Smash",desc:"Doble carne smash, bacon crocante, cheddar, cebolla crispy y alioli.",price:11900,cat:"doble",badge:"SMASH"},
  {id:3,name:"La Don Matteo XXL",desc:"Triple carne, triple cheddar, bacon, huevo, papas pay.",price:14900,cat:"doble",badge:"XXL"},
  {id:4,name:"Crispy Pollo",desc:"Pechuga panko, cheddar, coleslaw y honey mustard.",price:9500,cat:"premium",badge:"NUEVA"},
  {id:5,name:"Veggie Lila",desc:"Medallón de lentejas y hongos, palta, tomate seco, rúcula.",price:8700,cat:"clasica",badge:"VEGGIE"},
  {id:6,name:"Barbacoa Premium",desc:"180g, cheddar, bacon, aros de cebolla, BBQ ahumada.",price:10800,cat:"premium",badge:"PREMIUM"},
];
const empanadas=[
  {id:101,name:"Carne Cortada a Cuchillo",desc:"Carne, huevo, aceituna y verdeo. La reina.",price:1500},
  {id:102,name:"Pollo al Curry Suave",desc:"Pollo, morrón, cebolla caramelizada.",price:1500},
  {id:103,name:"Jamón y Queso Cremoso",desc:"Jamón natural, mozzarella y orégano.",price:1400},
  {id:104,name:"Caprese",desc:"Tomate, mozzarella, albahaca y oliva.",price:1500},
  {id:105,name:"Humita Dulce",desc:"Choclo cremoso, cebolla y queso.",price:1400},
  {id:106,name:"Cebolla y Queso",desc:"Cebolla caramelizada, mozzarella.",price:1400},
];
const pizzas=[
  {id:201,name:"Muzzarella de Barrio",desc:"Mucha muzza, orégano del bueno, aceitunas.",price:8900,badge:"CLÁSICA"},
  {id:202,name:"Napolitana",desc:"Tomate, muzza, ajo, albahaca fresca.",price:9900,badge:"CLÁSICA"},
  {id:203,name:"Fugazzeta",desc:"Cebolla blanca y verdeo, muzza y parmesano.",price:10900,badge:"TOP"},
  {id:204,name:"Pepperoni Picante",desc:"Pepperoni, muzza, toque de miel picante.",price:11900,badge:"PICANTE"},
  {id:205,name:"Provolone y Rúcula",desc:"Provolone fundido, rúcula, tomatitos.",price:11800,badge:"PREMIUM"},
  {id:206,name:"Don Matteo Especial",desc:"Muzza, jamón, morrón, huevo, aceitunas.",price:12900,badge:"DE LA CASA"},
];

const burgerGrid=document.getElementById('burgerGrid');
const empGrid=document.getElementById('empGrid');
const pizzaGrid=document.getElementById('pizzaGrid');
const tabs=document.querySelectorAll('.tab');
const menuCta=document.getElementById('menuCta');

function cardHTML(item, type){
  const seed=item.id*37;
  const placeholder=`https://picsum.photos/seed/${seed}/600/400`;
  return `<article class="menu-card">
    <div class="menu-card-img"><img src="${placeholder}" alt="${item.name}" loading="lazy" onerror="this.style.display='none'"><span class="menu-card-badge">${item.badge||'CASERA'}</span><span class="menu-card-price">$${item.price.toLocaleString('es-AR')}</span></div>
    <div class="menu-card-body"><h3>${item.name}</h3><p>${item.desc}</p><div class="card-actions"><button class="button button--sm" onclick="addToCart(${item.id},'${type}')" aria-label="Agregar ${item.name}">AGREGAR +</button></div></div>
  </article>`;
}
function render(){
  burgerGrid.innerHTML=burgers.map(b=>cardHTML(b,'burger')).join('');
  empGrid.innerHTML=empanadas.map(e=>cardHTML(e,'emp')).join('');
  pizzaGrid.innerHTML=pizzas.map(p=>cardHTML(p,'pizza')).join('');
  // stagger reveal
  document.querySelectorAll('.grid-menu:not(.hidden) .menu-card').forEach((c,i)=>{
    c.style.opacity='0'; c.style.transform='translateY(8px)';
    setTimeout(()=>{c.style.transition='opacity 340ms var(--ease-out), transform 340ms var(--ease-out)'; c.style.opacity='1'; c.style.transform='translateY(0)';}, i*48);
  });
}
render();

// Tabs - Emil: instant feedback, no delay, transform not all
tabs.forEach(t=>{
  t.addEventListener('click',()=>{
    tabs.forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    const tab=t.dataset.tab;
    burgerGrid.classList.toggle('hidden', tab!=='burgers');
    empGrid.classList.toggle('hidden', tab!=='empanadas');
    pizzaGrid.classList.toggle('hidden', tab!=='pizzas');
    menuCta.textContent = tab==='burgers'?'PEDIR BURGUERS': tab==='empanadas'?'PEDIR EMPANADAS':'PEDIR PIZZAS';
    render();
  });
});

// brand intro - disappears after 1.1s, respects reduced motion
const intro=document.getElementById('brandIntro');
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  intro.style.display='none';
}else{
  setTimeout(()=>intro.classList.add('out'),1100);
  setTimeout(()=>intro.remove(),1800);
}

// navbar hide on scroll - Emil: drawer curve, fast
let lastY=0;
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  if(y>140 && y>lastY) navbar.style.transform='translateY(-100%)';
  else navbar.style.transform='translateY(0)';
  lastY=y;
},{passive:true});

const burgerBtn=document.getElementById('burger');
const mobileMenu=document.getElementById('mobileMenu');
burgerBtn.addEventListener('click',()=>mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.remove('open')));

// reveal - one authored moment, blur + translate, exponential ease-out
const reveals=document.querySelectorAll('.reveal');
const io=new IntersectionObserver(ents=>{ ents.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); }); },{threshold:.18, rootMargin:'0px 0px -40px 0px'});
reveals.forEach(r=>io.observe(r));

// parallax - char-1 es estático a la derecha de NO ES UN LOCAL, no se mueve
const floatEls=document.querySelectorAll('.float-character:not(.char-1)');
let ticking=false;
window.addEventListener('scroll',()=>{
  if(window.innerWidth<860) return;
  if(!ticking){
    requestAnimationFrame(()=>{
      const scY=window.scrollY;
      floatEls.forEach(el=>{
        const off=Math.sin(scY*.0015 + el.offsetTop*.0003)*6;
        el.style.transform=`translateY(${off}px)`;
      });
      ticking=false;
    });
    ticking=true;
  }
},{passive:true});

// cursor - spring-like
const cursor=document.getElementById('cursor');
let mx=0,my=0,cx=0,cy=0;
window.addEventListener('mousemove',e=>{mx=e.clientX; my=e.clientY});
function loop(){ cx+=(mx-cx)*.14; cy+=(my-cy)*.14; cursor.style.left=cx+'px'; cursor.style.top=cy+'px'; requestAnimationFrame(loop); }
loop();
document.querySelectorAll('a, button').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursor.style.transform='translate(-50%,-50%) scale(1.7)'; cursor.style.background='rgba(219,174,217,.22)'});
  el.addEventListener('mouseleave',()=>{cursor.style.transform='translate(-50%,-50%) scale(1)'; cursor.style.background='transparent'});
});

// carrito
let cart=[];
const cartFab=document.getElementById('cartFab');
const cartDrawer=document.getElementById('cartDrawer');
const cartOverlay=document.getElementById('cartOverlay');
const cartItems=document.getElementById('cartItems');
const cartCount=document.getElementById('cartCount');
const cartTotal=document.getElementById('cartTotal');
function openCart(){cartDrawer.classList.add('open'); cartOverlay.classList.add('open')}
function closeCart(){cartDrawer.classList.remove('open'); cartOverlay.classList.remove('open')}
window.closeCart=closeCart;
cartFab.addEventListener('click',openCart);
document.getElementById('closeCart').addEventListener('click',closeCart);
cartOverlay.addEventListener('click',closeCart);

window.addToCart=(id,type)=>{
  const map={burger:burgers, emp:empanadas, pizza:pizzas};
  const list=map[type]; const item=list.find(i=>i.id===id);
  const ex=cart.find(c=>c.id===id);
  if(ex) ex.qty++; else cart.push({...item, qty:1});
  updateCart();
  const eater=document.querySelector('.char-1 img');
  if(eater){ eater.classList.remove('char-bite'); void eater.offsetWidth; eater.classList.add('char-bite'); }
  cartFab.classList.remove('cart-bump'); void cartFab.offsetWidth; cartFab.classList.add('cart-bump');
  for(let i=0;i<5;i++){ const c=document.createElement('div'); c.className='crumb'; c.textContent=['🧀','🍕','✨'][i%3]; c.style.left=(window.innerWidth/2 + (Math.random()-.5)*100)+'px'; c.style.top='46%'; c.style.setProperty('--x',(Math.random()-.5)*140+'px'); c.style.setProperty('--y',(-30-Math.random()*70)+'px'); document.body.appendChild(c); setTimeout(()=>c.remove(),720); }
  const msg = type==='burger'?' va a la plancha. Ya chisporrotea.': type==='pizza'?' ya está estirando la masa.':' ya la repulgamos a mano.';
  showToast(item.name + msg);
  openCart();
}
function updateCart(){
  cartCount.textContent=cart.reduce((a,b)=>a+b.qty,0);
  const total=cart.reduce((a,b)=>a+b.price*b.qty,0);
  cartTotal.textContent='$'+total.toLocaleString('es-AR');
  if(cart.length===0){
    cartItems.innerHTML='<div class="empty-cart"><img src="assets/personaje-saludando.png" alt="" width="120" style="margin:0 auto 12px;display:block"><p><strong>Todavía no elegiste nada</strong><br>Matteo ya prendió la plancha. Tocá agregar y lo armamos al momento.</p><a href="#menu" onclick="closeCart()" class="button button--sm" style="margin-top:14px">VER MENÚ</a></div>';
    document.getElementById('checkoutBtn').href='https://wa.me/5491112345678';
    return;
  }
  cartItems.innerHTML=cart.map(c=>`<div class="cart-item"><img src="https://picsum.photos/seed/${c.id*37}/100/100" alt=""><div class="cart-item-info"><strong>${c.name}</strong><span>$${c.price.toLocaleString('es-AR')} c/u</span></div><div class="cart-item-qty"><button onclick="changeQty(${c.id},-1)" aria-label="restar">−</button><span>${c.qty}</span><button onclick="changeQty(${c.id},1)" aria-label="sumar">+</button></div></div>`).join('');
  const wa=`Hola Don Matteo! Quiero pedir:\n${cart.map(c=>`• ${c.qty}x ${c.name} ($${c.price*c.qty})`).join('\n')}\nTotal: $${total}`;
  document.getElementById('checkoutBtn').href=`https://wa.me/5491112345678?text=${encodeURIComponent(wa)}`;
}
window.changeQty=(id,d)=>{ const it=cart.find(c=>c.id===id); if(!it) return; it.qty+=d; if(it.qty<=0) cart=cart.filter(c=>c.id!==id); updateCart(); }

const toast=document.getElementById('toast');
function showToast(m){ toast.textContent=m; toast.classList.add('show'); clearTimeout(showToast._t); showToast._t=setTimeout(()=>toast.classList.remove('show'),3000); }

document.getElementById('contactForm').addEventListener('submit',e=>{
  e.preventDefault();
  const btn=e.target.querySelector('button'); const prev=btn.textContent;
  btn.textContent='¡RECIBIDO! ✓'; btn.disabled=true;
  showToast('Listo. Te escribe alguien de la cocina en un ratito, sin vueltas.');
  for(let i=0;i<6;i++){ const c=document.createElement('div'); c.className='crumb'; c.textContent='💬'; const r=btn.getBoundingClientRect(); c.style.left=(r.left+r.width/2)+'px'; c.style.top=r.top+'px'; c.style.setProperty('--x',(Math.random()-.5)*100+'px'); c.style.setProperty('--y',(-30-Math.random()*50)+'px'); document.body.appendChild(c); setTimeout(()=>c.remove(),720); }
  setTimeout(()=>{ btn.textContent=prev; btn.disabled=false; e.target.reset(); },2200);
});
