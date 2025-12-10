import { Auth } from '../services/Auth.js';

export function Login() {
    window.handleLogin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        const result = Auth.login(email, password);
        if (result.success) {
            window.location.hash = 'account';
            window.location.reload(); // Reload to update header
        } else {
            alert(result.message);
        }
    };

    return `
    <div class="container" style="max-width: 400px; padding: var(--spacing-xl) 0;">
      <h1 style="text-align: center; margin-bottom: var(--spacing-md);">Welcome Back</h1>
      <form onsubmit="handleLogin(event)" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email</label>
          <input type="email" name="email" required style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px;">
        </div>
        <div>
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Password</label>
          <input type="password" name="password" required style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px;">
        </div>
        <button type="submit" class="btn" style="width: 100%;">Sign In</button>
      </form>
      <p style="text-align: center; margin-top: var(--spacing-md); color: var(--color-text-light);">
        Don't have an account? <a href="#register" style="color: var(--color-primary); font-weight: 600;">Create one</a>
      </p>
    </div>
  `;
}
