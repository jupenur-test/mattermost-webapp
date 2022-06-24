// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {ChainableT} from '../api/types';

import * as TIMEOUTS from '../../fixtures/timeouts';

function uiCheckLicenseExists() {
    // # Go to system admin then verify admin console URL, header, and content
    cy.visit('/admin_console/about/license');
    cy.url().should('include', '/admin_console/about/license');
    cy.get('.admin-console', {timeout: TIMEOUTS.HALF_MIN}).should('be.visible').within(() => {
        cy.get('.admin-console__header').should('be.visible').and('have.text', 'Edition and License');
        cy.get('.admin-console__content').should('be.visible').and('not.contain', 'undefined').and('not.contain', 'Invalid');
        cy.get('#remove-button').should('be.visible');
    });
}
Cypress.Commands.add('uiCheckLicenseExists', uiCheckLicenseExists);

function uiResetPermissionsToDefault() {
    // # Navigate to system scheme page
    cy.visit('/admin_console/user_management/permissions/system_scheme');

    // # Click reset to defaults and confirm
    cy.findByTestId('resetPermissionsToDefault', {timeout: TIMEOUTS.HALF_MIN}).click();
    cy.get('#confirmModalButton').click();
    cy.uiSaveConfig();
}
Cypress.Commands.add('uiResetPermissionsToDefault', uiResetPermissionsToDefault);

function uiSaveConfig() {
    // # Save settings
    cy.get('#saveSetting').should('be.enabled').click();
    cy.wait(TIMEOUTS.ONE_SEC);

    // # Wait until the UI shows the saving is done and revert the text to "Save"
    cy.waitUntil(() => cy.get('#saveSetting').then((el) => {
        return el[0].innerText === 'Save';
    }));
}
Cypress.Commands.add('uiSaveConfig', uiSaveConfig);

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {

            /**
             * Verify license exists via admin console.
             *
             * @example
             *   cy.uiCheckLicenseExists();
             */
            uiCheckLicenseExists(): ChainableT<void>;

            /**
             * Reset system scheme permissions via System Console
             *
             * @example
             *   cy.uiResetPermissionsToDefault();
             */
            uiResetPermissionsToDefault(): ChainableT<void>;

            /**
             * Save settings located in System Console
             *
             * @example
             *   cy.uiSaveConfig();
             */
            uiSaveConfig(): ChainableT<void>;
        }
    }
}