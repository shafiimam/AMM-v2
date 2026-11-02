// Route Code Edited 11/02/2026
/**
 * BFCache and Popstate Handler Script
 * 
 * This script automatically detects when:
 * 1. A page is restored from bfcache (pageshow event)
 * 2. Browser navigation occurs via back/forward buttons (popstate event)
 * 
 * Actions taken:
 * 1. Checks for open cart drawers that should be closed or if user is on cart page
 * 2. Refreshes the page to reactivate the Route scripts
 * 
 */
(function() {
    // Checks if page cleanup is needed and refreshes if necessary
    function checkAndCleanupIfNeeded() {
 // Ensure the "openDrawers" CSS selector meets the criteria above
        const openDrawers = document.querySelectorAll('cart-drawer[open]'); 
        const isCartPage = /\/cart\/?$/.test(window.location.pathname);

        if (openDrawers.length > 0 || isCartPage) {
            fetch('/cart.js')
            .then(response => response.json())
            .then(cart => {
                // Search through all cart items to find Route shipping protection
                // Uses find() since we expect at most one Route item
                const routeItem = cart.items.find(item =>
                    item.vendor === "Route"
                );
            
                // Only proceed if a Route item was found in the cart
                if (routeItem) {
                    const updates = {};
                    updates[routeItem.key] = 0;
                    
                    // Send POST request to update cart with the removal
                    fetch('/cart/update.js', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ updates })
                    })     
                    .then(() => window.location.reload());     
                } 
                else {
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('Error removing Route product:', error);
                window.location.reload();
            });
        } 
    }

    // Fires when navigating through browser history (back/forward buttons)
    window.addEventListener('pageshow', (e) => {
        // e.persisted = true means page was restored from browser cache
        if (e.persisted) {
            checkAndCleanupIfNeeded();
        }
    });

    // Extra fallback: some browsers don't set `persisted`
    window.addEventListener('popstate', (e) => {
        // Small delay to allow DOM to update after navigation
        setTimeout(() => {
            checkAndCleanupIfNeeded();
        }, 100);
    });

})();
// End Route Code