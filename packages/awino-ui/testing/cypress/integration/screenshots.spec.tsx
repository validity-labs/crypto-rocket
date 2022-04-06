const sizes = [
  [1920, 1080],
  [1440, 900],
  [1280, 720],
  [768, 1024],
  [320, 568],
];
const pages = [
  { name: 'landing', path: '/' },
  { name: 'market', path: '/market' },
  { name: 'market-details--dai', path: '/market/dai' },
  { name: 'swap', path: '/swap' },
  { name: 'podl', path: '/podl' },
  { name: 'dashboard', path: '/dashboard' },
  { name: 'portfolio', path: '/portfolio' },
  { name: 'contracts', path: '/contracts' },
  { name: 'analytics', path: '/analytics' },
  { name: 'earn-deposit', path: '/earn/deposit' },
  { name: 'earn-deposit--dai', path: '/earn/deposit/dai' },
  { name: 'earn-liquidity-staking', path: '/earn/liquidity-staking' },
  { name: 'borrow', path: '/borrow' },
  { name: 'borrow--dai', path: '/borrow/dai' },
];

const scrubbedElements = ['[data-test-id="AwiStatsItems-card"]', '[data-test-id="AwiChart-wrapper"]'];

describe('Visual regression tests', () => {
  sizes.forEach((size) => {
    pages.forEach(({ name, path }) => {
      it(`Should match previous screenshot '${name} Page' When '${size}' resolution`, () => {
        /* @ts-ignore */
        cy.viewport(size[0], size[1]);
        cy.visit(path);

        scrubbedElements.map((selector) => {
          cy.log('checking selector', selector);
          cy.get('body')
            .then(($body) => $body.find(selector).length > 0)
            .then((exist) => {
              if (exist) {
                cy.get(selector).invoke('attr', 'style', 'visibility: hidden');
              }
            });
        });

        // TODO WIP if wait time is about 200ms there is an issue with a font diff most probably due to the loading latency of google fonts
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);
        /* @ts-ignore */
        cy.matchImageSnapshot(`${name}-${size.join('x')}`, { blackout: scrubbedElements, capture: 'fullPage' });
      });
    });
  });
});

export {};
