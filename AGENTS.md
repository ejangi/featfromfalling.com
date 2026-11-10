# Feat From Falling

- Keep the site a simple static site with few dependencies. Prefer the Docker Compose environment for development.
- Edit `src/`, not generated `dist/`: `index.mustache` includes `sections/` partials and uses `site.json`; styles, scripts, images, and `CNAME` also live under `src/`.
- Run `docker compose up --build` for the Gulp build and watcher, served at http://localhost:3000. The project bind mount covers the image's installed dependencies, so the workspace needs a compatible `node_modules` (for example, run `docker compose run --rm --entrypoint npm gulp install` when needed).
- Run `docker compose exec gulp gulp build` for a fresh build while the service is running. The build cleans `dist/`, copies assets and `CNAME`, and revisions CSS and JavaScript references.
- Production is GitHub Pages. After verifying a fresh build, `python3 ghp-import.py -p ./dist/` imports `dist/` to the local `gh-pages` branch and pushes it to `origin`; use this only when publishing is requested.
