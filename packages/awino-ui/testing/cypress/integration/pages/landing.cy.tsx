// included to prevent "ResizeObserver loop limit exceeded" error, probably raised by swiper usage
// const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
// Cypress.on('uncaught:exception', (err) => {
//   /* returning false here prevents Cypress from failing the test */
//   if (resizeObserverLoopErrRe.test(err.message)) {
//     return false;
//   }
// });

describe('Root Page', () => {
  it('should have proper sections', () => {
    // Start from the index page
    // cy.visit('http://localhost:3000/');
    cy.visit('/');

    cy.url().should('include', '/');

    cy.get('main').within(() => {
      const section = (n: number) => cy.get(`>section:nth-child(${n})`);

      // TotalSection ONLY WHEN CONNECTED

      // StatsSection
      section(2).find('h1').should('have.length', 1);
      section(2).find('.card').should('have.length', 4);

      // InfoSection
      section(3).find('h2').should('have.length', 1);
      section(3).find('p').should('have.length', 7);
      section(3).find('[role="tabpanel"]').should('have.length', 6);

      // BenefitSection
      section(4).find('h2').should('have.length', 1);
      section(4).find('h3').should('have.length', 5);
      section(4).find('p').should('have.length', 6);
      section(4).find('.swiper').should('have.length', 1);
      section(4).find('.swiper-slide').should('have.length', 5);

      // GuideSection
      section(5).find('h2').should('have.length', 1);
      section(5).find('h3').should('have.length', 3);
      section(5).find('p').should('have.length', 9);
      section(5).find('img').should('have.length', 6);

      // AssetSection
      // section(6).find('h2').should('have.length', 1);
      // section(6).find('p').should('have.length', 6);
      // section(6).find('img').should('have.length', 8);

      // FAQSection
      section(6).find('h2').should('have.length', 1);
      section(6).find('p').should('have.length.gte', 2);
      section(6).find('.MuiAccordion-root').should('have.length', 5);

      // JoinSection ONLY WHEN CONNECTED
    });
  });
});

export {};
