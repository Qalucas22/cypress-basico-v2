Cypress.Commands.add('camposObrigatoriosEnviar', function() {
    cy.get("#firstName").type('Joao')
    cy.get("input[name=lastName]").type('Lucas')
    cy.get("input[id=email]").type('realizando@gmail.com')
    cy.get("[id=open-text-area]").type('teste')
    cy.contains("button" , 'Enviar').click()
})
