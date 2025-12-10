import { Cart } from '../services/Cart.js';
import { Auth } from '../services/Auth.js';

export function Checkout() {
    const cartItems = Cart.get();
    const total = Cart.total();

    // Redirect if empty
    if (cartItems.length === 0) {
        window.location.hash = 'shop';
        return '';
    }

    window.handleCheckout = (e) => {
        e.preventDefault();

        // Simulate processing
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = 'Processing...';
        btn.disabled = true;

        setTimeout(() => {
            // Create order object
            const order = {
                id: 'ORD-' + Math.floor(Math.random() * 10000),
                date: new Date().toISOString().split('T')[0],
                total: total,
                status: 'Processing',
                items: cartItems.map(item => ({
                    name: item.name,
                    image: item.images[0],
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            // Save order
            Auth.addOrder(order);

            // Clear cart
            Cart.clear();

            // Redirect to account or home
            alert('Order placed successfully!');
            if (Auth.getUser()) {
                window.location.hash = 'account';
            } else {
                window.location.hash = 'home';
            }
        }, 2000);
    };

    return `
    <div class="container" style="padding: var(--spacing-lg) 0;">
      <h1 style="margin-bottom: var(--spacing-lg); text-align: center;">Checkout</h1>
      
      <div class="checkout-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-xl);">
        
        <!-- Forms -->
        <div class="checkout-forms">
          <form onsubmit="handleCheckout(event)">
            
            <!-- Shipping -->
            <div style="margin-bottom: var(--spacing-lg);">
              <h3 style="margin-bottom: var(--spacing-md); border-bottom: 1px solid var(--color-border); padding-bottom: var(--spacing-xs);">Shipping Information</h3>
              
              <div style="display: grid; gap: var(--spacing-sm);">
                <div class="form-group">
                  <label style="display: block; margin-bottom: 4px; font-size: 0.9rem;">Full Name</label>
                  <input type="text" required style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; background: transparent; color: var(--color-text);">
                </div>
                
                <div class="form-group">
                  <label style="display: block; margin-bottom: 4px; font-size: 0.9rem;">Address</label>
                  <input type="text" required style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; background: transparent; color: var(--color-text);">
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-sm);">
                  <div class="form-group">
                    <label style="display: block; margin-bottom: 4px; font-size: 0.9rem;">City</label>
                    <input type="text" required style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; background: transparent; color: var(--color-text);">
                  </div>
                  <div class="form-group">
                    <label style="display: block; margin-bottom: 4px; font-size: 0.9rem;">Zip Code</label>
                    <input type="text" required style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; background: transparent; color: var(--color-text);">
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment -->
            <div style="margin-bottom: var(--spacing-lg);">
              <h3 style="margin-bottom: var(--spacing-md); border-bottom: 1px solid var(--color-border); padding-bottom: var(--spacing-xs);">Payment Details</h3>
              
              <div style="display: grid; gap: var(--spacing-sm);">
                <div class="form-group">
                  <label style="display: block; margin-bottom: 4px; font-size: 0.9rem;">Card Number</label>
                  <input type="text" placeholder="0000 0000 0000 0000" required style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; background: transparent; color: var(--color-text);">
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-sm);">
                  <div class="form-group">
                    <label style="display: block; margin-bottom: 4px; font-size: 0.9rem;">Expiry</label>
                    <input type="text" placeholder="MM/YY" required style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; background: transparent; color: var(--color-text);">
                  </div>
                  <div class="form-group">
                    <label style="display: block; margin-bottom: 4px; font-size: 0.9rem;">CVV</label>
                    <input type="text" placeholder="123" required style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; background: transparent; color: var(--color-text);">
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" class="btn" style="width: 100%; padding: 16px; font-size: 1.1rem;">Place Order ($${total.toFixed(2)})</button>
          </form>
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
          <div style="background-color: var(--color-secondary); padding: var(--spacing-md); border-radius: 4px; position: sticky; top: 100px;">
            <h3 style="margin-bottom: var(--spacing-md);">Order Summary</h3>
            
            <div style="margin-bottom: var(--spacing-md);">
              ${cartItems.map(item => `
                <div style="display: flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm);">
                  <img src="${item.images[0]}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                  <div>
                    <p style="font-size: 0.9rem; font-weight: 600;">${item.name}</p>
                    <p style="font-size: 0.8rem; color: var(--color-text-light);">Qty: ${item.quantity} x $${item.price.toFixed(2)}</p>
                  </div>
                  <div style="margin-left: auto; font-weight: 600;">
                    $${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              `).join('')}
            </div>

            <div style="border-top: 1px solid var(--color-border); padding-top: var(--spacing-sm);">
              <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-xs);">
                <span>Subtotal</span>
                <span>$${total.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-xs);">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.2rem; margin-top: var(--spacing-sm); border-top: 1px solid var(--color-border); padding-top: var(--spacing-sm);">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}
