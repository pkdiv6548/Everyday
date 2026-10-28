(() => {
  'use strict';
  const main = document.querySelector('#story-detail');
  if (!main) return;

  const params = new URLSearchParams(window.location.search);
  const slug = (params.get('slug') || '').trim().toLowerCase();

  function showFallback(kind = 'not-found') {
    const hindi = document.documentElement.lang === 'hi';
    document.title = kind === 'unavailable'
      ? (hindi ? 'कहानी अभी उपलब्ध नहीं | Everyday Oddities' : 'Story unavailable | Everyday Oddities')
      : (hindi ? 'कहानी नहीं मिली | Everyday Oddities' : 'Story not found | Everyday Oddities');

    const section = document.createElement('section');
    section.className = 'page-hero wrap story-route-fallback';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = hindi ? 'EVERYDAY ODDITIES' : 'EVERYDAY ODDITIES';
    const heading = document.createElement('h1');
    heading.textContent = kind === 'unavailable'
      ? (hindi ? 'कहानी अभी उपलब्ध नहीं है' : 'Story unavailable right now')
      : (hindi ? 'कहानी नहीं मिली' : 'Story not found');
    const description = document.createElement('p');
    description.textContent = kind === 'unavailable'
      ? (hindi ? 'कहानी की जाँच नहीं हो सकी। कृपया बाद में फिर कोशिश करें या Discover में दूसरी कहानी चुनें।' : 'We could not check this story right now. Please try again later or choose another story from Discover.')
      : (hindi ? 'यह कहानी उपलब्ध नहीं है या लिंक गलत है। Discover में उपलब्ध कहानियाँ देखें।' : 'This story is unavailable or the link is invalid. Browse the stories available in Discover.');
    const link = document.createElement('a');
    link.className = 'text-link';
    link.href = 'explore.html';
    link.textContent = hindi ? 'Discover की कहानियाँ देखें ↗' : 'Browse Discover stories ↗';
    section.append(eyebrow, heading, description, link);
    main.replaceChildren(section);
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    showFallback();
    return;
  }

  const articleUrl = 'articles/' + encodeURIComponent(slug) + '.html';
  fetch(articleUrl, { method: 'HEAD', cache: 'no-store' })
    .then(response => {
      if (!response.ok) {
        showFallback();
        return;
      }
      window.location.replace(articleUrl);
    })
    .catch(() => showFallback('unavailable'));
})();
