// Supply the verified business number in international format before enabling direct contact.
const CONTACT_PHONE = '';
const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open); });
navigation.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.setAttribute('aria-expanded','false'); navigation.classList.remove('open'); }));
document.querySelectorAll('[data-service]').forEach(a => a.addEventListener('click', () => {document.querySelector('#service').value = a.dataset.service;}));
const dialog = document.querySelector('#contact-dialog');
const preview = document.querySelector('#message-preview');
const copy = document.querySelector('#copy-message');
const send = document.querySelector('#send-message');
function showContact(kind, message = '') {
 if (CONTACT_PHONE && kind === 'phone') { window.location.href = 'tel:+' + CONTACT_PHONE; return; }
 if (CONTACT_PHONE && kind === 'whatsapp') { window.open('https://wa.me/' + CONTACT_PHONE + '?text=' + encodeURIComponent('Bună ziua, Cristi! Aș dori să discutăm despre o lucrare în București / Ilfov.'), '_blank', 'noopener'); return; }
 document.querySelector('#dialog-title').textContent = message ? 'Cererea ta este pregătită.' : kind === 'phone' ? 'Contact telefonic' : 'Contact pe WhatsApp';
 document.querySelector('#dialog-description').textContent = CONTACT_PHONE ? 'Verifică mesajul, apoi continuă pe WhatsApp pentru a-l trimite.' : 'Acesta este un demo de prezentare. Numărul lui Cristi urmează să fie adăugat. Nu a fost trimisă nicio solicitare.';
 preview.hidden = !message; preview.value = message; copy.hidden = !message; send.hidden = !message || !CONTACT_PHONE;
 if (CONTACT_PHONE && message) send.href = 'https://wa.me/' + CONTACT_PHONE + '?text=' + encodeURIComponent(message);
 document.querySelector('#dialog-status').textContent = ''; dialog.showModal();
}
document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => showContact(button.dataset.contact)));
document.querySelectorAll('dialog').forEach(d => {d.querySelector('.close-dialog').addEventListener('click', () => d.close()); d.addEventListener('click', e => {if(e.target === d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
document.querySelector('#privacy-button').addEventListener('click', () => document.querySelector('#privacy-dialog').showModal());
document.querySelector('#quote-form').addEventListener('submit', e => {e.preventDefault();const data = new FormData(e.currentTarget);const message = `Bună ziua, Cristi! Aș dori o ofertă.\n\nNume: ${data.get('name').trim()}\nTelefon: ${data.get('phone').trim()}\nLocație: ${data.get('location').trim()}\nServiciu: ${data.get('service')}\n\nDetalii: ${data.get('details').trim()}`;showContact('quote',message);});
copy.addEventListener('click', async () => {try{await navigator.clipboard.writeText(preview.value);document.querySelector('#dialog-status').textContent='Cererea a fost copiată. Nu a fost trimisă.';}catch{preview.focus();preview.select();document.querySelector('#dialog-status').textContent='Selectează și copiază mesajul de mai sus.';}});
