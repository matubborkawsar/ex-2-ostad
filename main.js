fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
        let productWrapper = document.querySelector(".product-wrapper");
        productWrapper.innerHTML = "";

        data.forEach((product) => {
            let productHTML = `
                <div class="product">
                    <div class="thumbnail">
                        <img src="${product.image}" alt="${product.title}" />
                    </div>
                    <div class="product-info">
                        <h3><a href="#">${product.title}</a></h3>
                        <h3 class="price"><span>${product.price}</span> USD</h3>
                        <p class="description">${product.description}</p>
                    </div>
                    <div class="button add-to-cart-button">Add to cart</div>
                </div>
            `;

            productWrapper.innerHTML += productHTML;
        });

        let addToCartButtons = document.querySelectorAll(".add-to-cart-button");
        addToCartButtons.forEach((button) => {
            button.addEventListener("click", () => {
                let product = button.closest(".product");
                let productName = product.querySelector("h3 a").innerText;
                let productPrice =
                    product.querySelector(".price span").innerText;
                let productImg = product.querySelector(".thumbnail img").src;

                createCartProduct(productName, productPrice, productImg);

                successMsg.classList.add("active");
                setTimeout(() => {
                    successMsg.classList.remove("active");
                }, 2000);
            });
        });
    });

let cartButton = document.querySelector(".cart-button");
let cart = document.querySelector(".cart-container");

cartButton.addEventListener("click", () => {
    cart.classList.toggle("active");
});

function updateItems() {
    let totalItems = 0;
    document
        .querySelectorAll(".cart-product .quantity p")
        .forEach((quantity) => {
            totalItems += parseInt(quantity.innerText);
        });

    let totalItemsElement = document.querySelector(".subtotal h3");
    if (totalItemsElement) {
        totalItemsElement.innerText = `Total: ${totalItems} Items`;
    }
}

function updateSubtotal() {
    let subtotal = document.querySelector(".subtotal .price span");
    let total = 0;
    document.querySelectorAll(".cart-product").forEach((product) => {
        let price = parseFloat(product.querySelector(".price span").innerText);
        let quantity = parseInt(product.querySelector(".quantity p").innerText);
        total += price * quantity;
    });
    subtotal.innerText = total.toFixed(2);
}

function createCartProduct(productName, productPrice, productImg) {
    let cartProductWrapper = document.querySelector(
        ".cart-container .cart-product-wrapper"
    );

    if (!cartProductWrapper) {
        cartProductWrapper = document.createElement("div");
        cartProductWrapper.classList.add("cart-product-wrapper");
        document
            .querySelector(".cart-container")
            .appendChild(cartProductWrapper);
    }

    let existingProduct = [...cartProductWrapper.children].find(
        (product) => product.querySelector("h3 a").innerText === productName
    );

    if (existingProduct) {
        let quantityElement = existingProduct.querySelector(".quantity p");
        quantityElement.innerText = parseInt(quantityElement.innerText) + 1;
    } else {
        let cartProduct = document.createElement("div");
        cartProduct.classList.add("cart-product");

        cartProduct.innerHTML = `
            <div class="thumbnail">
                <img src="${productImg}" alt="${productName}" />
            </div>
            <div class="product-info">
                <h3><a href="#">${productName}</a></h3>
                <div class="calculation">
                    <div class="quantity">
                        <div class="button decrease">-</div>
                        <p>1</p>
                        <div class="button increase">+</div>
                    </div>
                    <h3 class="price"><span>${productPrice}</span> USD</h3>
                </div>
            </div>
            <div class="delete">x</div>
        `;

        cartProductWrapper.appendChild(cartProduct);

        let increaseButton = cartProduct.querySelector(".increase");
        let decreaseButton = cartProduct.querySelector(".decrease");
        let quantityElement = cartProduct.querySelector(".quantity p");

        increaseButton.addEventListener("click", () => {
            quantityElement.innerText = parseInt(quantityElement.innerText) + 1;
            updateItems();
            updateSubtotal();
        });

        decreaseButton.addEventListener("click", () => {
            let quantity = parseInt(quantityElement.innerText);
            if (quantity > 1) {
                quantityElement.innerText = quantity - 1;
            } else {
                cartProduct.remove();
            }
            updateItems();
            updateSubtotal();
        });

        cartProduct.querySelector(".delete").addEventListener("click", () => {
            cartProduct.remove();
            updateItems();
            updateSubtotal();
        });
    }
    updateItems();
    updateSubtotal();
}

let successMsg = document.querySelector(".success-msg");
