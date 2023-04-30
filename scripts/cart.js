// Cart model:
function Cart(){

    // If there are cart products in the session storage they are restored:
    this.productsData = JSON.parse(localStorage.getItem("cartProducts")) || [];

    this.totalPrice = () => {
        let totalPrice = 0;
        for (const cartProductData of this.productsData){
            const stockProduct = stockProducts.find(product => product.id === cartProductData.id);
            totalPrice += stockProduct.price * cartProductData.amountInCart;
        }
        return totalPrice;
    }
    
    this.addProductToCart = (product) => {
        if (product.stock){
            // If the product isn't in the cart, it is added:
            if (!this.productsData.find(cartProduct => cartProduct.id === product.id)){
                this.productsData.push({id:product.id, amountInCart:1});
            }
            else{
                const cartProductData = this.productsData.find(cartProduct => cartProduct.id === product.id);
                if (product.stock > cartProductData.amountInCart){
                    cartProductData.amountInCart++;
                }
            }
        }
        // localStorage update:
        localStorage.setItem("cartProducts", JSON.stringify(this.productsData));
    }

    this.subtractProductToCart = (product) => {
        const cartProductData = this.productsData.find(cartProduct => cartProduct.id === product.id);
        cartProductData.amountInCart--;
        if (product.amountInCart <= 0){
            this.productsData = this.productsData.filter(product => product.amountInCart > 0);
        }
        // localStorage update:
        localStorage.setItem("cartProducts", JSON.stringify(this.productsData));
    }

    this.removeProductToCart = (product) => {
        const cartProductData = this.productsData.find(cartProduct => cartProduct.id === product.id);
        cartProductData.amountInCart = 0;
        this.productsData = this.productsData.filter(product => product.amountInCart > 0);
        // localStorage update:
        localStorage.setItem("cartProducts", JSON.stringify(this.productsData));
    }

    this.clearProducts = () => {
        for (const cartProductData of this.productsData){
            cartProductData.amountInCart = 0;
        }
        this.productsData = [];
        // localStorage update:
        localStorage.setItem("cartProducts", JSON.stringify(this.productsData));
    }
}

// Cart object:
const cart = new Cart;

// Cart product item HTML model:
function cartProductItemHTML(stockProduct, cartProductData){
    return `
    <li class="cart-product-item list-group-item d-flex align-items-center" data-product-id="${stockProduct.id}">
        <div class="w-100 d-flex flex-column">
            <div class="d-flex align-items-center">
                <img src="${stockProduct.img}" class="img-thumbnail me-3" alt="product-image">
                <h2 class="fs-5 my-0">${stockProduct.name}</h2>
            </div>
            <div class="d-flex flex-column flex-sm-row gap-2 gap-sm-4 gap-lg-5 align-items-sm-center mt-1">
                <span><b>Precio:</b> $${stockProduct.price}</span>
                <span class="d-flex align-items-center">
                    <b>Cantidad:</b> 
                    <div class="input-group input-group-sm ms-2">
                        <button class="substract-product-unit-btn btn btn-outline-secondary" type="button">-</button>
                        <span class="input-group-text">${cartProductData.amountInCart}</span>
                        <button class="add-product-unit-btn btn btn-outline-secondary" type="button">+</button>
                    </div>
                </span>
                <span><b>Total:</b> $${stockProduct.price * cartProductData.amountInCart}</span>
            </div>
        </div>
        <button type="button" class="cart-product-remove-btn btn-close"></button>
    </li>
    `;
}

// Cart events:
const cartBtn = document.getElementById("cart-btn");
const cartModalProductsContainer = document.getElementById("cart-products-container");
const cartDropBtn = document.getElementById("cart-drop-btn");

// Open cart modal:
cartBtn.addEventListener("click", () => {
    renderCartProductItems(cart.productsData, cartModalProductsContainer);
});

// Clear cart products:
cartDropBtn.addEventListener("click", () => {
    cart.clearProducts();
    renderCartProductItems(cart.productsData, cartModalProductsContainer);
    renderProductCards(stockProducts, productsContainer);
});

function setCartProductItemEventListeners(productItem){

    const productId = productItem.getAttribute("data-product-id");
    const stockProduct = stockProducts.find(product => product.id === productId);

    // Remove product to cart:
    removeBtn = productItem.querySelector(".cart-product-remove-btn");
    removeBtn.addEventListener("click", () => {
        cart.removeProductToCart(stockProduct);
        renderCartProductItems(cart.productsData, cartModalProductsContainer);
        renderProductCards(stockProducts, productsContainer);
    });

    // Substract product unit from cart:
    substractBtn = productItem.querySelector(".substract-product-unit-btn");
    substractBtn.addEventListener("click", () => {
        cart.subtractProductToCart(stockProduct);
        renderCartProductItems(cart.productsData, cartModalProductsContainer);
        renderProductCards(stockProducts, productsContainer);
    });

    // Add product unit to cart:
    addBtn = productItem.querySelector(".add-product-unit-btn");
    addBtn.addEventListener("click", () => {
        cart.addProductToCart(stockProduct);
        renderCartProductItems(cart.productsData, cartModalProductsContainer);
        renderProductCards(stockProducts, productsContainer);
    });
}

// Functions:
function renderCartProductItems(cartProductsData, cartProductsContainer){
    
    cartModalProductsContainer.innerHTML = "";

    if (cart.productsData.length === 0){
        cartModalProductsContainer.innerHTML = "<p>El carrito se encuentra vacio.</p>";
    }
    else{
        // Products:
        for (const cartProductData of cartProductsData){
            const stockProduct = stockProducts.find(product => product.id === cartProductData.id);
            cartProductsContainer.insertAdjacentHTML(
                "beforeend",
                cartProductItemHTML(stockProduct, cartProductData)
            );
        }

        // Total price:
        cartProductsContainer.insertAdjacentHTML(
            "beforeend",
            `<div class="d-flex justify-content-end mt-3">
                <span><b>Total: </b> $${cart.totalPrice()}</span>
            </div>`
            
        );

        // Cart product items events setting:
        const cartProductItems = cartProductsContainer.getElementsByClassName("cart-product-item");
        Array.from(cartProductItems).forEach(productCard => {
            setCartProductItemEventListeners(productCard);
        });
    }
}