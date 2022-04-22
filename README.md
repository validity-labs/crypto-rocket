## Yarn, NPM

Yarn was replaced with npm due to deployment issues.

## Commit convention

We are using [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) messages to keep everything clean. [Commitlint](https://commitlint.js.org/#/) is used to verify commit message.

Commitlint rules (in order of `commitlint.config.js`):
[config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)
[config-lerna-scopes](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-lerna-scopes)

You have option to commit as usual, in this case `husky` `commit-msg` will trigger check using
[@commitlint/cli](https://www.npmjs.com/package/@commitlint/cli), [docs](https://commitlint.js.org/#/reference-cli) or using interactive method by calling `yarn commit` which will use [@commitlint/prompt-cli](https://www.npmjs.com/package/@commitlint/prompt-cli), [docs](https://commitlint.js.org/#/guides-use-prompt) under the hood.

## Initial configuration (run once)

### Prerequisites

- For smooth development experience it is suggested to use [nvm](https://github.com/nvm-sh/nvm), which allows to choose proper node version which is defined in `.nvmrc`
- Install [yarn](https://classic.yarnpkg.com/lang/en/) package manager (classic version 1)

```bash
  # choose proper node version, nvm should be already installed
  nvm use
   # from root directory
  npm install
  # from packages/awino-ui directory; --legacy-peer-deps is required for cypress-image-snapshot package
  npm install --legacy-peer-deps

```

```bash
  # initialize husky https://typicode.github.io/husky/#/
  npm run prepare
```

## Local development

_Enviroment variables can be injected using .env.local file inside `packages/awino-ui` folder. For initial template use `extra/config/awino-ui/.env.development`_

```bash
  # start development server locally
  npm run start
```

## Local development with docker

_Enviroment variables are in `extra/config/awino-ui/.env.development`_

```bash
  # start development server locally in docker container
  docker-compose up
```

## Notes

- Bypass husky hooks ([docs](https://typicode.github.io/husky/#/?id=bypass-hooks))

  You can bypass pre-commit and commit-msg hooks using Git -n/--no-verify option:

  ```bash
    git commit -m "yolo!" --no-verify
  ```

  For Git commands that don't have a --no-verify option, you can use HUSKY environment variable:

  ```bash
    HUSKY=0 git push # yolo!
  ```
