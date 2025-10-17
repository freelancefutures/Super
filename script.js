document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    const API_URL = 'https://goupsocial.com/api/v2?key=6b3f733fa9160b31ca4010b574245dc7&action=services';
    const BDT_EXCHANGE_RATE = 118;

    // --- DOM Elements ---
    const catalogContainer = document.getElementById('service-catalog');
    const searchInput = document.getElementById('searchInput');
    let allServicesData = []; // Cache for search functionality

    /**
     * Maps service categories to simple emoji icons for a clean look.
     * @param {string} category - The category name from the API.
     * @returns {string} An emoji icon.
     */
    const getCategoryIcon = (category) => {
        const lowerCaseCategory = category.toLowerCase();
        if (lowerCaseCategory.includes('facebook')) return '👍';
        if (lowerCaseCategory.includes('instagram')) return '📸';
        if (lowerCaseCategory.includes('youtube')) return '▶️';
        if (lowerCaseCategory.includes('tiktok')) return '🎵';
        if (lowerCaseCategory.includes('telegram')) return '✈️';
        if (lowerCaseCategory.includes('twitter')) return '🐦';
        return '⭐'; // Default icon
    };

    /**
     * Formats a number into BDT currency format.
     * @param {number} amount - The amount in BDT.
     * @returns {string} A formatted currency string.
     */
    const formatBdt = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 2
        }).format(amount);
    };

    /**
     * Fetches service data from the API, processes, and renders it.
     */
    const fetchAndRenderServices = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            const services = await response.json();

            // Filter out services with a rate of 0 or invalid services and sort them
            allServicesData = services
                .filter(service => service.name && parseFloat(service.rate) > 0)
                .sort((a, b) => a.category.localeCompare(b.category));
            
            renderServices(allServicesData);

        } catch (error) {
            console.error('Failed to fetch services:', error);
            catalogContainer.innerHTML = `<div class="error-message">
                <h3>Failed to Load Services</h3>
                <p>Please check your internet connection and try again later.</p>
            </div>`;
        }
    };
    
    /**
     * Renders the services to the DOM, grouped by category.
     * @param {Array} services - The array of service objects to render.
     */
    const renderServices = (services) => {
        catalogContainer.innerHTML = ''; // Clear loader or previous content

        if (services.length === 0) {
            catalogContainer.innerHTML = `<p class="no-results">No services match your search.</p>`;
            return;
        }

        // Group services by category
        const servicesByCategory = services.reduce((acc, service) => {
            (acc[service.category] = acc[service.category] || []).push(service);
            return acc;
        }, {});

        // Generate and append HTML for each category and its services
        for (const category in servicesByCategory) {
            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = category;
            
            const serviceGrid = document.createElement('div');
            serviceGrid.className = 'service-grid';

            servicesByCategory[category].forEach(service => {
                const bdtPrice = parseFloat(service.rate) * BDT_EXCHANGE_RATE;

                const card = document.createElement('div');
                card.className = 'service-card';
                card.innerHTML = `
                    <div class="service-header">
                        <div>
                            <div class="service-name">
                                ${service.name}
                                <span class="service-id">ID: ${service.service}</span>
                            </div>
                        </div>
                        <div class="service-icon">${getCategoryIcon(service.category)}</div>
                    </div>
                    <div>
                        ${service.refill ? '<span class="refill-badge">✓ Refill</span>' : ''}
                        <div class="price-container">
                            <div class="price-bdt">
                                ${formatBdt(bdtPrice)}
                                <span>per 1000</span>
                            </div>
                            <div class="price-usd">($${service.rate} USD)</div>
                        </div>
                    </div>
                `;
                serviceGrid.appendChild(card);
            });
            
            catalogContainer.appendChild(categoryTitle);
            catalogContainer.appendChild(serviceGrid);
        }
    };

    /**
     * Handles the live search functionality.
     */
    const handleSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filteredServices = allServicesData.filter(service => 
            service.name.toLowerCase().includes(searchTerm) ||
            service.service.toString().includes(searchTerm)
        );
        renderServices(filteredServices);
    };

    // --- Event Listeners ---
    searchInput.addEventListener('input', handleSearch);

    // --- Initial Load ---
    fetchAndRenderServices();
});
