describe('Layout', () => {
  it('should have proper header and footer', () => {
    cy.visit('/');

    cy.url().should('include', '/');

    // Header
    cy.get('.PrivateSwipeArea-root').should('have.length', 1);
    cy.get('header').within(() => {
      cy.get('.MuiToolbar-root').should('have.length', 1);
      cy.get('ul').should('have.length.gte', 1);
      cy.get('a').should('have.length.gte', 5);
      cy.get('button').should('have.length.gte', 7);
      cy.get('img').should('have.length', 2);
      cy.get('[aria-label="Toggle Menu"]').should('have.length', 1);
    });

    // Footer
    cy.get('footer').within(() => {
      cy.get('ul').should('have.length.gte', 1);
      cy.get('.top p').should('contain', 'AWI');
      cy.get('a').should('have.length.gte', 1);
      cy.get('svg').should('have.length', 1);
      cy.get('img').should('have.length', 5);
      cy.get('button').should('have.length', 1);
    });
  });
});

export {};
