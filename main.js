const EMAIL = 'info@silealab.it'; // <-- sostituisci con l'email del negozio
const P = [
    { id: '1', nome: 'Borsa 1', cat: 'Borsa', prezzo: 100, img: 'borsa-1.png', desc: 'Borsa descrizione 1' },
    { id: '2', nome: 'Borsa 2', cat: 'Borsa', prezzo: 100, img: 'borsa-2.png', desc: 'Borsa descrizione 2' },
    { id: '3', nome: 'Borsa 3', cat: 'Borsa', prezzo: 100, img: 'borsa-3.png', desc: 'Borsa descrizione 3' },
    { id: '4', nome: 'Borsa 4', cat: 'Borsa', prezzo: 100, img: 'borsa-1.png', desc: 'Borsa descrizione 4' },
    { id: '5', nome: 'Borsa 5', cat: 'Borsa', prezzo: 100, img: 'borsa-2.png', desc: 'Borsa descrizione 5' },
    { id: '6', nome: 'Borsa 6', cat: 'Borsa', prezzo: 100, img: 'borsa-3.png', desc: 'Borsa descrizione 6' }];
const eur = n => n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
const $ = s => document.querySelector(s);
const card = p => `<article class="card"><button class="ph" data-id="${p.id}" aria-label="Ingrandisci ${p.nome}"><img src="photo/${p.img}" alt="${p.nome}" loading="lazy"></button><div class="meta"><h3>${p.nome}</h3><span>${eur(p.prezzo)}</span></div><p>${p.desc}</p><a class="lnk" href="#acquistare">Come acquistare →</a></article>`;
if ($('#grid')) {
    const draw = c => { $('#grid').innerHTML = P.filter(p => c == 'Tutte' || p.cat == c).map(card).join('') };
    $('#filters').innerHTML = ['Tutte', ...new Set(P.map(p => p.cat))].map((c, i) => `<button aria-pressed="${!i}">${c}</button>`).join('');
    $('#filters').onclick = e => {
        const b = e.target.closest('button'); if (!b) return;
        $('#filters').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x == b)); draw(b.textContent)
    };
    draw('Tutte');
    $('#grid').onclick = e => {
        const b = e.target.closest('.ph'); if (!b) return; const p = P.find(x => x.id == b.dataset.id);
        $('#lbi').src = 'photo/' + p.img; $('#lbi').alt = p.nome; $('#lbc').textContent = p.cat; $('#lbn').textContent = p.nome; $('#lbp').textContent = eur(p.prezzo); $('#lbs').textContent = p.desc; $('#lb').showModal()
    };
    $('#lbx').onclick = $('#lbl').onclick = () => $('#lb').close();
    $('#lb').onclick = e => { if (e.target == $('#lb')) $('#lb').close() };
}
const nav = $('nav'), pill = $('.pill'), links = [...nav.querySelectorAll('a')]; let cur = null;
const move = a => { links.forEach(x => x.classList.toggle('on', x == a)); pill.style.opacity = a ? 1 : 0; if (a) { pill.style.width = a.offsetWidth + 'px'; pill.style.transform = `translateX(${a.offsetLeft}px)` } };
const setCur = a => { cur = a; links.forEach(x => x.toggleAttribute('aria-current', x == a)); move(a) };
links.forEach(a => { a.onmouseenter = a.onfocus = () => move(a); a.onmouseleave = a.onblur = () => move(cur) });
const anch = links.filter(a => a.getAttribute('href')[0] == '#');
if (anch.length) {
    setCur(anch[0]);
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setCur(anch.find(a => a.hash == '#' + e.target.id)) }), { rootMargin: '-45% 0px -50% 0px' });
    anch.forEach(a => io.observe($(a.hash)))
}
addEventListener('resize', () => move(cur)); document.fonts?.ready.then(() => move(cur));
document.querySelectorAll('form[data-subject]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault(); const b = [...new FormData(f)].map(([k, v]) => k + ': ' + v).join('\n');
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(f.dataset.subject)}&body=${encodeURIComponent(b)}`;
    if (!f.nextElementSibling?.classList.contains('ok')) f.insertAdjacentHTML('afterend', '<p class="ok" role="status">Si è aperto il tuo programma di posta con il messaggio pronto: premi Invia per completare.</p>')
}));
