const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (toggle && navigation) {
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('open', open);
    toggle.textContent = open ? 'Închide' : 'Meniu';
  });
  navigation.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
  function closeMenu() { navigation.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.textContent='Meniu'; }
}
const form = document.querySelector('#inquiry');
if (form) {
  const submit = form.querySelector('button[type="submit"]');
  const contact = form.querySelector('[name="contact"]');
  const validateContact = () => {
    const value = contact.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || (/^\+?[\d\s().-]+$/.test(value) && value.replace(/\D/g,'').length >= 9 && value.replace(/\D/g,'').length <= 15);
    contact.setCustomValidity(valid ? '' : 'Introdu un număr de telefon valid sau o adresă de email validă.');
  };
  contact.addEventListener('input', validateContact);
  for (const [name,min] of [['name',1],['message',10]]) {
    const field = form.elements.namedItem(name);
    field.addEventListener('input', () => field.setCustomValidity(field.value.trim().length >= min ? '' : `Completează acest câmp cu cel puțin ${min} caractere, fără spațiile de la margini.`));
  }
  submit.disabled = false;
  form.addEventListener('submit', e => {
    e.preventDefault();
    validateContact();
    for (const name of ['name','message']) form.elements.namedItem(name).dispatchEvent(new Event('input'));
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    if(values.get('website')) return;
    const text = `Bună ziua,\n\nDoresc informații despre: ${values.get('service')}.\nNume: ${values.get('name').trim()}\nContact: ${values.get('contact').trim()}\nLocalitate: ${values.get('locality').trim() || 'De discutat'}\n\n${values.get('message').trim()}\n`;
    document.querySelector('#draft-text').value = text;
    document.querySelector('#email-draft').href = 'mailto:ramivladinstal@yahoo.ro?subject=' + encodeURIComponent('Solicitare: ' + values.get('service')) + '&body=' + encodeURIComponent(text);
    const result = document.querySelector('#draft');
    result.hidden = false;
    result.focus();
  });
  document.querySelector('#copy-draft').addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try { await navigator.clipboard.writeText(document.querySelector('#draft-text').value); status.textContent = 'Mesaj copiat. Îl poți lipi în aplicația de email.'; }
    catch { status.textContent = 'Copierea automată nu este disponibilă. Selectează și copiază textul de mai sus.'; document.querySelector('#draft-text').select(); }
  });
}
