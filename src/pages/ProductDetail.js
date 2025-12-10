import { products } from '../data/products.js';
import { Cart } from '../services/Cart.js';

export function ProductDetail(id) {
  const product = products.find(p => p.id === id);

  if (!product) {
    return `<div class="container" style="padding: var(--spacing-xl) 0; text-align: center;"><h2>Product not found</h2><a href="#shop" class="btn">Back to Shop</a></div>`;
  }

  // Simple gallery logic will be handled in main.js event delegation or inline script if needed, 
  // but for now we just render the structure.

  // We attach the event listener after the HTML is inserted in main.js, 
  // but since we are returning a string here, we'll use a global function or inline event handler that calls a module method exposed globally?
  // A cleaner way in vanilla JS without a framework is to bind events after render. 
  // For simplicity in this "no-build" setup, I'll expose a global helper or just use an inline onclick that calls a globally accessible function.
  // Let's expose Cart globally for this simple app.
  window.Cart = Cart;
  window.currentProduct = product;

  return `
    <div class="container product-detail">
      <div class="detail-gallery">
        <img src="${product.images[0]}" alt="${product.altText}" class="main-image" id="mainImage">
        <div class="thumbnail-list">
          ${product.images.map((img, index) => `
            <img src="${img}" class="thumbnail ${index === 0 ? 'active' : ''}" onclick="document.getElementById('mainImage').src='${img}'; document.querySelectorAll('.thumbnail').forEach(el => el.classList.remove('active')); this.classList.add('active');">
          `).join('')}
        </div>
      </div>
      
      <div class="detail-info">
        <h1>${product.name}</h1>
        <p class="detail-price">$${product.price.toFixed(2)}</p>
        
        <div class="detail-description">
          <p style="margin-bottom: 1rem;">${product.description}</p>
          <p>${product.details}</p>
        </div>

        ${product.sizes ? `
          <div class="size-selector" style="margin: var(--spacing-md) 0;">
            <label for="size-select" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Size:</label>
            <select id="size-select" style="padding: 8px; border-radius: 4px; border: 1px solid var(--color-border); width: 100%; max-width: 200px;">
              ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
            </select>
          </div>
        ` : ''}
        
        <button class="add-to-cart-btn" onclick="
          const sizeSelect = document.getElementById('size-select');
          const size = sizeSelect ? sizeSelect.value : undefined;
          Cart.add({ ...currentProduct, size }); 
          alert('Added to cart!');
        ">Add to Cart</button>
      </div>
    </div>
  `;
}
