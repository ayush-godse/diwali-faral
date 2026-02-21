let cart = {};

function addToCart(product) {
    if (cart[product]) {
        cart[product]++;
    } else {
        cart[product] = 1;
    }
    updateCartCount();
}

function updateCartCount() {
    let count = 0;
    for (let item in cart) {
        count += cart[item];
    }
    document.getElementById("cartCount").innerText = count;
}

function openCart() {
    const list = document.getElementById("cartItems");
    list.innerHTML = "";

    if (Object.keys(cart).length === 0) {
        list.innerHTML = "<li>Cart is empty</li>";
    } else {
        for (let item in cart) {
            list.innerHTML += `
                <li>
                    ${item} (x${cart[item]})
                    <button onclick="removeItem('${item}')">❌</button>
                </li>
            `;
        }
    }

    document.getElementById("cartModal").style.display = "flex";
}

function closeCart() {
    document.getElementById("cartModal").style.display = "none";
}

function removeItem(item) {
    delete cart[item];
    updateCartCount();
    openCart();
}

/* SEARCH FUNCTION */
function searchProduct() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let products = document.querySelectorAll(".product-card");

    products.forEach(product => {
        let name = product.dataset.name;
        product.style.display = name.includes(input) ? "block" : "none";
    });
}
