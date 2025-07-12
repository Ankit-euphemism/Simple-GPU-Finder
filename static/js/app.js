document.addEventListener('DOMContentLoaded', () => {
    const priceSlider = document.getElementById('priceSlider');
    const priceValue = document.getElementById('priceValue');
    const searchInput = document.getElementById('searchInput');
    const refreshBtn = document.getElementById('refreshBtn');

    priceSlider.addEventListener('input', () => {
        priceValue.textContent = new Intl.NumberFormat('en-IN').format(priceSlider.value);
        filterProducts();
    });

    searchInput.addEventListener('input', filterProducts);

    refreshBtn.addEventListener('click', async () => {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Refreshing...';

        try {
            const response = await fetch('/refresh', { method: 'POST' });
            const data = await response.json();
            alert(`Data refreshed! ${data.new_count} products loaded`);
            location.reload();
        } catch (error) {
            alert('Refresh failed');
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = 'Refresh Data';
        }
    });

    async function filterProducts() {
        const query = searchInput.value.toLowerCase();
        const maxPrice = parseFloat(priceSlider.value);

        try {
            const response = await fetch(`/search?q=${encodeURIComponent(query)}&max_price=${maxPrice}`);
            const products = await response.json();

            const container = document.getElementById('productsContainer');
            container.innerHTML = '';

            products.forEach(product => {
                container.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">${product.description}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="price badge bg-success">₹${new Intl.NumberFormat('en-IN').format(product.price)}</span>
                                <span class="source">${product.source}</span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <a href="${product.link}" target="_blank" class="btn btn-sm btn-primary">View Product</a>
                        </div>
                    </div>
                </div>`;
            });
        } catch (error) {
            console.error('Error filtering products:', error);
            alert('Failed to load products. Please try again.');
        }
    }
});