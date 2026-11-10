# featfromfalling.com

Static site for featfromfalling.com

## Development

Make sure you have [Docker](https://docs.docker.com/install/) installed.

Install the workspace dependencies (also required because the bind mount covers the container's installed dependencies):

```sh
docker compose run --rm --entrypoint npm gulp install
```

Run the container to build the site, watch for changes in `src/`, and serve it at http://localhost:3000:

```sh
docker compose up --build
```

Get a command line within the container using:

```
docker compose exec gulp bash
```

From this command prompt, you can run all your regular [gulp](https://gulpjs.com/) commands.

## Production build

With the development service running, compile a fresh production build:

```sh
docker compose exec gulp gulp build
```

To build without starting the development server (after installing dependencies as above):

```sh
docker compose run --rm gulp build
```

The build recreates `dist/`, renders the HTML templates, compiles compressed CSS, copies JavaScript, images and `CNAME`, and adds revision hashes to CSS and JavaScript references. Edit files in `src/`, not the generated `dist/` directory. There is no separate production mode; `gulp build` is the production build task.

## Push to GitHub Pages

After building and verifying `dist/`, publish it with:

```sh
python3 ghp-import.py -p ./dist/
```

This imports `dist/` to the local `gh-pages` branch and pushes it to `origin`.
