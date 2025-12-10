import { products } from '../data/products.js';
import { ProductCard } from '../components/ProductCard.js';
import { KalapuBanner } from '../components/KalapuBanner.js';

export function Home() {
  const featuredProducts = products.slice(0, 4);

  return `
    <div class="home-page">
      <section class="hero">
        <div class="container">
          <h1>Island Roots, Modern Style</h1>
          <p>Premium apparel inspired by the Kava culture and the spirit of the islands.</p>
          <a href="#shop" class="btn" data-link>Shop Collection</a>
        </div>
      </section>

      ${KalapuBanner()}
      
      <section class="container">
        <h2 style="margin-bottom: var(--spacing-md); text-align: center;">Featured Arrivals</h2>
        <div class="product-grid">
          ${featuredProducts.map(product => ProductCard(product)).join('')}
        </div>
        <div style="text-align: center; margin-top: var(--spacing-md);">
          <a href="#shop" class="btn btn-outline" data-link>View All Products</a>
        </div>
      </section>
      <section class="newsletter">
        <div class="container">
          <h2>Join the Tribe</h2>
          <p>
            Sign up for exclusive offers, early access to new drops, and 10% off your first order.
          </p>
          <form onsubmit="handleNewsletterSubmit(event)" class="newsletter-form">
            <input type="email" name="email" placeholder="Enter your email address" required class="newsletter-input">
            <button type="submit" class="newsletter-btn">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  `;
}

// Global handler for newsletter submission
window.handleNewsletterSubmit = (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  alert(`Thanks for subscribing! A 10% off coupon has been sent to ${email}.`);
  e.target.reset();
};
