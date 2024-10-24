import { createUser } from "../../src/data-access/users"

describe('Register', () => {
  beforeEach(() => {
    cy.task('user:deleteTestUser')
    cy.visit('/auth/register')
  })
  
  it('should redirect to root path if correctly registered', () => {
    cy.get('[data-cy="name"]').type('Test')

    cy.get('[data-cy="lastName"]').type('User')

    cy.get('[data-cy="email"]').type('test@email.com')

    cy.get('[data-cy="password"]').type('password')

    cy.get('[data-cy="register-button"]').click()

    cy.url().should('include', '/')
  })

  it('should show error message if user with email already exists', () => {
    cy.task('user:createTestUser')

    cy.get('[data-cy="name"]').type('Test')

    cy.get('[data-cy="lastName"]').type('User')

    cy.get('[data-cy="email"]').type('test@email.com')

    cy.get('[data-cy="password"]').type('password')

    cy.get('[data-cy="register-button"]').click()

    cy.get('[data-cy="error-message"]').should('be.visible')
    cy.get('[data-cy="error-message"]').should('contain.text', 'User with that email already exists')
  })


  it('should show invalid message if first name is left empty', () => {

    cy.get('[data-cy="lastName"]').type('User')

    cy.get('[data-cy="email"]').type('test@email.com')

    cy.get('[data-cy="password"]').type('password')

    cy.get('[data-cy="register-button"]').click()

    cy.get('[data-cy="name"]:invalid').should('exist')
  })

  it('should show invalid message if last name is left empty', () => {
    cy.get('[data-cy="name"]').type('Test')

    cy.get('[data-cy="email"]').type('test@email.com')

    cy.get('[data-cy="password"]').type('password')

    cy.get('[data-cy="register-button"]').click()

    cy.get('[data-cy="lastName"]:invalid').should('exist')
  })

  it('should show invalid message if email is left empty', () => {
    cy.get('[data-cy="name"]').type('Test')

    cy.get('[data-cy="lastName"]').type('User')

    cy.get('[data-cy="password"]').type('password')

    cy.get('[data-cy="register-button"]').click()

    cy.get('[data-cy="email"]:invalid').should('exist')
  })

  it('should show invalid message if password is left empty', () => {
    cy.get('[data-cy="name"]').type('Test')

    cy.get('[data-cy="lastName"]').type('User')

    cy.get('[data-cy="email"]').type('test@email.com')


    cy.get('[data-cy="register-button"]').click()

    cy.get('[data-cy="password"]:invalid').should('exist')
  })

  it('should have a link to login', () => {
    cy.get('[data-cy="login-link"]').should('be.visible')
    cy.get('[data-cy="login-link"]').should('contain.text', 'Login')

    cy.get('[data-cy="login-link"]').click()

    cy.url().should('include', '/auth/login')
  })
})