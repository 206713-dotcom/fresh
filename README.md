# <img src="fresh.svg" width="32" height="32" alt=""> Fresh

Fresh is an independent revision hub for 13 Cambridge IGCSE subjects. Find your subject, review a topic, and practise with quick questions, lessons or interactive tools.

**[Open Fresh](https://gisfresh.me/)** · [Browse the subject directory](https://gisfresh.me/#subjects) · [Privacy notice](https://gisfresh.me/privacy.html)

## Subjects

[Mathematics](#mathematics-0580) · [First Language English](#first-language-english-0500) · [Literature in English](#literature-in-english-0475) · [Biology](#biology-0610) · [Chemistry](#chemistry-0620) · [Physics](#physics-0625) · [Computer Science](#computer-science-0478) · [ICT](#information-and-communication-technology-0417) · [Design and Technology](#design-and-technology-0445) · [Geography](#geography-0460) · [History](#history-0470) · [Economics](#economics-0455) · [Business Studies](#business-studies-0264)

### Mathematics (0580)

Choose a track from Fresh Mathematics. The original quick revision on equations, trigonometry and probability is also available there. [Open Mathematics](https://gisfresh.me/subjects/mathematics.html)

- **IGCSE Maths (0580)** opens MathQuest for interactive lessons, a course level test and practice. [Open IGCSE Maths](https://gisfresh.me/subjects/igcse-maths.html)
- **Competition Maths** opens Vertex Maths for AMC, AIME, UKMT and the IMO proof track. [Open Competition Maths](https://gisfresh.me/subjects/competition-maths.html)

### First Language English (0500)

Build close-reading skills with inference, writer’s effects and summary-writing exercises. [Open First Language English](https://gisfresh.me/subjects/english-language.html)

### Literature in English (0475)

Explore how imagery, structure and stage directions shape meaning. [Open Literature in English](https://gisfresh.me/subjects/english-literature.html)

### Biology (0610)

Review osmosis, photosynthesis and inheritance with quick practice questions. [Open Biology](https://gisfresh.me/subjects/biology.html)

### Chemistry (0620)

Quilio Chemistry has topic lessons, animated films, interactive demonstrations and practice questions. [Open Quilio Chemistry](https://gisfresh.me/subjects/chemistry.html)

### Physics (0625)

Geodesic Physics has topic lessons, visual explanations and interactive activities. [Open Geodesic Physics](https://gisfresh.me/subjects/physics.html)

### Computer Science (0478)

Practise binary conversions, trace tables and Boolean logic. [Open Computer Science](https://gisfresh.me/subjects/computer-science.html)

**Python with PyQuest** offers lessons, challenges, and a browser-based Code Lab. The Fresh edition saves progress and runs code on the device. MathQuest, Vertex Maths and PyQuest were created by `linze933-spec`. [Open Python](https://gisfresh.me/subjects/python.html)

### Information and Communication Technology (0417)

Review spreadsheet references, databases and digital security. [Open ICT](https://gisfresh.me/subjects/ict.html)

### Design and Technology (0445)

RM Revise covers Paper 1 Product Design and Paper 3 Resistant Materials with lessons, a 3D workshop, quizzes and flashcards. Alexey Lykosov created and maintains the site. [Open RM Revise](https://gisfresh.me/subjects/design-and-technology/) · [RM Revise on GitHub](https://github.com/PENGUINPLAZE/RM_REVISION)

### Geography (0460)

Practise calculating population change, explaining river processes and reading map scales. [Open Geography](https://gisfresh.me/subjects/geography.html)

### History (0470)

Practise explaining causes, evaluating sources and comparing historical arguments. [Open History](https://gisfresh.me/subjects/history.html)

### Economics (0455)

Use syllabus notes, flashcards, exam practice, study recommendations and revision games. [Open Economics](https://gisfresh.me/subjects/economics.html)

### Business Studies (0264)

Work through Paper 1 questions, Paper 2 case studies and interactive lessons. Track topics in the checklist or test your recall in Boss Battle. [Open Business Studies](https://gisfresh.me/subjects/business.html?open=overview) · [Checklist](https://gisfresh.me/subjects/business.html?open=checklist) · [Boss Battle](https://gisfresh.me/subjects/business.html?open=boss-battle)

## Progress and privacy

GIS Points are shared across Fresh subjects in the current browser. You can earn them through lessons and practice and spend them in subject shops. Fresh brings over saved Business, MathQuest, PyQuest and RM Revise balances from this browser once. Subject backups keep study data and gear separate from the shared balance.

Business Studies, Economics and PyQuest save progress in the current browser. Business Studies and Economics can export a progress CSV. In PyQuest or MathQuest, use Local profile to download or restore a backup. Vertex Maths has backup tools under My progress. RM Revise offers local sync links. Progress from an old site address can be brought across using those tools.

## Run Fresh locally

From the repository root, start a local server with Python 3.

```sh
python -m http.server 8000
```

Open [localhost:8000](http://localhost:8000/). All Fresh subject apps are served as static files from this repository. The Maths tracks open MathQuest and Vertex Maths. The Design and Technology card opens RM Revise.

Run `node build.mjs` to assemble a static `dist/` folder.

## Project files

- [Homepage](index.html), [homepage styling](home.css), [directory search](search.js) and [subject data](subjects.json)
- [Business Studies source](subjects/business/) and [development guide](subjects/business/README.md)
- [Economics source](subjects/economics/), [Chemistry source](subjects/chemistry/) and [Physics source](subjects/physics/)
- [Custom domain configuration](CNAME) for GitHub Pages

Check the official syllabus for your exam year. [Cambridge IGCSE subject directory](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-upper-secondary/cambridge-igcse/subjects/)
