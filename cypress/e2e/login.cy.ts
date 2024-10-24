import { createUser } from "../../src/data-access/users"

describe('Login', () => {
  before(() => {
    cy.task('user:createTestUser')

  })

  beforeEach(() => {
    cy.visit('/auth/login')
  })
  
  it('should redirect to root path if correct credentials', () => {
    cy.get('[data-cy="email"]').type('test@email.com')

    cy.get('[data-cy="password"]').type('password')

    cy.get('[data-cy="login-button"]').click()

    cy.url().should('include', '/')
  })

  it('should show error message if incorrect email', () => {
    cy.get('[data-cy="email"]').type('test2@email.com')
    
    cy.get('[data-cy="password"]').type('password')

    cy.get('[data-cy="login-button"]').click()

    cy.get('[data-cy="error-message"]').should('be.visible')
    cy.get('[data-cy="error-message"]').should('contain.text', 'Invalid credentials')
  })

  it('should show error message if incorrect password', () => {
    cy.get('[data-cy="email"]').type('test@email.com')
    
    cy.get('[data-cy="password"]').type('password1')

    cy.get('[data-cy="login-button"]').click()

    cy.get('[data-cy="error-message"]').should('be.visible')
    cy.get('[data-cy="error-message"]').should('contain.text', 'Invalid credentials')
  })


  it('should show invalid message if fields are empty', () => {
    cy.get('[data-cy="password"]').type('password1')

    cy.get('[data-cy="login-button"]').click()

    cy.get('[data-cy="email"]:invalid').should('exist')
  })

  it('should show invalid message if password is empty', () => {
    cy.get('[data-cy="email"]').type('test@email.com')

    cy.get('[data-cy="login-button"]').click()

    cy.get('[data-cy="password"]:invalid').should('exist')
  })

  it('should have a link to register', () => {
    cy.get('[data-cy="register-link"]').should('be.visible')
    cy.get('[data-cy="register-link"]').should('contain.text', 'Register')

    cy.get('[data-cy="register-link"]').click()

    cy.url().should('include', '/auth/register')
  })
})