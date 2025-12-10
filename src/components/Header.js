import { Cart } from '../services/Cart.js';
import { Auth } from '../services/Auth.js';

export function Header() {
  const user = Auth.getUser();

  return `
    <header class="site-header">
      <div class="container header-content">
        <div class="logo">
          <a href="#" data-link>KAVA MERCH</a>
        </div>
        <nav class="main-nav">
          <ul>
            <li><a href="#" data-link>Home</a></li>
            <li><a href="#shop" data-link>Shop</a></li>
            <li><a href="#${user ? 'account' : 'login'}" data-link>${user ? 'Account' : 'Login'}</a></li>
          </ul>
        </nav>
        <div class="cart-icon">
          <a href="#cart" data-link>Cart (${Cart.count()})</a>
        </div>
      </div>
    </header>
  `;
}
