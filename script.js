document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    const API_URL = 'https://goupsocial.com/api/v2?key=6b3f733fa9160b31ca4010b574245dc7&action=services';
    const BDT_EXCHANGE_RATE = 118;
    const WHATSAPP_NUMBER = '8801700000000'; // IMPORTANT: Replace with your BD WhatsApp number

    // --- Failsafe Data (Hardcoded Backup) ---
    const failsafeServices = [
        { service: 101, name: "Facebook Page Followers [High Quality]", category: "Facebook", rate: "2.50", refill: true },
        { service: 102, name: "Instagram Followers [Real Active]", category: "Instagram", rate: "3.10", refill: true },
        { service: 103, name: "YouTube Watch Time Hours [4000 Hours]", category: "YouTube", rate: "8.00", refill: false },
        { service: 104, name: "TikTok Video Likes [Instant]", category: "TikTok", rate: "1.20", refill: false },
        { service: 105, name: "Telegram Channel Members", category: "Telegram", rate: "1.80", refill: true }
    ];

    // --- DOM Elements ---
    const catalogContainer = document.getElementById('service-catalog');
    const filterContainer = document.getElementById('category-filters');
    let allServicesData = []; // To store data from API or failsafe

    /**
     * Maps service categories to SVG icons.
     * @param {string} category - The category name.
     * @returns {string} An SVG icon string.
     */
    const getServiceIcon = (category) => {
        const catLower = category.toLowerCase();
        const icons = {
            facebook: `<svg fill="#64ffda" ...>...</svg>`, // Replace with actual SVG code
            instagram: `<svg fill="#64ffda" ...>...</svg>`,
            youtube: `<svg fill="#64ffda" ...>...</svg>`,
            tiktok: `<svg fill="#64ffda" ...>...</svg>`,
            telegram: `<svg fill="#64ffda" ...>...</svg>`
        };
        // Simple text-based fallback
        const textIcons = {
            facebook: 'FB', instagram: 'IG', youtube: 'YT', tiktok: 'TT', telegram: 'TG'
        };
        for (const key in textIcons) {
            if (catLower.includes(key)) return `<div class="icon-fallback">${textIcons[key]}</div>`;
        }
        return `<div class="icon-fallback">⭐</div>`;
    };

    /**
     * Primary function to orchestrate data fetching and rendering.
     */
    const initializeShowroom = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('API response was not ok.');
            const services = await response.json();
            allServicesData = services.filter(s => s.name && parseFloat(s.rate) > 0);
            console.log("Successfully fetched live API data.");
        } catch (error) {
            console.warn("API fetch failed. Switching to failsafe data.", error);
            allServicesData = failsafeServices; // Failsafe mechanism activated
        }
        renderPage(allServicesData);
    };

    /**
     * Renders the entire page content (filters and cards).
     * @param {Array} services - The array of service objects to display.
     */
    const renderPage = (services) => {
        if (!services || services.length === 0) {
            catalogContainer.innerHTML = `<p class="error-message">No services available to display.</p>`;
            return;
        }
        renderCategoryFilters(services);
        renderServiceCards(services);
    };

    /**
     * Creates and displays the category filter tabs.
     * @param {Array} services - The array of service objects.
     */
    const renderCategoryFilters = (services) => {
        const categories = ['All', ...new Set(services.map(s => s.category))];
        filterContainer.innerHTML = categories.map(category => 
            `<button class="filter-tab ${category === 'All' ? 'active' : ''}" data-category="${category}">
                ${category}
            </button>`
        ).join('');
        
        // Add event listeners to new tabs
        filterContainer.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', handleFilterClick);
        });
    };
    
    /**
     * Renders the service cards into the catalog.
     * @param {Array} services - The array of service objects to render.
     */
    const renderServiceCards = (services) => {
        catalogContainer.innerHTML = ''; // Clear loading state or old cards
        const grid = document.createElement('div');
        grid.className = 'service-grid';

        if(services.length === 0) {
            catalogContainer.innerHTML = '<p class="info-text">No services found in this category.</p>';
            return;
        }

        services.forEach(service => {
            const bdtPrice = (parseFloat(service.rate) * BDT_EXCHANGE_RATE).toFixed(2);
            
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="service-icon">${getServiceIcon(service.category)}</div>
                    <div class="service-name">${service.name}</div>
                </div>
                <div class="card-body">
                    <div class="price-line">
                        <div class="price-bdt">৳${bdtPrice}</div>
                        <div class="price-badge">Lowest Cost!</div>
                    </div>
                    <p class="price-info">per 1000 | ($${service.rate} USD)</p>
                    <button class="message-btn" data-service-name="${service.name}" data-service-id="${service.service}">
                        Message Now
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
        catalogContainer.appendChild(grid);

        // Add event listeners to new buttons
        catalogContainer.querySelectorAll('.message-btn').forEach(btn => {
            btn.addEventListener('click', handleMessageNowClick);
        });
    };

    /**
     * Handles clicks on the category filter tabs.
     * @param {Event} event - The click event.
     */
    const handleFilterClick = (event) => {
        const category = event.target.dataset.category;
        
        // Update active tab style
        filterContainer.querySelector('.active').classList.remove('active');
        event.target.classList.add('active');

        const filteredServices = category === 'All' 
            ? allServicesData 
            : allServicesData.filter(s => s.category === category);
        
        renderServiceCards(filteredServices);
    };

    /**
     * Handles clicks on the "Message Now" button.
     * @param {Event} event - The click event.
     */
    const handleMessageNowClick = (event) => {
        const button = event.target;
        const serviceName = button.dataset.serviceName;
        const serviceId = button.dataset.serviceId;
        const message = `Hello Quick Grow BD, I'm interested in this service:\n\n*Service Name:* ${serviceName}\n*Service ID:* ${serviceId}\n\nPlease provide more details.`;

        // 1. Copy to clipboard
        navigator.clipboard.writeText(serviceName).then(() => {
            button.textContent = 'Copied!';
            setTimeout(() => { button.textContent = 'Message Now'; }, 2000);
        }).catch(err => console.error('Failed to copy text: ', err));

        // 2. Open WhatsApp
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // --- Initial Load ---
    initializeShowroom();
});
