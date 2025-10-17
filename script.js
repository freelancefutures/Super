document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    const BDT_EXCHANGE_RATE = 118;
    const WHATSAPP_NUMBER = '8801700000000'; // IMPORTANT: Replace with your BD WhatsApp number

    // --- V3.0 STATIC DATA SOURCE ---
    const staticServiceData = [
        {
            service_id: 201,
            name: '1000 Facebook Followers',
            category: 'Facebook',
            rate_usd: 2.35,
            is_refill: true,
            description: 'High-quality followers to boost your page credibility. 30-day automatic refill guarantee.'
        },
        {
            service_id: 305,
            name: '1000 Instagram Likes',
            category: 'Instagram',
            rate_usd: 0.3076,
            is_refill: false,
            description: 'Instant delivery likes from premium accounts to increase post engagement. Perfect for trending.'
        },
        {
            service_id: 410,
            name: '1000 YouTube Views',
            category: 'YouTube',
            rate_usd: 1.50,
            is_refill: true,
            description: 'Real human views to improve video ranking. Lifetime guarantee against drops.'
        },
        {
            service_id: 515,
            name: '4000 YouTube Watch Hours',
            category: 'Top Deals',
            rate_usd: 8.00,
            is_refill: true,
            description: 'The complete monetization package. Guaranteed delivery to meet YouTube Partner Program requirements.'
        },
        {
            service_id: 620,
            name: '1000 TikTok Followers',
            category: 'TikTok',
            rate_usd: 0.95,
            is_refill: true,
            description: 'Grow your TikTok presence with real followers. Fast, safe, and reliable service.'
        }
    ];

    // --- DOM Elements ---
    const catalogContainer = document.getElementById('service-catalog');
    const filterContainer = document.getElementById('category-filters');
    const searchInput = document.getElementById('searchInput');

    /**
     * Renders the category filter tabs based on the available data.
     */
    const renderCategoryFilters = () => {
        const categories = ['All', ...new Set(staticServiceData.map(s => s.category))];
        filterContainer.innerHTML = categories.map(category =>
            `<button class="filter-tab ${category === 'All' ? 'active' : ''}" data-category="${category}">
                ${category}
            </button>`
        ).join('');

        filterContainer.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', handleFilterClick);
        });
    };

    /**
     * Renders service cards to the DOM based on the provided data array.
     * @param {Array} services - The array of service objects to render.
     */
    const renderServiceCards = (services) => {
        catalogContainer.innerHTML = ''; // Clear previous content
        if (services.length === 0) {
            catalogContainer.innerHTML = `<p>No services match your criteria.</p>`;
            return;
        }

        services.forEach(service => {
            const bdtPrice = (service.rate_usd * BDT_EXCHANGE_RATE).toFixed(2);
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <div>
                    <div class="card-header">
                        <span class="service-name">${service.name}</span>
                        ${service.is_refill ? '<span class="refill-badge">✓ Refill</span>' : ''}
                    </div>
                    <p class="service-description">${service.description}</p>
                </div>
                <div>
                    <div class="price-line">
                        <div class="price-bdt">৳${bdtPrice}</div>
                    </div>
                    <p class="price-info">per 1000 | ($${service.rate_usd} USD)</p>
                    <button class="message-btn" data-service-name="${service.name}" data-service-id="${service.service_id}">
                        Message Now
                    </button>
                </div>
            `;
            catalogContainer.appendChild(card);
        });
        
        catalogContainer.querySelectorAll('.message-btn').forEach(btn => {
            btn.addEventListener('click', handleMessageNowClick);
        });
    };

    /**
     * Handles clicks on the category filter tabs.
     */
    const handleFilterClick = (event) => {
        const category = event.target.dataset.category;
        filterContainer.querySelector('.active').classList.remove('active');
        event.target.classList.add('active');
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        filterAndSearch(category, searchTerm);
    };
    
    /**
     * Handles the live search input.
     */
    const handleSearch = () => {
        const activeCategory = filterContainer.querySelector('.active').dataset.category;
        const searchTerm = searchInput.value.toLowerCase().trim();
        filterAndSearch(activeCategory, searchTerm);
    };

    /**
     * Filters and searches the static data, then renders the results.
     * @param {string} category - The selected category ('All' or specific).
     * @param {string} searchTerm - The text from the search input.
     */
    const filterAndSearch = (category, searchTerm) => {
        let filteredServices = staticServiceData;

        // Apply category filter
        if (category !== 'All') {
            filteredServices = filteredServices.filter(s => s.category === category);
        }

        // Apply search filter
        if (searchTerm) {
            filteredServices = filteredServices.filter(s => 
                s.name.toLowerCase().includes(searchTerm) ||
                s.description.toLowerCase().includes(searchTerm)
            );
        }
        
        renderServiceCards(filteredServices);
    };
    
    /**
     * Handles clicks on the "Message Now" button.
     */
    const handleMessageNowClick = (event) => {
        const button = event.target;
        const serviceName = button.dataset.serviceName;
        const serviceId = button.dataset.serviceId;
        const message = `Hello Quick Grow BD,\nI'm interested in this service:\n\n*Service:* ${serviceName}\n*ID:* ${serviceId}\n\nPlease provide details.`;

        button.textContent = 'Copied!';
        setTimeout(() => { button.textContent = 'Message Now'; }, 2000);
        
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    /**
     * Initializes the page on load.
     */
    const initializeShowroom = () => {
        renderCategoryFilters();
        renderServiceCards(staticServiceData);
        searchInput.addEventListener('input', handleSearch);
    };

    // --- Initial Load ---
    initializeShowroom();
});
