import { Marketing } from '../services/Marketing.js';

export function KalapuBanner() {
    // Initialize logic after render
    setTimeout(() => {
        initBannerLogic();
    }, 0);

    return `
    <section class="kalapu-advanced-banner">
        <div class="kalapu-slides">
            <div class="k-slide active" data-index="0">
                <div class="k-image" style="background-image: url('/public/images/products/ks-letterman-1/KSletterman1_on_a_model.jpg')"></div>
            </div>
            <div class="k-slide" data-index="1">
                <div class="k-image" style="background-image: url('/public/images/products/ks-letterman-2/KSletterman2_on_a_model.jpg')"></div>
            </div>
            <div class="k-slide" data-index="2">
                <div class="k-image" style="background-image: url('/public/images/products/ks-letterman-1/KSletterman1_flat_lay.jpg')"></div>
            </div>
            <div class="k-slide" data-index="3">
                <div class="k-image" style="background-image: url('/public/images/products/ks-letterman-2/KSletterman2_flat_lay.jpg')"></div>
            </div>
        </div>

        <div class="k-overlay">
            <div class="k-content">
                <div class="k-header">
                    <span class="k-subtitle">Introducing</span>
                    <h2 class="k-title">
                        <span class="word-1">Kalapu</span>
                        <span class="word-2">Steelers</span>
                    </h2>
                    <p class="k-tagline">Official Fan Club Collection</p>
                </div>

                <div class="k-preorder-form" id="preorder-form-container">
                    <h3>Pre-Order Now</h3>
                    <form id="kalapu-preorder-form">
                        <div class="form-row">
                            <select name="jacket" required>
                                <option value="" disabled selected>Select Jacket</option>
                                <option value="ks-letterman-1">Kava Club Varsity (Navy/Cream)</option>
                                <option value="ks-letterman-2">Fan Club Bomber (Grey)</option>
                            </select>
                            <select name="size" required>
                                <option value="" disabled selected>Size</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="2XL">2XL</option>
                            </select>
                        </div>
                        <div class="form-row">
                            <input type="email" name="email" placeholder="Your Email Address" required />
                        </div>
                        <button type="submit" class="k-btn">Reserve & Join Waitlist</button>
                    </form>
                    <p class="k-success-msg" id="k-success-msg" style="display: none;">You're on the list! We'll notify you when it drops.</p>
                </div>
            </div>
        </div>
        
        <div class="k-progress">
            <div class="k-bar"></div>
        </div>
    </section>
    `;
}

function initBannerLogic() {
    const slides = document.querySelectorAll('.k-slide');
    const progressBar = document.querySelector('.k-bar');
    const form = document.getElementById('kalapu-preorder-form');
    const successMsg = document.getElementById('k-success-msg');

    let currentIndex = 0;
    const intervalTime = 15000; // 15 seconds

    // Cleanup previous interval if exists
    if (window.kalapuInterval) clearInterval(window.kalapuInterval);

    function nextSlide() {
        slides[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add('active');

        // Reset progress bar animation
        progressBar.style.animation = 'none';
        progressBar.offsetHeight; /* trigger reflow */
        progressBar.style.animation = `progress ${intervalTime}ms linear infinite`;
    }

    // Start Loop
    window.kalapuInterval = setInterval(nextSlide, intervalTime);

    // Initial progress bar start
    if (progressBar) {
        progressBar.style.animation = `progress ${intervalTime}ms linear infinite`;
    }

    // Form Handler
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = {
                jacket: formData.get('jacket'),
                size: formData.get('size'),
                email: formData.get('email')
            };

            // Save to Marketing Service (Local Storage)
            Marketing.savePreorder(data);
            Marketing.saveEmail(data.email);

            // Send to Backend API for Email Notification
            fetch('/api/preorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(result => {
                    console.log('Server response:', result);
                })
                .catch(error => {
                    console.error('Error sending preorder to server:', error);
                });

            // Show success
            form.style.display = 'none';
            successMsg.style.display = 'block';
        });
    }
}
