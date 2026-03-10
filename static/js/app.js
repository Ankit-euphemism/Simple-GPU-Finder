document.addEventListener('DOMContentLoaded', () => {
    const priceSlider = document.getElementById('priceSlider');
    const priceValue = document.getElementById('priceValue');
    const searchInput = document.getElementById('searchInput');
    const refreshBtn = document.getElementById('refreshBtn');
    const container = document.getElementById('productsContainer');

    /* ── Slider fill ──────────────────────────────────── */
    function updateSliderFill() {
        const min = parseFloat(priceSlider.min);
        const max = parseFloat(priceSlider.max);
        const val = parseFloat(priceSlider.value);
        const pct = ((val - min) / (max - min)) * 100;
        priceSlider.style.setProperty('--slider-pct', pct + '%');
    }

    updateSliderFill(); // initialise on load

    /* ── Price slider ─────────────────────────────────── */
    priceSlider.addEventListener('input', () => {
        priceValue.textContent = new Intl.NumberFormat('en-IN').format(priceSlider.value);
        updateSliderFill();
        filterProducts();
    });

    /* ── Search input ─────────────────────────────────── */
    searchInput.addEventListener('input', filterProducts);

    /* ── Refresh button ───────────────────────────────── */
    refreshBtn.addEventListener('click', async () => {
        const originalHTML = refreshBtn.innerHTML;
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Refreshing…
    `;

        try {
            const response = await fetch('/refresh', { method: 'POST' });
            const data = await response.json();
            showToast(`✓ Data refreshed — ${data.new_count} products loaded`);
            location.reload();
        } catch {
            showToast('✕ Refresh failed. Please try again.', true);
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = originalHTML;
        }
    });

    /* ── Filter / Search ──────────────────────────────── */
    async function filterProducts() {
        const query = searchInput.value.toLowerCase();
        const maxPrice = parseFloat(priceSlider.value);

        try {
            const response = await fetch(`/search?q=${encodeURIComponent(query)}&max_price=${maxPrice}`);
            const products = await response.json();

            renderCards(products);
        } catch (error) {
            console.error('Error filtering products:', error);
        }
    }

    /* ── Render cards ─────────────────────────────────── */
    function renderCards(products) {
        if (!products.length) {
            container.innerHTML = `
        <div class="col-12">
          <div class="no-results">
            <span class="no-results-icon">🔍</span>
            <p>No GPUs found matching your criteria.<br>Try a different search term or increase the max price.</p>
          </div>
        </div>
      `;
            return;
        }

        container.innerHTML = products.map((product, i) => {
            const price = new Intl.NumberFormat('en-IN').format(product.price);
            const safeTitle = escapeHtml(product.title);
            const safeDesc = escapeHtml(product.description);
            const safeSource = escapeHtml(product.source);
            const safeLink = escapeHtml(product.link);

            return `
        <div class="col-md-6 col-lg-4 mb-4 gpu-card-wrapper product-card" style="animation-delay:${i * 40}ms">
          <div class="gpu-card">
            <div class="gpu-card-body">
              <span class="source-chip source">${safeSource}</span>
              <h3 class="gpu-card-title">${safeTitle}</h3>
              <p class="gpu-card-desc">${safeDesc}</p>
              <div class="price-tag">
                <span class="currency">₹</span>
                <span class="amount price">${price}</span>
              </div>
            </div>
            <div class="gpu-card-footer">
              <a
                href="${safeLink}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-view-product"
                aria-label="View ${safeTitle} on ${safeSource}"
              >
                View Product →
              </a>
            </div>
          </div>
        </div>
      `;
        }).join('');
    }

    /* ── Toast notification ───────────────────────────── */
    function showToast(message, isError = false) {
        const existing = document.querySelector('.gf-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'gf-toast';
        toast.setAttribute('role', 'alert');
        toast.textContent = message;

        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            background: isError ? '#3b1a1a' : '#1a2b1a',
            color: isError ? '#f87171' : '#4ade80',
            border: `1px solid ${isError ? 'rgba(248,113,113,0.3)' : 'rgba(74,222,128,0.3)'}`,
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: '500',
            fontFamily: 'inherit',
            zIndex: '9999',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            opacity: '0',
            transform: 'translateY(12px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
        });

        document.body.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(8px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    /* ── Escape HTML helper ───────────────────────────── */
    function escapeHtml(str) {
        if (typeof str !== 'string') return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
});