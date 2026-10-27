const escapeText = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const serviceCaption = service => service.slug === 'instalatii-termice'
  ? 'Circuite și distribuție pentru încălzire în pardoseală.'
  : service.slug === 'centrale-si-pompe-de-caldura'
    ? 'Legături la instalație, în proiectul cu pompă de căldură aer–apă.'
    : 'Fotografie din portofoliul RAMIVLAD INSTAL.';

/** Content follows the shared page heading; route and SEO ownership stay in build.mjs. */
export function renderService(service, {image, button, faq}) {
  const detailImage=service.slug==='instalatii-termice'?'project-1-10':service.slug==='centrale-si-pompe-de-caldura'?'project-2-7':null;
  const lead = service.image
    ? `<figure class="service-lead"><div class="service-lead-pair">${image(service.image, serviceCaption(service), 'fetchpriority="high"', '(max-width:600px) 65vw, 55vw')}${detailImage?image(detailImage,service.slug==='instalatii-termice'?'Distribuitorul și racordurile circuitelor':'Detaliu al echipamentelor din instalația cu pompă de căldură','loading="lazy"','(max-width:600px) 40vw, 35vw'):''}</div><figcaption>${serviceCaption(service)}</figcaption></figure>`
    : `<div class="service-lead service-lead--text"><p>${escapeText(service.description)}</p><a class="text-link" href="/#contact">Descrie lucrarea sau problema ↗</a></div>`;

  return `<section class="section service-detail"><div class="wrap">
    ${lead}
    <div class="service-body">
      <div class="service-main">
        <section class="content-block" aria-labelledby="service-needs"><h2 id="service-needs">Când te putem ajuta</h2><ul class="service-needs">${service.needs.map(need => `<li>${escapeText(need)}</li>`).join('')}</ul></section>
        <section class="content-block" aria-labelledby="service-scope"><h2 id="service-scope">Ce presupune lucrarea</h2><p>${escapeText(service.solution)}</p></section>
        <section class="content-block" aria-labelledby="service-preparation"><h2 id="service-preparation">Pentru prima discuție</h2><p>${escapeText(service.prepare)}</p></section>
        <section class="service-questions" aria-labelledby="service-faq"><h2 id="service-faq">Întrebări frecvente</h2>${faq(service.faq)}</section>
      </div>
      <aside class="service-brief" aria-labelledby="service-contact">
        <p class="brief-label">Baia Mare și împrejurimi</p>
        <h2 id="service-contact">Discută lucrarea.</h2>
        <p>Spune-ne ce instalație ai și ce dorești să montezi, să înlocuiești sau să verifici.</p>
        ${button('tel:+40744577842', 'Sună: 0744 577 842')}
        <p class="brief-hours">Luni–Vineri, 08:00–17:00</p>
        <a class="text-link" href="/#contact">Pregătește un email ↗</a>
        <p class="brief-note">Pentru alte localități, confirmăm telefonic posibilitatea deplasării.</p>
      </aside>
    </div>
    <div class="section-end service-back"><a class="text-link" href="/servicii.html">← Toate serviciile</a></div>
  </div></section>`;
}

/** Only verified source scope, category and actual gallery count are presented. */
export function renderProject(project, {image, banner, services}) {
  const leadNumber=Number(project.cover.match(/-(\d+)$/)?.[1]);
  const related = project.service !== null && services[project.service]
    ? `<a class="text-link" href="/${services[project.service].slug}.html">${escapeText(services[project.service].title)} ↗</a>`
    : '<a class="text-link" href="/servicii.html#ventilatie">Despre lucrările de ventilație ↗</a>';

  return `<section class="section project-detail"><div class="wrap">
    <div class="project-overview">
      <figure class="project-lead-image"><a href="/assets/${project.cover}.jpeg" aria-label="Deschide fotografia principală: ${escapeText(project.title)}">${image(project.cover, project.title + ' — fotografie din lucrare', 'fetchpriority="high"', '(max-width:850px) 100vw, 65vw')}</a><figcaption>${escapeText(project.title)}</figcaption></figure>
      <div class="project-summary"><h2>Ce cuprinde lucrarea</h2><p>${escapeText(project.text)}</p><dl class="project-facts"><div><dt>Tipul lucrării</dt><dd>${escapeText(project.category)}</dd></div><div><dt>Documentare fotografică</dt><dd>${project.count} fotografii din lucrare</dd></div></dl>${related}</div>
    </div>
    <section class="project-photographs" aria-labelledby="project-gallery"><div class="gallery-heading"><h2 id="project-gallery">Fotografii din lucrare</h2><p>Selectează o fotografie pentru a deschide imaginea originală.</p></div>
      <div class="gallery">${Array.from({length:project.count}, (_, index) => index+1).filter(number=>number!==leadNumber).map(number => {
        const label = `${project.title}, fotografia ${number}`;
        return `<figure class="gallery-item"><a href="/assets/project-${project.id}-${number}.jpeg" aria-label="Deschide fotografia ${number}: ${escapeText(project.title)}">${image(`project-${project.id}-${number}`, label, 'loading="lazy"', '(max-width:600px) 100vw, (max-width:850px) 50vw, 45vw')}</a><figcaption>Fotografia ${number}</figcaption></figure>`;
      }).join('')}</div>
    </section>
    <div class="section-end"><a class="text-link" href="/projects.html">← Toate proiectele</a></div>
    ${banner()}
  </div></section>`;
}
