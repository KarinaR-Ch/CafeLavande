// Cart functionality
let cart = [];

// Mobile Menu
document.addEventListener('DOMContentLoaded', function() {
    const menuOpenBtn = document.querySelector('.menu-btn-open');
    const menuCloseBtn = document.querySelector('.menu-btn-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    if (menuOpenBtn && menuCloseBtn && mobileMenu) {
        menuOpenBtn.addEventListener('click', function() {
            mobileMenu.classList.add('is-open');
            body.classList.add('is-scroll-disabled');
        });

        menuCloseBtn.addEventListener('click', function() {
            mobileMenu.classList.remove('is-open');
            body.classList.remove('is-scroll-disabled');
        });

        // Close menu when clicking on links
        const menuLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('is-open');
                body.classList.remove('is-scroll-disabled');
            });
        });
    }

    // Modal Window
    const modalOpenBtns = document.querySelectorAll('.modal-btn-open');
    const modalCloseBtn = document.querySelector('.modal-btn-close');
    const backdrop = document.querySelector('.backdrop');

    if (modalOpenBtns.length > 0 && modalCloseBtn && backdrop) {
        modalOpenBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                backdrop.classList.remove('is-hidden');
                body.classList.add('is-scroll-disabled');
            });
        });

        modalCloseBtn.addEventListener('click', function() {
            backdrop.classList.add('is-hidden');
            body.classList.remove('is-scroll-disabled');
        });

        backdrop.addEventListener('click', function(e) {
            if (e.target === backdrop) {
                backdrop.classList.add('is-hidden');
                body.classList.remove('is-scroll-disabled');
            }
        });
    }

    // Success Modal
    const successModal = document.getElementById('success-modal');
    const successOk = document.getElementById('success-ok');

    if (successModal && successOk) {
        successOk.addEventListener('click', function() {
            successModal.classList.remove('active');
            body.classList.remove('is-scroll-disabled');
        });

        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.classList.remove('active');
                body.classList.remove('is-scroll-disabled');
            }
        });
    }

    // Form Validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const inputs = form.querySelectorAll('input[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (isValid) {
                // Show success modal instead of alert
                successModal.classList.add('active');
                body.classList.add('is-scroll-disabled');
                form.reset();
                
                // Close modal window if it's open
                if (backdrop && !backdrop.classList.contains('is-hidden')) {
                    backdrop.classList.add('is-hidden');
                }
                
                // Close checkout modal if it's open
                const checkoutModal = document.getElementById('checkout-modal');
                if (checkoutModal && checkoutModal.classList.contains('active')) {
                    checkoutModal.classList.remove('active');
                }
            } else {
                alert('Please fill in all required fields.');
            }
        });
    });

    // Menu Modals
    const menuCategories = document.querySelectorAll('.menu-category');
    const menuModals = document.querySelectorAll('.menu-modal');
    const menuModalCloses = document.querySelectorAll('.menu-modal__close');

    // Open modal window when clicking on category
    menuCategories.forEach(category => {
        category.addEventListener('click', function() {
            const categoryType = this.getAttribute('data-category');
            const modal = document.getElementById(`${categoryType}-modal`);
            
            if (modal) {
                modal.classList.add('active');
                body.classList.add('is-scroll-disabled');
                updateModalButtons(); // Оновлюємо кнопки при відкритті модального вікна
            }
        });
    });

    // Close modal window
    menuModalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.menu-modal');
            modal.classList.remove('active');
            body.classList.remove('is-scroll-disabled');
        });
    });

    // Close modal window when clicking on the background
    menuModals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                body.classList.remove('is-scroll-disabled');
            }
        });
    });

    // Cart functionality
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const cartClose = document.getElementById('cart-close');
    const cartContent = document.getElementById('cart-content');
    const cartEmpty = document.getElementById('cart-empty');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutClose = document.getElementById('checkout-close');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');

    // Load cart from localStorage
    loadCart();

    // Додаємо обробник подій для делегування на модальних вікнах
    document.addEventListener('click', function(e) {
        // Обробка кнопок "Add to Cart"
        if (e.target.classList.contains('menu-modal__add-btn')) {
            const id = e.target.getAttribute('data-id');
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            const image = e.target.getAttribute('data-image');
            
            addToCart(id, name, price, image);
            updateCartDisplay();
            updateModalButtons(); // Оновлюємо всі кнопки в модальних вікнах
            
            // Show success message
            const originalText = e.target.textContent;
            e.target.textContent = 'Added!';
            setTimeout(() => {
                e.target.textContent = originalText;
            }, 1000);
        }
        
        // Обробка кнопок зміни кількості в модальних вікнах
        if (e.target.classList.contains('modal-quantity-btn')) {
            const id = e.target.getAttribute('data-id');
            const change = parseInt(e.target.getAttribute('data-change'));
            updateQuantity(id, change);
            updateCartDisplay();
            updateModalButtons(); // Оновлюємо всі кнопки в модальних вікнах
        }
    });

    // Open cart modal
    cartIcon.addEventListener('click', function() {
        cartModal.classList.add('active');
        body.classList.add('is-scroll-disabled');
    });

    // Close cart modal
    cartClose.addEventListener('click', function() {
        cartModal.classList.remove('active');
        body.classList.remove('is-scroll-disabled');
    });

    // Open checkout modal
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        cartModal.classList.remove('active');
        checkoutModal.classList.add('active');
        updateCheckoutDisplay();
    });

    // Close checkout modal
    checkoutClose.addEventListener('click', function() {
        checkoutModal.classList.remove('active');
        body.classList.remove('is-scroll-disabled');
    });

    // Checkout form submission
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        const inputs = checkoutForm.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (isValid) {
            // Show success modal
            successModal.classList.add('active');
            body.classList.add('is-scroll-disabled');
            
            // Clear cart and close modals
            cart = [];
            saveCart();
            updateCartDisplay();
            updateModalButtons(); // Оновлюємо кнопки після очищення кошика
            checkoutModal.classList.remove('active');
            checkoutForm.reset();
        } else {
            alert('Please fill in all required fields.');
        }
    });

    // Cart functions
    function addToCart(id, name, price, image) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });
        }
        
        saveCart();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartDisplay();
        updateModalButtons(); // Оновлюємо кнопки після видалення товару
    }

    function updateQuantity(id, change) {
        const item = cart.find(item => item.id === id);
        
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                removeFromCart(id);
            } else {
                saveCart();
                updateCartDisplay();
            }
        }
    }

    function getCartTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function getCartCount() {
        return cart.reduce((count, item) => count + item.quantity, 0);
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        updateCartDisplay();
        updateModalButtons(); // Оновлюємо кнопки при завантаженні сторінки
    }

    function updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        cartCount.textContent = getCartCount();
        
        // Update cart content
        cartContent.innerHTML = '';
        
        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            checkoutBtn.disabled = true;
        } else {
            cartEmpty.style.display = 'none';
            checkoutBtn.disabled = false;
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img class="cart-item__image" src="${item.image}" alt="${item.name}">
                    <div class="cart-item__details">
                        <h3 class="cart-item__name">${item.name}</h3>
                        <p class="cart-item__price">$${item.price.toFixed(2)}</p>
                        <div class="cart-item__quantity">
                            <button class="cart-item__quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                            <span class="cart-item__quantity-value">${item.quantity}</span>
                            <button class="cart-item__quantity-btn" data-id="${item.id}" data-change="1">+</button>
                        </div>
                        <button class="cart-item__remove" data-id="${item.id}">Remove</button>
                    </div>
                `;
                cartContent.appendChild(cartItem);
            });
            
            // Add event listeners to quantity buttons
            const quantityButtons = cartContent.querySelectorAll('.cart-item__quantity-btn');
            quantityButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const change = parseInt(this.getAttribute('data-change'));
                    updateQuantity(id, change);
                });
            });
            
            // Add event listeners to remove buttons
            const removeButtons = cartContent.querySelectorAll('.cart-item__remove');
            removeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    removeFromCart(id);
                });
            });
        }
        
        // Update total
        cartTotal.textContent = `$${getCartTotal().toFixed(2)}`;
    }

    function updateCheckoutDisplay() {
        checkoutItems.innerHTML = '';
        
        cart.forEach(item => {
            const checkoutItem = document.createElement('div');
            checkoutItem.className = 'checkout-item';
            checkoutItem.innerHTML = `
                <span class="checkout-item__name">${item.name}</span>
                <span class="checkout-item__quantity">x${item.quantity}</span>
                <span class="checkout-item__price">$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            checkoutItems.appendChild(checkoutItem);
        });
        
        checkoutTotal.textContent = `$${getCartTotal().toFixed(2)}`;
    }

    // Нова функція для оновлення кнопок у модальних вікнах
    function updateModalButtons() {
        const addToCartButtons = document.querySelectorAll('.menu-modal__add-btn');
        
        addToCartButtons.forEach(button => {
            const id = button.getAttribute('data-id');
            const itemInCart = cart.find(item => item.id === id);
            
            if (itemInCart) {
                // Замінюємо кнопку на блок з кількістю
                const quantityControl = document.createElement('div');
                quantityControl.className = 'menu-modal__quantity-control';
                quantityControl.innerHTML = `
                    <button class="menu-modal__quantity-btn modal-quantity-btn" data-id="${id}" data-change="-1">-</button>
                    <span class="menu-modal__quantity-value">${itemInCart.quantity}</span>
                    <button class="menu-modal__quantity-btn modal-quantity-btn" data-id="${id}" data-change="1">+</button>
                `;
                
                // Знаходимо батьківський елемент та замінюємо кнопку
                const parent = button.parentNode;
                parent.replaceChild(quantityControl, button);
            }
        });
        
        // Також оновлюємо кнопки, які вже були замінені на контроли кількості
        const quantityControls = document.querySelectorAll('.menu-modal__quantity-control');
        quantityControls.forEach(control => {
            const id = control.querySelector('.modal-quantity-btn').getAttribute('data-id');
            const itemInCart = cart.find(item => item.id === id);
            
            if (!itemInCart) {
                // Якщо товар більше не в кошику, повертаємо кнопку "Add to Cart"
                const originalButton = document.createElement('button');
                originalButton.className = 'menu-modal__add-btn';
                originalButton.setAttribute('data-id', id);
                originalButton.setAttribute('data-name', control.getAttribute('data-name'));
                originalButton.setAttribute('data-price', control.getAttribute('data-price'));
                originalButton.setAttribute('data-image', control.getAttribute('data-image'));
                originalButton.textContent = 'Add to Cart';
                
                const parent = control.parentNode;
                parent.replaceChild(originalButton, control);
            } else {
                // Оновлюємо значення кількості
                const quantityValue = control.querySelector('.menu-modal__quantity-value');
                quantityValue.textContent = itemInCart.quantity;
            }
        });
    }

    // Header scroll behavior for desktop
    if (window.innerWidth >= 1280) {
        let lastScrollTop = 0;
        const header = document.querySelector('.header');
        const headerHeight = header.offsetHeight;
        
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
                // Scrolling down
                header.classList.add('hidden');
            } else {
                // Scrolling up
                header.classList.remove('hidden');
            }
            
            lastScrollTop = scrollTop;
        });
    }
});
