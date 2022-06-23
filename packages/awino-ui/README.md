# Awino Website (Crypto Rocket)

@see https://keepachangelog.com/en/1.1.0/

## Required VSCode extensions

- https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
- https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
- https://marketplace.visualstudio.com/items?itemName=rohit-gohri.format-code-action
- https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker
- https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits

## Husky pre commit validation

Resolve path issue (`.husky/commit-msg: line 4: npx: command not found`) in SourceTree as described here: https://github.com/typicode/husky/issues/904

```
echo "export PATH="$(dirname $(which node)):$PATH"" > ~/.huskyrc
```

## Adobe XD design resources

- [Website Design](https://xd.adobe.com/view/0ef3f415-fd31-4c39-97e4-ed66cf2223ae-5ba0)

## Local development setup

In order to setup your development environment, follow the following steps:

```bash
  docker-compose up
```

UI: http://localhost:3000

## Run docker containers in production mode

```bash
  docker-compose -f docker-compose.yml up
```

## Test server

_to be updated_

## Core packages

- [React](https://reactjs.org/docs/getting-started.html)
- [Next.js](https://nextjs.org/learn/foundations/about-nextjs)
- [Redux Toolkit](https://redux-toolkit.js.org) - is a standardized way to write Redux logic (create actions and reducers, setup the store with some default middlewares like redux devtools extension).
- [MaterialUI](https://mui.com/getting-started/installation/)
- [NextI18next](https://github.com/isaachinman/next-i18next)

## Protecting pages

To make the page protected/hidden for guests and make it only accessible for users who already connected their wallet you need to set the `protected: true` flag in return object of `getServerSideProps` for each page you want to be protected.

```tsx
export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  ...
  return {
      props: {
        protected: true,
        ...
      },
    };
  });
```

### Showing connect modal on page navigation

When navigation (not reloading) to a page that is protected, if connect modal should appear automatically add the page route to `PROTECTED_ROUTES` array.

```tsx
//  src/app/constants.ts
export const PROTECTED_ROUTES = ['/new-route', '/portfolio'];
```
