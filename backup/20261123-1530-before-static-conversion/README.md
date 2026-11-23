# <img src="fresh.svg" width="32" height="32" alt=""> Fresh

Fresh is an independent revision hub for 12 Cambridge IGCSE subjects. Find your subject, review a topic, and try practice questions with worked or suggested answers.

**[Open Fresh at gisfresh.me](https://gisfresh.me/)** · [Browse all 12 subjects](https://gisfresh.me/#subjects)

## Study tools

- **Business Studies** offers Paper 1 practice, Paper 2 case studies, and interactive lessons. Track what you’ve covered with the syllabus checklist or test your recall in Boss Battle. [Open Business Studies](https://gisfresh.me/subjects/business.html?open=overview) · [Checklist](https://gisfresh.me/subjects/business.html?open=checklist) · [Boss Battle](https://gisfresh.me/subjects/business.html?open=boss-battle)
- **Economics** has syllabus notes, flashcards, exam practice, and revision games. [Open Economics](https://gisfresh.me/subjects/economics.html)
- **Other subjects** have starter revision notes and practice questions. Search by subject name or syllabus code in the [subject directory](https://gisfresh.me/#subjects).

Business Studies and Economics save progress locally in the current browser. Students can study immediately. Use the same browser and device to continue, and keep site data to retain progress.

Open **My progress** in either subject’s main navigation to find your stats, saved answers and **Export progress CSV**. Downloads are saved to the student's device.

## Run Fresh locally

From the repository root, start a local server with Python 3. No build step, npm, or Vite is needed — both subject sites are plain files served directly.

```sh
python -m http.server 8000
```

Open [localhost:8000](http://localhost:8000/) in your browser. The two subject entries are [Economics](subjects/economics.html) and [Business Studies](subjects/business.html). `subjects/business/Business.html` and `subjects/business/index.html` remain as legacy entry points.

`node build.mjs` optionally assembles a `dist/` folder of the same static files; it only copies files and does not compile anything.

## Project files

- [Homepage](index.html), [homepage styling](home.css), and [subject data](subjects.json)
- [Economics entry](subjects/economics.html) with [plain CSS/JS source](subjects/economics/); [Business Studies entry](subjects/business.html) with its committed [static bundle](subjects/business/assets/) and [development guide](subjects/business/README.md)
- [Custom domain configuration](CNAME) for GitHub Pages

For full syllabus coverage, check the official syllabus for your exam year. [Cambridge IGCSE subject directory](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-upper-secondary/cambridge-igcse/subjects/)
