# Dev Stack Dashboard

Provides a view into the state of Git repositories and Docker containers to make
it easier to ensure your stack is in the right place while developing stacks that
include microservices.

The app makes some assumptions about the structure of the stack, starting with
requiring a path to a repository that contains a `docker-compose.yml` and an optional
`docker-compose-override.yml`. It will read these files to construct a list of the
services in your stack and roughly identify their sources.

ie
- has build context and volumes = mounted local source
- has build context = built from local source
- no build context = pulled image

Build context paths are used to get the status of their Git repositories.

`docker-compose ps` is run to get the status of containers.

The app will run `git fetch` on repos that have not been fetched for 15 minutes.

## Development

Clone the repo, install the deps, and start the app..

```bash
yarn
yarn start
```

