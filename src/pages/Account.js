import { Auth } from '../services/Auth.js';

export function Account() {
  const user = Auth.getUser();

  if (!user) {
    window.location.hash = 'login';
    return '';
  }

  window.Auth = Auth; // Expose for logout button

  const orders = Auth.getOrders();

  return `
    <div class="container" style="padding: var(--spacing-lg) 0;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
        <h1>My Account</h1>
        <button onclick="Auth.logout()" class="btn btn-outline">Sign Out</button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: var(--spacing-lg);">
        <div class="account-details" style="background: var(--color-secondary); padding: var(--spacing-md); border-radius: 8px; height: fit-content;">
          <h3 style="margin-bottom: var(--spacing-sm);">Profile</h3>
          <p style="margin-bottom: 0.5rem;"><strong>Name:</strong> ${user.name}</p>
          <p style="margin-bottom: 0.5rem;"><strong>Email:</strong> ${user.email}</p>
          <p><strong>Member Since:</strong> ${new Date(user.joinedDate).toLocaleDateString()}</p>
        </div>

        <div class="order-history">
          <h3 style="margin-bottom: var(--spacing-md);">Order History</h3>
          ${orders.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
              ${orders.map(order => `
                <div class="order-card" style="border: 1px solid var(--color-border); border-radius: 8px; padding: var(--spacing-md);">
                  <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm); border-bottom: 1px solid var(--color-border); padding-bottom: var(--spacing-sm);">
                    <span style="font-weight: 600;">${order.id}</span>
                    <span style="color: var(--color-text-light);">${order.date}</span>
                  </div>
                  <div style="margin-bottom: var(--spacing-sm);">
                    ${order.items.map(item => `
                      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                        <p style="font-size: 0.9rem; margin: 0;">${item.name}</p>
                      </div>
                    `).join('')}
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--spacing-sm);">
                    <span style="font-weight: 600;">Total: $${order.total.toFixed(2)}</span>
                    <span style="background: #e5e5e5; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">${order.status}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : '<p>No orders yet.</p>'}
        </div>
      </div>
    </div>
  `;
}
