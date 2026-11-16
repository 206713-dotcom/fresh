# Study Commons

An independent IGCSE study hub with a homepage and 12 dedicated Cambridge IGCSE subject pages. Each page includes three starter revision topics, original practice questions and worked or suggested answers.

## Open the site

Open `index.html` in a browser. The site runs without a server or dependencies. To use GitHub Pages, select **Deploy from a branch** in **Settings → Pages**, then choose **main** and **/ (root)**.

## Edit subjects

Edit `subjects.json` and run `python build.py` with Python 3. The script regenerates `index.html` and the pages under `subjects/`. Commit the updated data and generated pages together. Shared styling lives in `style.css` and homepage filtering lives in `search.js`.

The subject codes follow the [Cambridge IGCSE subject directory](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-upper-secondary/cambridge-igcse/subjects/). Use the syllabus for your exam year to check full coverage.
