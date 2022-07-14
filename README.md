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

# Awino Subgraphs

## Run the `graph-node`

## Prerequisites

Before diving into setting up a Graph Node, you need to have the following installed on your system:

Docker
Docker Compose
JQ

1.

```bash
  cd ./graph-node/docker
```

2. Build `docker-compose.yaml` file:

```bash
  ./setup.sh
```

3. Lastly, to run the Graph Node, just run the following command:

```bash
  docker-compose up
```

TheGraph exposes a GraphQL endpoint to query the events and entities within the Cronos and Awino ecosystem

Currently, there are multiple subgraphs, but additional subgraphs can be added to this repository, following the current architecture.

> Before deploying a subgraph for first time, you need to create it:

```bash
  graph create --node http://localhost:8020 awino/<<SUBGRAPH_NAME>>
```

## Subgraphs

1. **[Exchange](#)**: Tracks all Awino Exchange data with price, volume, liquidity, ...

2. **[Pairs](#)**: Tracks all Awino Pairs and Tokens.

3. **[MasterChef (v2)](#)**: Tracks data for MasterChefV2.

## Dependencies

- [Graph CLI](https://github.com/graphprotocol/graph-cli)
  - Required to generate and build local GraphQL dependencies.

```shell
npm --global install @graphprotocol/graph-cli
```

## Deployment

For any of the subgraph:

1. Run the `cd subgraphs/[subgraph]` command to move to the subgraph directory.

2. Run `npm install`

3. Run the `npm run codegen` command to prepare the TypeScript sources for the GraphQL (generated/\*).

4. Run the `npm run build` command to build the subgraph, and check compilation errors before deploying.

5. Deploy via `npm run deploy`.

&nbsp;

# Contracts [WIP]

### Deployer

Deploying contracts using 0xBf6562DB3526D4bE1d3A2B71718E132Fb8003E32 | 0xD269131e22206D29bd3568fe7CD6ba25F8c49792 [Cronos Testnet]

### ERC-20

WCRO: 0xEDc0B1d201c5d012F291A159A58BAA430c9a29e3
WETH: 0x1E967ad1929579b0248CdB437E4628558282e910
DAI: 0x8aBE5006Ac9f44f814621cB3BaE36E4b49393c69
USDC: 0xd3eef5aace2b9915736F0f493cc47Ea53e90185e // old 0x5a15259B0F448596f503978D14143fA643356552
USDT: 0xeb5b2B71b34B49bA88E18d37E58B26cD56D44870 // old 0x5279F10c5A63B05cf2C893F36ef3De26f3e42a77

wcro-weth (1/0.0001) / weth-dai (1/0.00053) / dai-awi (1/1) / cro-awi (1/0.00053)
Awino Token deployed to : 0x32563294175b84f9fc79F5Ec9f3e631FFEa65877 // shared with Steve 0x02D1a756733F2C63DF89bCcB780C0C7A22D4E8a2

### Core

INIT_CODE_PAIR_HASH: 0x9af6258bb1e0cff7f6ca3dbf0eeb03c31700df22c3a84c072472030e9260dbee
Factory deployed to : 0xCf1d959a77c1708fAF33a1a9eD0bb265d2b24447

### Periphery

Router V02 deployed to : 0x05289Bcf85770df7c7D9B280f869BadCE9D5ECCa
Multicall deployed to : 0xD6631a8788C9E34362bf435FcD3AC3b3e2B7BE13

### Farm - Pools

MasterChef deployed to : 0x05E2469A991772DC29E00C3E2616ab08A0A99f1B
MasterChefV2 deployed to : 0xC96A629fC6b9924DfA74d48Ba5FDDf39364ad9f2

Bar deployed to : 0xBCFb67f886a87551c8ef0E511d498b6b43042020 // shared with Steve AWI token 0x661fB1B0774Ae54B2f4460C71b66052bC6C05eB2
Maker deployed to : 0x377eBC8b468b3cb18207522d43f413641dda4d65

### Lending

Compotroller deployed at 0x8A666e6D424e28628C40CB0137EAE2646C3D0C5F
PriceOracle deployed at 0xAED7f7cB9dD31e99675faB8814c22b9e22757f6D // SimplePriceOracle
InterestRateModel deployed at 0x4039e22B36eE80098923180B8B8c3d893150cf1f // WhitePaperInterestRateModel

**Tokens**
awiWCRO deployed at 0xEefE35eE2810C11fEe6CDa804371e5ced5bc89Ef
