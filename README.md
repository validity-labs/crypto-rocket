## Commit convention

We are using [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) messages to keep everything clean. [Commitlint](https://commitlint.js.org/#/) is used to verify commit message.

Commitlint rules (in order of `commitlint.config.js`):
[config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)
[config-lerna-scopes](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-lerna-scopes)

You have option to commit as usual, in this case `husky` `commit-msg` will trigger check using
[@commitlint/cli](https://www.npmjs.com/package/@commitlint/cli), [docs](https://commitlint.js.org/#/reference-cli) or using interactive method by calling `yarn commit` which will use [@commitlint/prompt-cli](https://www.npmjs.com/package/@commitlint/prompt-cli), [docs](https://commitlint.js.org/#/guides-use-prompt) under the hood.

## Initial configuration (run once)

```bash
  # initialize husky
  yarn prepare
```

```bash
  yarn
```
