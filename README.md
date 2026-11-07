# Daniel Kojo Megbenu · Portfolio

Personal portfolio for a DevOps and Cloud Engineer. Built with React, Vite and Tailwind CSS, hosted on AWS (S3 + CloudFront).

## Run it locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint     # oxlint
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Update content

All content lives in `src/data/`, so updating the site never means editing components.

| File | What it holds |
|---|---|
| `profile.json` | Name, title, tagline, contact links, availability |
| `experience.json` | Roles and dates for the experience timeline |
| `skills.json` | Tools grouped by area |
| `projects.json` | Project cards and case studies. Add a project by adding one entry. |

Diagrams go in `src/assets/diagrams/` and screenshots in `src/assets/screenshots/`.

## Live pipeline diagram

The EKS case study (`/projects/eks-gitops-platform`) shows an animated pipeline built from `src/data/pipeline.json`. Without a repo it plays a simulated run.

To show real GitHub Actions runs, set `pipelineRepo` on that project in `projects.json` to a **public** repo, for example `"dkojo/eks-gitops-platform"`. The page then reads the latest workflow run from the GitHub API, polling every 2 minutes, or every 20 seconds while a run is in progress.

Each diagram node with a `match` value lights up from the workflow step whose name contains that word, so name the steps to include them:

| Node | Step name must include |
|---|---|
| GitHub | `checkout` |
| Gitleaks | `gitleaks` |
| SonarQube | `sonar` |
| Maven build | `maven` |
| Docker Buildx | `docker` |
| Trivy | `trivy` |
| Cosign + Syft | `cosign` |
| Amazon ECR | `ECR` |
| GitOps repo | `digest` |
| Slack | `slack` |

Matching starts at the beginning of a word and ignores case, so `Push image to ECR` and `SonarQube scan` both work.

## Structure

```
src/
├── components/   Layout, navigation, theme toggle, shared UI
├── pages/        Home, About, Skills, Projects, ProjectDetail, Resume, Contact, NotFound
├── data/         JSON content files
└── assets/       diagrams and screenshots
```

## Build

`npm run build` makes the client bundle, then pre-renders every route to static HTML
(`dist/about/index.html`, `dist/projects/<id>/index.html` …) plus `404.html` and `robots.txt`.
Pages load with their content, title and description already in the HTML, and React takes over in the browser.

Build-time environment variables:

| Variable | What it does |
|---|---|
| `SITE_URL` | The live site address, such as `https://danielmegbenu.com`. Adds `sitemap.xml`, canonical URLs and the absolute link-preview image that LinkedIn and X need. |
| `VITE_FORMSPREE_ID` | The Formspree form ID. With it, the contact form sends messages; without it, the form opens the visitor's email app. |

The link-preview image is `public/og-image.png` (1200×630).

## Deployment

Static build in `dist/` uploaded to a private S3 bucket and served through CloudFront over HTTPS. A GitHub Actions workflow deploys on every push to `main`.
