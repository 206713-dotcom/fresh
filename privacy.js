const viewLinks = [...document.querySelectorAll('.privacy-views a')];
const notice = document.getElementById('notice');
const schools = document.getElementById('for-schools');

function showPrivacyView() {
  const target = document.getElementById(location.hash.slice(1));
  const active = schools.contains(target) ? schools : notice;
  notice.hidden = active !== notice;
  schools.hidden = active !== schools;
  for (const link of viewLinks) {
    if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  if (target === active) document.getElementById('privacy-views').scrollIntoView();
  else if (active.contains(target)) target.scrollIntoView();
}

window.addEventListener('hashchange', showPrivacyView);
showPrivacyView();
