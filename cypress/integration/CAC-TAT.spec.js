/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(() =>{
        cy.visit("./src/index.html")
    })
    it('verifica o título da aplicação', function() {
        cy.title().should("eq" , "Central de Atendimento ao Cliente TAT")
    })

    it('preenche os campos obrigatórios e envia o formulário', () => {
        const textoLongo = "texxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxto, lonnnnnnnnnnnnnnnnnnnnngo"
        cy.get("#firstName").type('Joao')
        cy.get("input[name=lastName]").type(('Lucas'),{log: false})
        cy.get("input[id=email]").type('realizando@gmail.com')
    //  cy.get("input[name=phone]").type()
        cy.get("[id=open-text-area]").type(textoLongo,{delay:0})
        cy.contains("button" , 'Enviar').click()
       
        cy.get(".success")
            .should("be.visible")
    });

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.get("#firstName").type('Joao')
        cy.get("input[name=lastName]").type('Lucas')
        cy.get("input[id=email]").type('realizando.teste')
        cy.get("[id=open-text-area]").type('email invalido')
        cy.get("button[class='button']").click()
        
        cy.get('.error')
            .should('be.visible')
            .should('contain' ,'Valide os campos obrigatórios!')
    });

    it('campo telefone continua vazio quando coloca valor nao numerico', () => {
        cy.get('#phone')
            .type('csasacsacascas')
            .should('have.value' , '')
    });

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get("#firstName").type('Joao')
        cy.get("input[name=lastName]").type('Lucas')
        cy.get("input[id=email]").type('realizando@gmail.com')
        cy.get('#phone-checkbox').check()
        cy.get("button[class='button']").click()
        
        cy.get('.error').should('be.visible')
    });

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get("#firstName").type('Lucas').should('have.value' , 'Lucas')
        .clear().should('have.value' , '')
        
        cy.get("input[name=lastName]").type('joao').should('have.value' , 'joao')
        .clear().should('have.value' , '')
        
        cy.get("input[id=email]").type('joao@gmail.com').should('have.value' , 'joao@gmail.com')
        .clear().should('have.value' , '')
        
        cy.get("#phone").type(99855985555).should('have.value' , '99855985555')
        .clear().should('have.value' , '')
     });

     it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios.', () => {
        cy.get("button[class='button']").click()
        cy.get(".error").should('be.visible')
            .should('contain' , 'Valide os campos obrigatórios!')
     });
    
     it(' envia o formuário com sucesso usando um comando customizado', () => {
        cy.camposObrigatoriosEnviar()
        cy.get(".success")
            .should("be.visible")
     });

     /*
        APARTIR DE AGORA VOU ESDUTAR COMO INTERAGIR COM OS ELEMENTOS DE SELECT , SELECIONAR UMA OPÇÃO DENTRO DO SELECT COM VARIOS VALUES
     */
     it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product').select('YouTube')    //selecionei pelo texto
            .should('have.value' , 'youtube')   //validei pelo value
     });
    
     it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product').select('mentoria')
            .should('have.value' , 'mentoria')
     });

    
     it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product').select(4)
            .should('have.value' , 'youtube')
     });

     /*
        Marcando inputs do tipo radio e vericando se foram marcados
     */
     it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value' , 'feedback')
     });

     it('marca cada tipo de atendimento', () => {
        
        cy.get('input[type="radio"]')
            .should('have.length' , 3)
            .each(function($radio){             //.each passa por cada um dos elementos e recebe uma função recebe cada um dos elementos que foram retornado pelo cy.get
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
        
      /*
        cy.get('input[value=ajuda]')
            .check()
            .should('be.checked')

        cy.get('input[type="radio"][value="elogio"]')
            .check()
            .should('be.checked')

        cy.get('input[type="radio"][value="elogio"]')
            .check()
            .should('be.checked') */
     }); 

     /*
        Marcando check box e validando se se fora marcados e desmacados
     */

     it('marca ambos checkboxes, depois desmarca o último' , ()=>{
        cy.get('input[type=checkbox]')
            .check()                        // vai marcar todos os checkbox pq eu não sinalizei o check box especifico
            .should('be.checked')                     
            .last()                         // pega o ultimo checkbox
            .uncheck()                      // desmaca
            .should('not.be.checked')       // valida se foi desmacado 
     })
/*
     Demostrando como anexa um arquivo e valida se o arquivo foi anexado
*/
     it('selecionar um arquivo da pasta fixtures', () => {
        cy.get('input[type="file"]') 
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function($input){
              console.log($input)  
              expect($input[0].files[0].name).to.equal('example.json')
            })
     });

     it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('input[type="file"]') 
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json',{action: 'drag-drop'})            //SIMULANDO QUE ESTAMOS ARRASTANDO O ARQUIVO PARA CIMA DO INPUT
            .should(function($input){
              console.log($input)  
              expect($input[0].files[0].name).to.equal('example.json')
            })
     });

     it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('exampleFile')
        cy.get('input[type="file"]') 
            .selectFile('@exampleFile')
            .should(function($input){
                console.log($input)  
                expect($input[0].files[0].name).to.equal('example.json')
            })
     })

     /* VALIDANDO COMO ABRIR OUTRA ABA DO NAVEGADOR*/
     it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank' )
     });

     it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('#privacy a')
            .invoke('removeAttr' , 'target')
            .click()
        cy.contains('Talking About Testing').should('be.visible')
     });

    })