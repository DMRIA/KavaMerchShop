import { Header } from './components/Header.js'
import { Footer } from './components/Footer.js'
import { Home } from './pages/Home.js'
import { ProductListing } from './pages/ProductListing.js'
import { ProductDetail } from './pages/ProductDetail.js'
import { CartPage } from './pages/Cart.js'
import { Login } from './pages/Login.js'
import { Register } from './pages/Register.js'
import { Account } from './pages/Account.js'
import { Checkout } from './pages/Checkout.js'

const app = document.querySelector('#app')

const router = async () => {
    // Simple hash routing
    let hash = location.hash.slice(1) || '/'

    // Handle cases like #/shop vs #shop
    if (hash.startsWith('/')) hash = hash.slice(1)
    if (hash === '') hash = 'home' // Default to home

    let pageContent = ''

    if (hash === 'home') {
        pageContent = Home()
    } else if (hash === 'shop') {
        pageContent = ProductListing()
    } else if (hash === 'cart') {
        pageContent = CartPage()
    } else if (hash === 'checkout') {
        pageContent = Checkout()
    } else if (hash === 'login') {
        pageContent = Login()
    } else if (hash === 'register') {
        pageContent = Register()
    } else if (hash === 'account') {
        pageContent = Account()
    } else if (hash.startsWith('product/')) {
        const id = hash.split('/')[1]
        pageContent = ProductDetail(id)
    } else {
        pageContent = Home()
    }

    app.innerHTML = `
    ${Header()}
    <main id="main-content">
      ${pageContent}
    </main>
    ${Footer()}
  `

    window.scrollTo(0, 0)
}

window.addEventListener('hashchange', router)
window.addEventListener('load', router)
