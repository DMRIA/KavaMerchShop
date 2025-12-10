import { Cart } from '../services/Cart.js';

export function CartPage() {
  // Expose render function globally so inline handlers can call it
  window.renderCart = () => {
    const cartItems = Cart.get();
    const savedItems = Cart.getSaved();
    const container = document.getElementById('cart-container');
    if (!container) return;

    // Helper to generate quantity options
    const getQuantityOptions = (currentQty) => {
      let options = '';
      for (let i = 1; i <= 10; i++) {
        options += `<option value="${i}" ${i === currentQty ? 'selected' : ''}>${i}</option>`;
      }
      // If quantity is > 10, we might want to show it as an option or handle it differently, 
      // but for now let's just append it if it's not in the range
      if (currentQty > 10) {
        options += `<option value="${currentQty}" selected>${currentQty}</option>`;
      }
      return options;
    };

    const renderCartItem = (item, isSaved = false) => `
      <div class="cart-item" style="display: flex; gap: var(--spacing-md); padding: var(--spacing-md); border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-white); margin-bottom: var(--spacing-sm);">
        <div class="cart-item-image" style="width: 120px; height: 120px; flex-shrink: 0;">
          <img src="${item.images[0]}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">
        </div>
        <div class="cart-item-details" style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--color-primary);">${item.name}</h3>
              <p class="price" style="font-weight: 700; font-size: 1.1rem;">$${item.price.toFixed(2)}</p>
            </div>
            <p style="color: var(--color-green, #007600); font-size: 0.9rem; margin-bottom: 0.5rem;">In Stock</p>
            ${item.size ? `<p style="font-size: 0.9rem; color: var(--color-text-light);">Size: ${item.size}</p>` : ''}
          </div>
          
          <div class="cart-actions" style="display: flex; align-items: center; gap: var(--spacing-md); flex-wrap: wrap;">
            ${!isSaved ? `
              <div class="quantity-controls" style="display: flex; align-items: center; gap: 0.5rem;">
                <label style="font-size: 0.9rem;">Qty:</label>
                <select 
                  onchange="Cart.updateQuantity('${item.cartItemId}', this.value); renderCart();"
                  style="padding: 4px 8px; border: 1px solid var(--color-border); border-radius: 4px; background: #f0f2f2; box-shadow: 0 1px 0 rgba(255,255,255,.6) inset; cursor: pointer;">
                  ${getQuantityOptions(item.quantity)}
                </select>
              </div>
            ` : ''}
            
            <div style="display: flex; gap: var(--spacing-sm); font-size: 0.9rem;">
              ${!isSaved ? `
                <button onclick="Cart.remove('${item.cartItemId}'); renderCart();" style="color: #007185; cursor: pointer;">Delete</button>
                <span style="color: var(--color-border);">|</span>
                <button onclick="Cart.saveForLater('${item.cartItemId}'); renderCart();" style="color: #007185; cursor: pointer;">Save for later</button>
              ` : `
                <button onclick="Cart.moveToCart('${item.cartItemId}'); renderCart();" style="color: #007185; cursor: pointer;">Move to Cart</button>
                <span style="color: var(--color-border);">|</span>
                <button onclick="Cart.removeSaved('${item.cartItemId}'); renderCart();" style="color: #007185; cursor: pointer;">Delete</button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;

    const emptyCartHtml = `
      <div class="container" style="padding: var(--spacing-xl) 0; text-align: center;">
        <h2>Your cart is empty</h2>
        <p style="margin-bottom: var(--spacing-md);">Looks like you haven't added any items yet.</p>
        <a href="#shop" class="btn" data-link>Start Shopping</a>
      </div>
    `;

    // Main Layout
    let contentHtml = '';

    if (cartItems.length === 0 && savedItems.length === 0) {
      contentHtml = emptyCartHtml;
    } else {
      contentHtml = `
        <div class="container" style="padding: var(--spacing-lg) 0;">
          <h1 style="margin-bottom: var(--spacing-md);">Shopping Cart</h1>
          
          <div class="cart-layout" style="display: grid; grid-template-columns: 1fr 300px; gap: var(--spacing-lg);">
            
            <!-- Left Column: Cart Items -->
            <div class="cart-main">
              ${cartItems.length > 0 ? `
                <div class="cart-list" style="margin-bottom: var(--spacing-lg);">
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: var(--spacing-xs); margin-bottom: var(--spacing-md);">
                    <span style="font-size: 1.2rem; font-weight: 500;">Shopping Cart</span>
                    <span style="color: var(--color-text-light);">Price</span>
                  </div>
                  ${cartItems.map(item => renderCartItem(item)).join('')}
                  
                  <div style="text-align: right; margin-top: var(--spacing-sm);">
                    <span style="font-size: 1.2rem;">Subtotal (${Cart.count()} items): <b>$${Cart.total().toFixed(2)}</b></span>
                  </div>
                </div>
              ` : `
                <div style="padding: var(--spacing-md); background: var(--color-secondary); border-radius: 8px; margin-bottom: var(--spacing-lg);">
                  <p>Your cart is empty. <a href="#shop" style="color: #007185;">Shop now</a></p>
                </div>
              `}

              <!-- Saved for Later -->
              ${savedItems.length > 0 ? `
                <div class="saved-list" style="margin-top: var(--spacing-xl);">
                  <h2 style="font-size: 1.5rem; margin-bottom: var(--spacing-md); border-bottom: 1px solid var(--color-border); padding-bottom: var(--spacing-xs);">Saved for later (${savedItems.length} items)</h2>
                  ${savedItems.map(item => renderCartItem(item, true)).join('')}
                </div>
              ` : ''}
            </div>

            <!-- Right Column: Summary -->
            <div class="cart-sidebar">
              ${cartItems.length > 0 ? `
                <div class="cart-summary" style="background-color: var(--color-secondary); padding: var(--spacing-md); border-radius: 8px; position: sticky; top: 100px;">
                  <div style="margin-bottom: var(--spacing-md);">
                    <span style="font-size: 1.2rem;">Subtotal (${Cart.count()} items):</span>
                    <div style="font-size: 1.5rem; font-weight: 700; margin-top: 4px;">$${Cart.total().toFixed(2)}</div>
                  </div>
                  
                  <div style="display: flex; gap: 8px; margin-bottom: var(--spacing-md);">
                    <input type="checkbox" id="gift" style="margin-top: 4px;">
                    <label for="gift" style="font-size: 0.9rem;">This order contains a gift</label>
                  </div>

                  <a href="#checkout" class="btn" style="width: 100%; text-align: center; background-color: #ffd814; color: #000; border: 1px solid #fcd200; border-radius: 20px;">Proceed to Checkout</a>
                </div>
              ` : ''}
            </div>

          </div>
        </div>
        
        <style>
          @media (max-width: 900px) {
            .cart-layout {
              grid-template-columns: 1fr !important;
            }
            .cart-sidebar {
              order: -1; /* Show summary on top on mobile */
              margin-bottom: var(--spacing-md);
            }
          }
        </style>
      `;
    }

    container.innerHTML = contentHtml;
  };

  // Initial render wrapper
  setTimeout(() => window.renderCart(), 0);
  return `<div id="cart-container"></div>`;
}
