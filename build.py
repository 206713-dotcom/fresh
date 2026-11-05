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


def page(title, description, main, prefix="", script=""):
    is_home = not prefix
    brand = "Fresh" if is_home else "Study Commons"
    mark = ('<img src="fresh.svg" width="40" height="40" alt="">' if is_home
            else '<span class="logo" aria-hidden="true">✦</span>')
    home_assets = (
        '<link rel="stylesheet" href="home.css">\n'
        '<link rel="icon" href="fresh.svg" type="image/svg+xml">\n'
        if is_home else ""
    )
    body = '<body class="fresh-home">' if is_home else '<body>'
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{escape(description)}">
<title>{escape(title)} | {brand}</title>
<link rel="stylesheet" href="{prefix}style.css">
{home_assets}{script}
</head>
{body}
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <nav class="wrap topbar" aria-label="Main navigation">
    <a class="brand" href="{prefix}index.html">{mark} {brand}</a>
    <a href="{prefix}index.html#subjects">All subjects <span aria-hidden="true">↗</span></a>
  </nav>
</header>
<main id="main" class="wrap">{main}</main>
<footer class="wrap footer">
  <span>{brand} · Independent IGCSE revision</span>
  <a href="{CAMBRIDGE}">Cambridge subject directory ↗</a>
</footer>
</body>
</html>
"""


def subject_card(subject):
    slug, name, code, group, symbol, description, _ = subject
    return f"""<li class="card {GROUPS[group]}" data-group="{GROUPS[group]}">
  <a href="subjects/{slug}.html">
    <span class="card-top"><span class="symbol" aria-hidden="true">{escape(symbol)}</span><span class="code">{code}</span></span>
    <h3>{escape(name)}</h3>
    <p>{escape(description)}</p>
    <span class="card-link">Start revising <span aria-hidden="true">→</span></span>
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
    <p>Find clear revision notes and quick practice questions for 12 IGCSE subjects.</p>
    <a class="button" href="#subjects">Explore subjects <span aria-hidden="true">↓</span></a>
  </div>
  <div class="hero-art" aria-hidden="true">
    <div class="art-grid"></div>
    <div class="art-tile"><img src="fresh.svg" width="192" height="192" alt=""></div>
    <span class="art-index"><b>12</b><span>IGCSE<br>SUBJECTS</span></span>
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
    slug, name, code, group, symbol, description, topics = subject
    if slug == "economics":
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
    <a class="button next" href="{next_subject[0]}.html">Next subject · {escape(next_subject[1])} <span aria-hidden="true">→</span></a>
  </section>
</div>
"""
    (ROOT / "subjects" / f"{slug}.html").write_text(page(name, description, main, "../"), encoding="utf-8")


if __name__ == "__main__":
    (ROOT / "subjects").mkdir(exist_ok=True)
    (ROOT / "index.html").write_text(
        page("IGCSE study hub", "Revision notes and practice across 12 IGCSE subjects.",
             home(), script='<script defer src="search.js"></script>'),
        encoding="utf-8",
    )
    for index, subject in enumerate(SUBJECTS):
        subject_page(subject, SUBJECTS[(index + 1) % len(SUBJECTS)])
