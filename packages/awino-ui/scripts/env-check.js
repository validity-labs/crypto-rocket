/* global Set */
const isURL = require('validator/lib/isURL');
const yup = require('yup');

// only for test purposes install dotenv for this
// require('dotenv').config({ path: '../../../extra/config/awino-ui/.env.development' })

const envValidator = {
  prepare() {
    yup.setLocale({
      mixed: {
        required: 'Required variable',
      },
    });

    function validateUrl(message = 'Invalid URL address') {
      return this.test('url', message, (value) => {
        // allow url without tld (top level domain)
        return isURL(value, { require_tld: false });
      });
    }

    yup.addMethod(yup.string, 'customUrl', validateUrl);
  },
  log(text/* , color = '\x1b[31m' */) {
    console.error(/* `${color}%s\x1b[0m`, */ text);
  },
  report(errors) {
    const log = this.log;
    const prefix = `[ENV-CHECK][ERROR]`;

    log(`${prefix} Missing/invalid required environment variables.`);
    if (errors.known.length) {
      log(`${prefix}  Known variables (${errors.known.length}):`/* , '\x1b[33m' */);
      log(`${prefix}    ${errors.known.map(({ key, msgs }) => `${key} - ${msgs.join(', ')}`).join(`\n${prefix}    `)}`/* , '\x1b[33m' */);
    }
    if (errors.unknown.length) {
      log(`${prefix}  Unknown variables (${errors.unknown.length}):`/* , '\x1b[33m' */);
      log(`${prefix}    ${errors.unknown.map(({ key, msgs }) => `${key} - ${msgs.join(', ')}`).join(`\n${prefix}]    `)}`/* , '\x1b[33m' */);
    }

    throw new Error(`[ENV-CHECK] Missing/invalid required environment variables. Check log above.`);
  },
  start() {
    this.prepare();
    const prefixWhitelist = ['NEXT_PUBLIC', 'NEXT_PRIVATE'];

    const keyValidatorMap = {
      NEXT_PUBLIC_BASE_DOMAIN: yup.string().customUrl().required(),
      NEXT_PUBLIC_ETHERSCAN_API_KEY: yup.string().required(),
      NEXT_PUBLIC_CHAIN_ID: yup.number().required(),
      NEXT_PRIVATE_SOURCE_MAP: yup.boolean().required(),
      NEXT_PRIVATE_SUBGRAPH_URL: yup.string().customUrl().required(),
    };

    const defaultValidator = yup.string().required();

    const errors = {
      known: [],
      unknown: [],
    };

    Array.from(
      new Set(
        Object.keys(process.env)
          .filter((f) => prefixWhitelist.some((s) => f.startsWith(s)))
          .concat(Object.keys(keyValidatorMap)),
      ),
    ).map((key) => {
      const isKnown = Object.prototype.hasOwnProperty.call(keyValidatorMap, key);
      try {
        (isKnown ? keyValidatorMap[key] : defaultValidator).validateSync(process.env[key]);
      } catch (errs) {
        const newErrors =
          errs instanceof yup.ValidationError
            ? errs.errors || ['Unknown error']
            : ['Variable is not defined in process.env'];

        errors[isKnown ? 'known' : 'unknown'].push({ key, msgs: newErrors });
      }
    });

    if (errors.known.length || errors.unknown.length) {
      this.report(errors);
    }
  },
};

envValidator.start();
