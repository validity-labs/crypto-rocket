import { defineConfig } from 'cypress'

export default defineConfig({
  fixturesFolder: 'testing/cypress/fixtures',
  screenshotsFolder: 'testing/cypress/screenshots',
  videosFolder: 'testing/cypress/videos',
  downloadsFolder: 'testing/cypress/downloads',
  video: false,
  trashAssetsBeforeRuns: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./testing/cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'testing/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'testing/cypress/support/index.js',
  },
})
