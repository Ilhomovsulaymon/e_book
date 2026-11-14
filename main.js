const bookData = [
 {id:1,title:"Atomic Habits",author:"James Clear",category:"Ilmiy",description:"Kichik odatlar orqali katta natijalarga erishish haqida amaliy qo‘llanma.",cover:"https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",link:"https://dn790007.ca.archive.org/0/items/atomic-habits-pdfdrive/Atomic%20habits%20%28%20PDFDrive%20%29.pdf"},
 {id:2,title:"Dunyoning ishlari",author:"O‘tkir Hoshimov",category:"Roman",description:"Insoniy mehr, ona muhabbati va hayotiy voqealar haqida ta’sirli qissa.",cover:"https://covers.openlibrary.org/b/title/Dunyoning%20ishlari-M.jpg",link:"https://zakm.uz/media/books/O._Hoshimov_Dunyoning_ishlari.pdf"},
 {id:3,title:"Uch mushketyor",author:"Alexandre Dumas",category:"Tarix",description:"Do‘stlik, jasorat va sarguzashtlarga boy mashhur tarixiy roman.",cover:"https://covers.openlibrary.org/b/title/The%20Three%20Musketeers-M.jpg",link:"https://www.gutenberg.org/ebooks/1257"},
 {id:4,title:"Sherlok Xolms",author:"Arthur Conan Doyle",category:"Detektiv",description:"Mashhur detektivning aql va kuzatuvchanlikka asoslangan sirli ishlari.",cover:"https://covers.openlibrary.org/b/title/The%20Adventures%20of%20Sherlock%20Holmes-M.jpg",link:"https://www.gutenberg.org/ebooks/1661"},
 {id:5,title:"Vaqt mashinasi",author:"H. G. Wells",category:"Fantastika",description:"Vaqt bo‘ylab sayohat va insoniyat kelajagi haqidagi fantastik asar.",cover:"https://covers.openlibrary.org/b/title/The%20Time%20Machine-M.jpg",link:"https://www.gutenberg.org/ebooks/35"},
 {id:6,title:"Uch og‘ayni",author:"Erich Maria Remarque",category:"Roman",description:"Do‘stlik, hayot sinovlari va insoniy tuyg‘ular tasvirlangan roman.",cover:"https://covers.openlibrary.org/b/title/Three%20Comrades-M.jpg",link:"https://www.gutenberg.org/ebooks/author/437"}
];

const $ = (s, root=document) => root.querySelector(s);
const bookGrid = $("#bookGrid"), searchInput = $("#searchInput"), categoryGrid = $("#categoryGrid");
const favorites = new Set(JSON.parse(localStorage.getItem("mobileBookFavorites") || "[]"));
let activeCategory = "Barchasi";
let toastTimer;

function notify(message){
 const toast=$("#toast"); toast.textContent=message; toast.classList.add("show");
 clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2300);
}
function saveFavorites(){localStorage.setItem("mobileBookFavorites",JSON.stringify([...favorites]));$("#favoriteCount").textContent=favorites.size;}
function renderBooks(){
 const term=searchInput.value.trim().toLocaleLowerCase("uz");
 let list=bookData.filter(book=>(activeCategory==="Barchasi"||book.category===activeCategory)&&
  (book.title.toLocaleLowerCase("uz").includes(term)||book.author.toLocaleLowerCase("uz").includes(term)||book.category.toLocaleLowerCase("uz").includes(term)));
 const sort=$("#sortSelect").value;
 if(sort==="az") list.sort((a,b)=>a.title.localeCompare(b.title,"uz"));
 if(sort==="za") list.sort((a,b)=>b.title.localeCompare(a.title,"uz"));
 bookGrid.innerHTML=list.map(book=>`
  <article class="book-card">
   <img class="book-cover" src="${book.cover}" alt="${book.title} muqovasi" loading="lazy" onerror="this.src='https://placehold.co/240x360/20334a/eaf5ee?text=Kitob'">
   <div class="book-info"><span class="book-category">${book.category}</span><h3>${book.title}</h3><span class="book-author">${book.author}</span><p class="book-description">${book.description}</p>
    <div class="book-actions"><button class="read-btn" data-read="${book.id}">Batafsil ↗</button><button class="heart-btn ${favorites.has(book.id)?"is-favorite":""}" data-fav="${book.id}" aria-label="Sevimlilarga qo‘shish">${favorites.has(book.id)?"♥":"♡"}</button></div>
   </div>
  </article>`).join("");
 $("#resultCount").textContent=`${list.length} ta kitob`;
 $("#emptyState").classList.toggle("hidden",list.length!==0);
 bookGrid.classList.toggle("hidden",list.length===0);
}
function openModal(content){$("#modalContent").innerHTML=content;$("#modalBackdrop").classList.remove("hidden");}
function closeModal(){$("#modalBackdrop").classList.add("hidden");}
function showBook(id){
 const b=bookData.find(x=>x.id===id); if(!b)return;
 openModal(`<div class="modal-book"><img src="${b.cover}" alt="${b.title}" onerror="this.src='https://placehold.co/240x360/20334a/eaf5ee?text=Kitob'"><div><span class="book-category">${b.category}</span><h2 id="modalTitle">${b.title}</h2><p><b>Muallif:</b> ${b.author}</p><p>${b.description}</p><a class="read-btn" href="${b.link}" target="_blank" rel="noopener">Kitobni ochish ↗</a></div></div>`);
}
bookGrid.addEventListener("click",e=>{
 const read=e.target.closest("[data-read]"), fav=e.target.closest("[data-fav]");
 if(read) showBook(Number(read.dataset.read));
 if(fav){const id=Number(fav.dataset.fav);favorites.has(id)?favorites.delete(id):favorites.add(id);saveFavorites();renderBooks();notify(favorites.has(id)?"Sevimlilarga qo‘shildi":"Sevimlilardan olib tashlandi");}
});
searchInput.addEventListener("input",renderBooks);
$("#sortSelect").addEventListener("change",renderBooks);
categoryGrid.addEventListener("click",e=>{
 const btn=e.target.closest("[data-category]");if(!btn)return;
 activeCategory=btn.dataset.category;
 categoryGrid.querySelectorAll(".category-card").forEach(x=>x.classList.toggle("selected",x===btn));
 renderBooks();$("#books").scrollIntoView({behavior:"smooth"});
});
$("#resetFilters").addEventListener("click",()=>{activeCategory="Barchasi";searchInput.value="";categoryGrid.querySelectorAll(".category-card").forEach(x=>x.classList.toggle("selected",x.dataset.category==="Barchasi"));renderBooks();});
$("#favoritesOpen").addEventListener("click",()=>{
 const list=bookData.filter(b=>favorites.has(b.id));
 openModal(`<h2 id="modalTitle">♡ Sevimli kitoblar</h2>${list.length?list.map(b=>`<p>📖 <b>${b.title}</b> — ${b.author}</p>`).join(""):"<p>Hozircha sevimli kitoblaringiz yo‘q. Kitob kartasidagi ♡ tugmasini bosing.</p>"}`);
});
$("#profileOpen").addEventListener("click",()=>openModal(`<h2 id="modalTitle">Profilga xush kelibsiz</h2><p>Ismingizni kiriting — bu ma’lumot faqat ushbu brauzerda saqlanadi.</p><form class="profile-form" id="profileForm"><input id="profileName" placeholder="Ismingiz" value="${localStorage.getItem("mobileBookName")||""}" required maxlength="40"><button type="submit">Saqlash</button></form><p id="profileGreeting"></p>`));
$("#modalContent").addEventListener("submit",e=>{if(e.target.id!=="profileForm")return;e.preventDefault();const name=$("#profileName").value.trim();localStorage.setItem("mobileBookName",name);$("#profileGreeting").textContent=`Xush kelibsiz, ${name}!`;notify("Profil saqlandi");});
$("#modalClose").addEventListener("click",closeModal);
$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();searchInput.focus();}});
$("#mobileMenuBtn").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
$("#mainNav").addEventListener("click",e=>{if(e.target.closest("a"))$("#mainNav").classList.remove("open");});
saveFavorites();renderBooks();
