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

      // HeroSection
      section(1).find('h1').should('have.length', 1);
      section(1).find('h2').should('have.length', 1);
      section(1).find('p').should('have.length', 1);
      section(1).find('svg').should('have.length', 1);
      section(1).find('a').should('have.length', 2);

      // SlideSection for ClientSection
      section(2).find('img').should('have.length', 6);

      // IntroSection
      section(3).find('h2').should('have.length', 1);
      section(3).find('p').should('have.length', 1);
      section(3).find('img').should('have.length', 2);

      // InfoSection
      section(4).find('h2').should('have.length', 1);
      section(4).find('h3').should('have.length', 1);
      section(4).find('p').should('have.length', 1);
      section(4).find('img').should('have.length', 2);

      // BenefitSection
      section(5).find('.swiper').should('have.length', 1);
      section(5).find('.swiper-slide').should('have.length', 4);
      section(5).find('.swiper-slide img').should('have.length', 4);
      section(5).find('.swiper-slide h4').should('have.length', 4);
      section(5).find('.vl-navigation-buttons').should('have.length', 1);

      // ServiceSection
      section(6).find('.MuiTab-root').should('have.length', 4);
      section(6).find('[role="tabpanel"]').should('have.length', 4);
      section(6).find('h2').should('have.length', 4);
      section(6).find('img').should('have.length', 8);
      section(6).find('h3').should('have.length', 4);
      section(6).find('h4').should('have.length', 4);
      section(6).find('p').should('have.length', 16);
      section(6).find('a').should('have.length', 4);

      // ProductSection
      section(7).find('h2').should('have.length', 1);
      section(7).find('h3').should('have.length', 1);
      section(7).find('h4').should('have.length', 4);
      section(7).find('p').should('have.length', 5);
      section(7).find('img').should('have.length', 8);
      section(7).find('a').should('have.length', 4);

      // SlideSection for MentionsSection
      section(8).find('h2').should('have.length', 1);
      section(8).find('img').should('have.length', 6);

      // PartnerSection
      section(9).find('h2').should('have.length', 1);
      section(9).find('h3').should('have.length', 1);
      section(9).find('p').should('have.length', 1);
      section(9).find('img').should('have.length', 6);
      section(9).find('a').should('have.length', 3);

      // QuoteSection
      section(10).find('img').should('have.length', 12);
      section(10).find('h2').should('have.length', 1);
      section(10).find('h3').should('have.length', 1);
      section(10).find('.swiper').should('have.length', 2);
      section(10).find('.swiper-slide').should('have.length', 6);

      // PromoteSection
      section(11).find('h2').should('have.length', 1);
      section(11).find('h3').should('have.length', 4);
      section(11).find('p').should('have.length', 1);
      section(11).find('svg').should('have.length', 4);

      // SubscribeSection
      section(12).find('h2').should('have.length', 1);
      section(12).find('p').should('have.length', 1);
      section(12).find('form').should('exist');
      section(12).find('input[name="email"][type="text"]').should('exist');
      section(12).find('button[type="submit"]').should('exist');
    });
  });
});

export { };
