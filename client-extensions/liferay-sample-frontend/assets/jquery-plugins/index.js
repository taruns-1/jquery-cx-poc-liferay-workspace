/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import counterup2 from 'counterup2';
/**
 * Get jQuery from multiple sources with priority order:
 * 1. Global jQuery (if enabled Control Panel -> System Settings -> Third Party -> JQuery)
 * 2. Import from jsImportsMap
 */
async function getJQuery() {

    if (window.jQuery) {
        console.log('Using global jQuery from window.jQuery');
        return { source: 'global', $: window.jQuery };
    }

    // Importing from jsImportsMap
    try {
        const { default: $ } = await import('jquery');
        console.log('Using jQuery from jsImportsMap:', $.fn.jquery);
        window.jQuery = $;
        window.$ = $;
        return { source: 'importmap', $: $ };
    } catch (error) {
        console.error('Failed to load jQuery:', error);
        throw new Error('jQuery could not be loaded from any source');
    }
}

class JQueryPluginsElement extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {

        try {
            // Get jQuery instance with source info
            const { source, $ } = await getJQuery();

            const counterValue = this.getAttribute('counter-value') || '1000';

            const root = document.createElement('div');

            root.innerHTML = `
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    .plugins-wrapper {
                        padding: 40px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                    }

                    .section {
                        margin-bottom: 60px;
                    }

                    .section-title {
                        font-size: 24px;
                        font-weight: 600;
                        color: #333;
                        margin-bottom: 30px;
                        text-align: center;
                    }

                    /* CounterUp Styles */
                    .counter-section {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }

                    .counter-circle {
                        width: 200px;
                        height: 200px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
                        margin-bottom: 20px;
                    }

                    .counter {
                        font-size: 64px;
                        font-weight: bold;
                        color: white;
                        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
                    }

                    /* Footer Info */
                    .jquery-info {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #e0e0e0;
                        color: #666;
                        font-size: 14px;
                    }

                    .jquery-source {
                        display: inline-block;
                        background: #e8f5e9;
                        color: #2e7d32;
                        padding: 8px 16px;
                        border-radius: 20px;
                        margin-top: 10px;
                        font-weight: 600;
                    }
                </style>

                <div class="plugins-wrapper">
                    <div class="section counter-section">
                        <div class="section-title">CounterUp Plugin Demo</div>
                        <div class="counter-circle">
                            <div class="counter">${counterValue}</div>
                        </div>
                    </div>

                    <div class="jquery-info">
                        <div>jQuery v${$.fn.jquery}</div>
                        <div class="jquery-source" id="jquery-source">Loading...</div>
                    </div>
                </div>
            `;

            this.attachShadow({ mode: 'open' }).appendChild(root);

            // Small delay to ensure DOM is ready
            setTimeout(() => {
                this.initializePlugins($, source);
            }, 100);

        } catch (error) {
            console.error('Error in connectedCallback:', error);
            this.innerHTML = `
                <div style="padding: 40px; color: red; border: 2px solid red; border-radius: 8px;">
                    <h3>Error Loading jQuery Plugins Demo</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }

    initializePlugins($, source) {

        // Update jQuery source indicator based on the source returned from getJQuery
        const sourceEl = this.shadowRoot.querySelector('#jquery-source');
        let jquerySourceText = 'Unknown';

        switch(source) {
            case 'global':
                jquerySourceText = 'Global jQuery (window.jQuery)';
                break;
            case 'importmap':
                jquerySourceText = 'jQuery from jsImportsMap';
                break;
            default:
                jquerySourceText = 'jQuery Loaded';
        }

        if (sourceEl) {
            sourceEl.textContent = jquerySourceText;
        }

        // Initialize CounterUp
        const counterElement = this.shadowRoot.querySelector('.counter');
        if (counterElement) {
            try {
                counterup2(counterElement, {
                    duration: 2000,
                    delay: 16,
                });
            } catch (error) {
                console.error('CounterUp initialization failed:', error);
            }
        }
    }
}

// Register the custom element
if (!customElements.get('liferay-sample-frontend-jquery-plugins')) {
    customElements.define(
        'liferay-sample-frontend-jquery-plugins',
        JQueryPluginsElement
    );
    console.log('Custom element registered: liferay-sample-frontend-jquery-plugins');
} else {
    console.log('Custom element already registered');
}

export default JQueryPluginsElement;
