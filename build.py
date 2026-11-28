from html import escape
from json import loads
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SUBJECTS = loads((ROOT / "subjects.json").read_text(encoding="utf-8-sig"))
CAMBRIDGE = "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-upper-secondary/cambridge-igcse/subjects/"
GROUPS = {
    "Maths & technology": "technology",
    "Sciences": "science",
    "English & humanities": "humanities",
    "Business & economics": "business",
}


HOME_CONTACTS = """  <address class="home-contacts" id="contact" aria-labelledby="contact-title">
    <strong id="contact-title">Team &amp; general contacts</strong>
    <a href="mailto:206713@gardenschool.edu.my">Junyi · 206713@gardenschool.edu.my</a>
    <a href="mailto:206058@gardenschool.edu.my">Lucas · 206058@gardenschool.edu.my</a>
    <a href="contacts.html#contact">Meet the team <span aria-hidden="true">→</span></a>
    <a href="contacts.html#subjects">Subject contacts <span aria-hidden="true">→</span></a>
  </address>
"""


def page(title, description, main, prefix="", script=""):
    is_home = not prefix
    brand = "Fresh"
    logo_size = 40 if is_home else 34
    mark = f'<img src="{prefix}fresh.svg" width="{logo_size}" height="{logo_size}" alt="">'
    home_assets = '<link rel="stylesheet" href="home.css">\n' if is_home else ""
    body = '<body class="fresh-home">' if is_home else '<body>'
    contacts = HOME_CONTACTS if is_home else ""
    home_links = (
        '    <a href="contacts.html">About Us &amp; Contacts</a>\n'
        '    <a href="subjects/science.html">Science hub</a>\n'
        if is_home else ""
    )
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{escape(description)}">
<title>{escape(title)} | {brand}</title>
<link rel="stylesheet" href="{prefix}style.css">
<link rel="stylesheet" href="{prefix}gis-points.css?v=3">
<script src="{prefix}gis-points.js?v=5"></script>
<link rel="icon" href="{prefix}fresh.svg" type="image/svg+xml">
{home_assets}{script}
</head>
{body}
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <nav class="wrap topbar" aria-label="Main navigation">
    <a class="brand" href="{prefix or './'}" aria-label="Fresh homepage">{mark} {brand}</a>
{home_links}    <a href="{prefix}index.html#subjects">All subjects <span aria-hidden="true">↗</span></a>
  </nav>
</header>
<main id="main" class="wrap">{main}</main>
<footer class="wrap footer">
  <span>{brand} · Independent IGCSE revision</span>
  <a href="{CAMBRIDGE}">Cambridge subject directory ↗</a>
  <a href="{prefix}privacy.html">Privacy notice</a>
{contacts}</footer>
</body>
</html>
"""


def subject_href(subject, prefix=""):
    url = subject[7].get("url") if len(subject) > 7 else None
    if url and url.startswith(("https://", "http://")):
        return url
    return prefix + (url or f"{subject[0]}.html")


def subject_card(subject):
    _, name, code, group, symbol, description, _ = subject[:7]
    aliases = ""
    label = "Start revising"
    arrow = "→"
    if len(subject) > 7:
        link = subject[7]
        aliases = f' data-aliases="{escape(link["aliases"])}"'
        label = link["label"]
        if link.get("url", "").startswith(("https://", "http://")):
            arrow = "↗"
    return f"""<li class="card {GROUPS[group]}" data-group="{GROUPS[group]}"{aliases}>
  <a href="{escape(subject_href(subject, "subjects/"))}">
    <span class="card-top"><span class="symbol" aria-hidden="true">{escape(symbol)}</span><span class="code">{code}</span></span>
    <h3>{escape(name)}</h3>
    <p>{escape(description)}</p>
    <span class="card-link">{escape(label)} <span aria-hidden="true">{arrow}</span></span>
  </a>
</li>"""


def home():
    filters = "".join(f'<option value="{value}">{escape(label)}</option>' for label, value in GROUPS.items())
    cards = "\n".join(subject_card(subject) for subject in SUBJECTS)
    return f"""
<section class="hero">
  <div class="hero-copy">
    <p class="eyebrow"><span></span> THE IGCSE STUDY HUB</p>
    <h1>A fresh take<br>on <em>revision.</em></h1>
    <p>Find clear revision notes and quick practice questions for {len(SUBJECTS)} IGCSE subjects.</p>
    <div class="hero-actions">
      <a class="button" href="#subjects">Explore subjects <span aria-hidden="true">↓</span></a>
      <a class="python-link" href="subjects/python.html">Practise Python <span aria-hidden="true">→</span></a>
      <a class="home-points-guide" href="points.html">How to earn points <span aria-hidden="true">→</span></a>
    </div>
  </div>
  <div class="hero-art" aria-hidden="true">
    <div class="art-grid"></div>
    <div class="art-tile"><img src="fresh.svg" width="192" height="192" alt=""></div>
    <span class="art-index"><b>{len(SUBJECTS)}</b><span>IGCSE<br>SUBJECTS</span></span>
  </div>
</section>
<section class="directory" id="subjects" aria-labelledby="directory-title">
  <div class="section-top">
    <div><p class="eyebrow">SUBJECT DIRECTORY</p><h2 id="directory-title">What are you studying?</h2></div>
    <span class="count" id="count" aria-live="polite">{len(SUBJECTS)} subjects</span>
  </div>
  <div class="filters" hidden>
    <label>Search subjects <input type="search" id="search" placeholder="Try biology or 0610"></label>
    <label>Subject group <select id="group"><option value="">All groups</option>{filters}</select></label>
  </div>
  <p id="empty" hidden>No subjects match. Try another name, syllabus code or group.</p>
  <ul class="grid">{cards}</ul>
</section>
"""


def topic_card(index, topic):
    title, note, question, answer = map(escape, topic)
    return f"""<article class="topic" id="topic-{index}">
  <p class="eyebrow">TOPIC {index:02}</p>
  <h3>{title}</h3>
  <p>{note}</p>
  <div class="practice"><strong>Quick practice</strong><p>{question}</p>
    <details><summary>Reveal answer</summary><p>{answer}</p></details>
  </div>
</article>"""


def subject_page(subject, next_subject):
    if len(subject) > 7 and "url" in subject[7]:
        return
    slug, name, code, group, symbol, description, topics = subject[:7]
    if slug in {"biology", "chemistry", "computer-science", "economics", "english-language", "mathematics", "physics"}:
        return
    links = "".join(f'<li><a href="#topic-{index}">{escape(topic[0])}</a></li>'
                    for index, topic in enumerate(topics, 1))
    cards = "\n".join(topic_card(index, topic) for index, topic in enumerate(topics, 1))
    main = f"""
<a class="back" href="../index.html#subjects">← All subjects</a>
<section class="subject-hero {GROUPS[group]}">
  <div><p class="eyebrow">{escape(group)} · CAMBRIDGE {code}</p>
  <h1>{escape(name)}</h1><p>{escape(description)}</p></div>
  <span class="symbol" aria-hidden="true">{escape(symbol)}</span>
</section>
<div class="study-layout">
  <nav class="contents" aria-label="On this page">
    <p class="eyebrow">ON THIS PAGE</p><ol>{links}</ol>
    <a href="{CAMBRIDGE}">Find your syllabus ↗</a>
  </nav>
  <section class="study" aria-labelledby="revision">
    <h2 id="revision">Revision notes</h2>
    <p>Try each question before revealing the answer. Check your exam-year syllabus for the full topic list.</p>
    {cards}
    <a class="button next" href="{escape(subject_href(next_subject))}">Next subject · {escape(next_subject[1])} <span aria-hidden="true">→</span></a>
  </section>
</div>
"""
    (ROOT / "subjects" / f"{slug}.html").write_text(page(name, description, main, "../"), encoding="utf-8")


if __name__ == "__main__":
    (ROOT / "subjects").mkdir(exist_ok=True)
    (ROOT / "index.html").write_text(
        page("IGCSE study hub", f"Revision notes and practice across {len(SUBJECTS)} IGCSE subjects.",
             home(), script='<script defer src="search.js"></script>'),
        encoding="utf-8",
    )
    for index, subject in enumerate(SUBJECTS):
        subject_page(subject, SUBJECTS[(index + 1) % len(SUBJECTS)])
