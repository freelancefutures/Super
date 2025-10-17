document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    const BDT_EXCHANGE_RATE = 118;
    const WHATSAPP_NUMBER = '8801700000000'; // IMPORTANT: Replace with your BD WhatsApp number

    // --- V4.0 STATIC DATA SOURCE ---
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

    /**
     * Renders service cards based on the provided data array.
     * @param {Array} services - The array of service objects to render.
     */
    const renderServiceCards = (services) => {
        catalogContainer.innerHTML = ''; // Clear previous content
        if (services.length === 0) {
            catalogContainer.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">No services found.</p>`;
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
                        ${service.is_refill ? '<span class="refill-badge">REFILL</span>' : ''}
                    </div>
                    <p class="service-description">${service.description}</p>
                </div>
                <div>
                    <div class="price-presentation">
                        <div class="price-bdt">৳${bdtPrice}</div>
                        <div class="price-badge">Lowest Cost!</div>
                    </div>
                    <button class="order-btn" data-service-name="${service.name}" data-service-id="${service.service_id}">
                        Order Now via WhatsApp
                    </button>
                </div>
            `;
            catalogContainer.appendChild(card);
        });
        
        catalogContainer.querySelectorAll('.order-btn').forEach(btn => {
            btn.addEventListener('click', handleOrderClick);
        });
    };

    /**
     * Renders the category filter tabs.
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
     * Handles clicks on the category filter tabs to filter the services.
     */
    const handleFilterClick = (event) => {
        const category = event.target.dataset.category;
        
        filterContainer.querySelector('.active').classList.remove('active');
        event.target.classList.add('active');

        const filteredServices = category === 'All' 
            ? staticServiceData 
            : staticServiceData.filter(s => s.category === category);
        
        renderServiceCards(filteredServices);
    };

    /**
     * Handles clicks on the "Order Now" button.
     */
    const handleOrderClick = (event) => {
        const button = event.target;
        const serviceName = button.dataset.serviceName;
        const serviceId = button.dataset.serviceId;
        const message = `Hello Quick Grow BD,\nI would like to order this service:\n\n*Service:* ${serviceName}\n*ID:* ${serviceId}\n\nThank you!`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };
    
    /**
     * Initializes the showroom on page load.
     */
    const initializeShowroom = () => {
        renderCategoryFilters();
        renderServiceCards(staticServiceData);
    };

    // --- Initial Load ---
    initializeShowroom();
});
