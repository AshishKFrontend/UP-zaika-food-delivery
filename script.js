document.addEventListener("DOMContentLoaded", () => {
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            document.body.classList.add("scrolled");
        } else {
            document.body.classList.remove("scrolled");
        }
    });

    const observeCards = () => {
        const cards = document.querySelectorAll('.food-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-card');
                }
            });
        }, { threshold: 0.1 }); 

        cards.forEach(card => {
            observer.observe(card);
        });
    };

    observeCards(); 
    updateWeeklyPromoCode();
    checkUserLogin();

    if(localStorage.getItem('zaika_theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.dark-mode-toggle').innerText = '☀️';
    }
});

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    let icon = document.querySelector('.dark-mode-toggle');
    if(document.body.classList.contains('dark-mode')){
        icon.innerText = '☀️';
        localStorage.setItem('zaika_theme', 'dark');
    } else {
        icon.innerText = '🌙';
        localStorage.setItem('zaika_theme', 'light');
    }
}

function filterCategory(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('search-food').value = '';

    let sections = document.querySelectorAll('.menu-category');
    sections.forEach(sec => {
        if(category === 'all' || sec.dataset.category === category) {
            sec.style.display = 'block';
            sec.querySelectorAll('.food-card').forEach(card => card.style.display = 'flex');
        } else {
            sec.style.display = 'none';
        }
    });
}

function filterMenu() {
    let input = document.getElementById('search-food').value.toLowerCase();
    let sections = document.querySelectorAll('.menu-category');
    
    if(input !== '') {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.filter-btn').classList.add('active'); 
    }

    sections.forEach(sec => {
        let hasVisibleCard = false;
        sec.style.display = 'block'; 

        let cards = sec.querySelectorAll('.food-card');
        cards.forEach(card => {
            let title = card.querySelector('h3').innerText.toLowerCase();
            if(title.includes(input)) {
                card.style.display = 'flex';
                hasVisibleCard = true;
            } else {
                card.style.display = 'none';
            }
        });

        if(!hasVisibleCard) sec.style.display = 'none';
    });
}

function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("active");
}

function updateWeeklyPromoCode() {
    const promoCodes = ["ZAIKA20", "NAWABI20", "YUMMY20", "LUCKNOW20", "SPICY20"];
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const weekNumber = Math.ceil(dayOfYear / 7);
    const codeIndex = weekNumber % promoCodes.length;
    const codeElement = document.getElementById("dynamic-promo-code");
    if (codeElement) codeElement.innerText = promoCodes[codeIndex];
}

function openSignIn() { document.getElementById('signInModal').style.display = 'flex'; }
function closeSignIn() { document.getElementById('signInModal').style.display = 'none'; }

function setUserAvatar(name) {
    let nameParts = name.trim().split(" ");
    let initials = nameParts[0][0].toUpperCase(); 
    if(nameParts.length > 1) { initials += nameParts[nameParts.length - 1][0].toUpperCase(); }
    
    let desktopBtn = document.querySelector('.desktop-sign-in');
    if(desktopBtn) {
        desktopBtn.innerText = initials; 
        desktopBtn.classList.add("user-avatar-btn"); 
        desktopBtn.onclick = () => {
            if(confirm(`Hello ${name}! Kya aap logout karna chahte hain?`)) { localStorage.removeItem('zaika_user_name'); location.reload(); }
        };
    }

    let hamburgerBtn = document.querySelector('.hamburger');
    if(hamburgerBtn) {
        hamburgerBtn.innerText = initials; 
        hamburgerBtn.classList.add("user-avatar-btn"); 
    }

    let mobileBtn = document.querySelector('.mobile-sign-in');
    if(mobileBtn) {
        mobileBtn.innerText = "Logout (" + name + ")";
        mobileBtn.style.background = "#e74c3c"; 
        mobileBtn.style.color = "white";
        mobileBtn.style.borderColor = "#e74c3c";
        mobileBtn.onclick = () => {
            if(confirm(`Hello ${name}! Kya aap logout karna chahte hain?`)) { localStorage.removeItem('zaika_user_name'); location.reload(); }
        };
    }
}

function checkUserLogin() {
    let savedName = localStorage.getItem('zaika_user_name');
    if(savedName) setUserAvatar(savedName);
}

function sendEmailData(subject, dataString, btnElement, originalBtnText, successMessage, cleanupFunction) {
    btnElement.innerText = "Processing...";
    btnElement.disabled = true;

    let form = document.createElement("form");
    form.action = "https://formsubmit.co/kashish80953@gmail.com";
    form.method = "POST";
    form.target = "hidden_iframe"; 

    let subjectField = document.createElement("input");
    subjectField.type = "hidden";
    subjectField.name = "_subject";
    subjectField.value = subject;
    form.appendChild(subjectField);

    let dataField = document.createElement("input");
    dataField.type = "hidden";
    dataField.name = "Message_Details";
    dataField.value = dataString;
    form.appendChild(dataField);

    let captchaField = document.createElement("input");
    captchaField.type = "hidden";
    captchaField.name = "_captcha";
    captchaField.value = "false";
    form.appendChild(captchaField);

    document.body.appendChild(form);
    form.submit();

    setTimeout(() => {
        document.body.removeChild(form);
        btnElement.innerText = originalBtnText;
        btnElement.disabled = false;
        
        alert(successMessage + "\n\n(🫸Thank You🫷)");
        
        if(cleanupFunction) cleanupFunction();
    }, 2500);
}

function submitSignIn() {
    let name = document.getElementById("login-name").value.trim();
    let phone = document.getElementById("login-phone").value.trim();
    let btn = document.getElementById("login-btn");
    
    if(name === "" || phone === "") { alert("Kripya dono details bharein!"); return; }

    let message = `Naya Customer Login Hua Hai:\nNaam: ${name}\nContact: ${phone}`;
    
    sendEmailData("Naya Customer Login - UP Zaika", message, btn, "Submit Details", "Aapki details successfully submit ho gayi hain! Shukriya.", () => {
        localStorage.setItem('zaika_user_name', name);
        setUserAvatar(name);
        document.getElementById("login-name").value = "";
        document.getElementById("login-phone").value = "";
        closeSignIn();
    });
}

function subscribeNewsletter() {
    let inputVal = document.getElementById("news-input").value.trim();
    let btn = document.getElementById("news-btn");

    if(inputVal === "") { alert("Kripya apna Number ya Email daalein!"); return; }

    let message = `Naya Subscriber Aaya Hai:\nContact Info: ${inputVal}`;

    sendEmailData("Naya Newsletter Subscriber - UP Zaika", message, btn, "Subscribe", "🎉 Shukriya! Ab aapko UP Zaika ke best offers milte rahenge.", () => {
        document.getElementById("news-input").value = ""; 
    });
}

let cart = [];
let appliedDiscount = 0; 

function copyPromoCode() {
    const codeText = document.getElementById("dynamic-promo-code").innerText;
    navigator.clipboard.writeText(codeText).then(() => { alert(`🎉 Promo Code '${codeText}' copy ho gaya! Cart mein apply karein.`); });
}

function applyPromoCode() {
    const inputCode = document.getElementById("promo-input").value.trim().toUpperCase();
    const currentValidCode = document.getElementById("dynamic-promo-code").innerText.toUpperCase();

    if (inputCode === currentValidCode) {
        appliedDiscount = 0.20; 
        alert("Mubarak ho! 20% discount apply ho gaya. 💸");
        updateCartUI();
    } else if (inputCode === "") { alert("Pehle code box mein enter karein!");
    } else { alert("Galat promo code! Kripya banner se sahi code copy karein."); appliedDiscount = 0; updateCartUI(); }
}

function addToCart(itemName, itemPrice) {
    cart.push({ name: itemName, price: itemPrice });
    document.getElementById('cart-count').innerText = cart.length;
    alert(`😋 ${itemName} cart mein add ho gaya!`);
}

function openCart() { updateCartUI(); document.getElementById('cartModal').style.display = 'flex'; }
function closeCart() { document.getElementById('cartModal').style.display = 'none'; }
function removeFromCart(index) { cart.splice(index, 1); document.getElementById('cart-count').innerText = cart.length; updateCartUI(); }

function updateCartUI() {
    let itemsContainer = document.getElementById('cart-items-container');
    let itemsHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p style="text-align:center; color:gray;">Cart khali hai. Kuch order karein!</p>';
        appliedDiscount = 0; 
        document.getElementById('promo-input').value = ''; 
    } else {
        cart.forEach((item, index) => {
            itemsHTML += `<div class="cart-item"><span>${item.name}</span><span>₹${item.price} <span class="remove-item" onclick="removeFromCart(${index})" title="Remove">✖</span></span></div>`;
            subtotal += item.price;
        });
        itemsContainer.innerHTML = itemsHTML;
    }

    let discountAmount = subtotal * appliedDiscount;
    let afterDiscountSubtotal = subtotal - discountAmount;
    let gst = Math.round(afterDiscountSubtotal * 0.05); 
    let total = Math.round(afterDiscountSubtotal + gst);

    document.getElementById('subtotal-amt').innerText = '₹' + subtotal;
    
    if (appliedDiscount > 0 && subtotal > 0) {
        document.getElementById('discount-row').style.display = 'flex';
        document.getElementById('discount-amt').innerText = '-₹' + Math.round(discountAmount);
    } else { document.getElementById('discount-row').style.display = 'none'; }

    document.getElementById('gst-amt').innerText = '₹' + gst;
    document.getElementById('total-amt').innerText = '₹' + total;
}

function checkout() {
    if(cart.length === 0) {
        alert("Pehle kuch khana add karein!");
        return;
    }

    let address = document.getElementById("checkout-address").value.trim();
    let userName = localStorage.getItem('zaika_user_name') || "Guest User";
    
    if(address === "") {
        alert("Kripya apna Delivery Address aur Mobile No. daalein!");
        return;
    }

    let btn = document.querySelector(".checkout-btn");
    
    let orderDetails = cart.map(item => `- ${item.name} (₹${item.price})`).join("\n");
    let totalAmount = document.getElementById('total-amt').innerText;
    let subTotal = document.getElementById('subtotal-amt').innerText;
    let discount = document.getElementById('discount-amt').innerText;

    let message = `Naya Order Received! 🚀\n\nCustomer: ${userName}\nAddress & Contact: ${address}\n\nOrder Details:\n${orderDetails}\n\nSubtotal: ${subTotal}\nDiscount: ${discount}\nTotal Bill: ${totalAmount}`;

    sendEmailData(`Naya Food Order - ${totalAmount}`, message, btn, "Checkout & Pay", `Shukriya ${userName}! Aapka ${totalAmount} ka order confirm ho gaya hai. Jald hi aapka khana pahuchega! 🛵`, () => {
        cart = []; 
        appliedDiscount = 0;
        document.getElementById('promo-input').value = '';
        document.getElementById("checkout-address").value = '';
        document.getElementById('cart-count').innerText = 0;
        updateCartUI();
        closeCart();
    });
}