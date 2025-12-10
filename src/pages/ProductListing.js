import { products } from '../data/products.js';
import { ProductCard } from '../components/ProductCard.js';

export function ProductListing() {
    return `
    <div class="shop-page container" style="padding-top: var(--spacing-md);">
      <h1 style="margin-bottom: var(--spacing-md);">Shop All</h1>
      <div class="product-grid">
        ${products.map(product => ProductCard(product)).join('')}
      </div>
    </div>
  `;
}
