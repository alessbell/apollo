/// <reference types="Cypress" />

describe('Vue 3 + Apollo Composable', () => {
  beforeEach(() => {
    cy.task('db:reset')
    cy.visit('/')
  })

  it('loads channels', () => {
    cy.contains('#app', 'Loading channels...')
    cy.get('.channel-link').should('have.lengthOf', 2)
    cy.contains('.channel-link', '# General')
    cy.contains('.channel-link', '# Random')
  })

  it('load one channel', () => {
    cy.get('.channel-link').eq(0).click()
    cy.contains('#app', 'Currently viewing # General')
  })

  it('sends a message', () => {
    cy.get('.channel-link').eq(0).click()
    cy.get('input').type('Hello{enter}')
    cy.get('.message').should('have.lengthOf', 1)
    cy.contains('.message', 'Hello')
    cy.get('input').should('have.value', '')
    cy.get('.channel-link').eq(1).click()
    cy.get('.message').should('have.lengthOf', 0)
    cy.reload()
    cy.get('.channel-link').eq(0).click()
    cy.get('.message').should('have.lengthOf', 1)
    cy.contains('.message', 'Hello')
  })

  it('sends multiple messages', () => {
    cy.get('.channel-link').eq(1).click()
    cy.get('input').type('Message 1{enter}')
    cy.contains('.message', 'Message 1')
    cy.get('input').should('have.value', '')
    cy.get('input').type('Message 2{enter}')
    cy.get('input').should('have.value', '')
    cy.contains('.message', 'Message 2')
    cy.get('input').type('Message 3{enter}')
    cy.get('input').should('have.value', '')
    cy.contains('.message', 'Message 3')
    cy.get('.message').should('have.lengthOf', 3)
    cy.get('input').should('have.value', '')
    cy.get('.channel-link').eq(0).click()
    cy.get('.message').should('have.lengthOf', 0)
    cy.reload()
    cy.get('.channel-link').eq(1).click()
    cy.contains('.loading-channel', 'Loading channel...')
    cy.get('.message').should('have.lengthOf', 3)
    cy.contains('.message', 'Message 1')
    cy.contains('.message', 'Message 2')
    cy.contains('.message', 'Message 3')
  })

  it('refetch', () => {
    cy.get('.channel-link').eq(0).click()
    cy.get('input').type('Message 1{enter}')
    cy.get('input').should('have.value', '')
    cy.get('input').type('Message 2{enter}')
    cy.get('input').should('have.value', '')
    cy.get('input').type('Message 3{enter}')
    cy.get('input').should('have.value', '')
    cy.get('[data-test-id="refetch"]').click()
    cy.contains('.loading-channel', 'Loading channel...')
    cy.get('.message').should('have.lengthOf', 3)
    cy.contains('.message', 'Message 1')
    cy.contains('.message', 'Message 2')
    cy.contains('.message', 'Message 3')
    cy.task('db:reset')
    cy.get('[data-test-id="refetch"]').click()
    cy.contains('.loading-channel', 'Loading channel...')
    cy.get('.message').should('have.lengthOf', 0)
  })

  it('supports queries outside of setup', () => {
    cy.visit('/no-setup-query')
    cy.contains('.no-setup-query', 'Hello world!')
  })

  it('supports queries outside of setup with multiple clients', () => {
    cy.visit('/no-setup-query-multi-client')
    cy.contains('.no-setup-query', 'Hello world!')
  })

  it('useLazyQuery', () => {
    cy.visit('/lazy-query')
    cy.get('.list-disc').should('have.length', 0)
    cy.get('button').click()
    cy.get('.loading').should('be.visible')
    cy.get('.loading').should('not.exist')
    cy.get('.list-disc').should('have.length', 3)
    cy.get('.list-disc').should('contain', 'a')
    cy.get('.list-disc').should('contain', 'b')
    cy.get('.list-disc').should('contain', 'c')
  })

  it('useLazyQuery refetch', () => {
    cy.visit('/lazy-query')
    cy.get('button').click()
    cy.get('.list-disc').should('have.length', 3)
    cy.get('[data-test-id="refetched"]').should('contain', 'false')
    cy.get('button').click()
    cy.get('.loading').should('be.visible')
    cy.get('.loading').should('not.exist')
    cy.get('.list-disc').should('have.length', 3)
    cy.get('[data-test-id="refetched"]').should('contain', 'true')
  })

  it('enabled', () => {
    cy.visit('/disabled')
    cy.get('[data-test-id="data"]').should('not.exist')
    cy.get('.loading').should('not.exist')
    cy.get('button').click()
    cy.get('[data-test-id="data"]').should('contain', 'Loaded channel: General')
  })

  it('onResult with immediate result', () => {
    cy.visit('/on-result')
    cy.get('[data-test-id="data"]').should('not.exist')
    cy.get('input[type="checkbox"]').click()
    cy.get('[data-test-id="data"]').should('contain', 'Loaded channel: General')
    cy.get('input[type="checkbox"]').click()
    cy.get('[data-test-id="data"]').should('not.exist')
    cy.get('input[type="checkbox"]').click()
    cy.get('[data-test-id="data"]').should('contain', 'Loaded channel: General')
  })
})
