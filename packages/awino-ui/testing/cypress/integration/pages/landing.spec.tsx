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

      // StatsSection
      section(1).find('.badges li img').should('have.length', 4);
      section(1).find('h1').should('have.length', 1);
      section(1).find('.card').should('have.length', 4);

      // InfoSection
      section(2).find('h2').should('have.length', 1);
      section(2).find('p').should('have.length', 1);
      section(2).find('img').should('have.length', 2);

      // BenefitSection
      section(3).find('h2').should('have.length', 1);
      section(3).find('h3').should('have.length', 3);
      section(3).find('p').should('have.length', 4);

      // GuideSection
      section(4).find('h2').should('have.length', 1);
      section(4).find('h3').should('have.length', 3);
      section(4).find('p').should('have.length', 9);
      section(4).find('img').should('have.length', 6);

      // AssetSection
      section(5).find('h2').should('have.length', 1);
      section(5).find('p').should('have.length', 1);
      section(5).find('img').should('have.length', 8);

      // FAQSection
      section(6).find('h2').should('have.length', 1);
      section(6).find('p').should('have.length.gte', 2);
      section(6).find('.MuiAccordion-root').should('have.length', 4);
    });
  });
});

export {};
