export function ProductCard(product) {
    return `
    <div class="product-card">
      <a href="#product/${product.id}" data-link class="product-link">
        <div class="product-image-wrapper">
          <img src="${product.images[0]}" alt="${product.altText}" loading="lazy">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="price">$${product.price.toFixed(2)}</p>
        </div>
      </a>
    </div>
  `;
}
