// Cart model:
function Cart(){

    // If there are cart products in the session storage they are restored:
    this.productsData = JSON.parse(localStorage.getItem("cartProducts")) || [];

    this.totalPrice = async () => {
        let totalPrice = 0;
        const stockProducts = await getStockProducts();
        this.productsData.forEach((cartProductData) => {
            const stockProduct = stockProducts.find(product => product.id === cartProductData.id);
            totalPrice += stockProduct.price * cartProductData.amountInCart;
        });

        return totalPrice;
    }
    
    this.addProductToCart = (stockProduct) => {
        if (stockProduct.stock){
            // If the product isn't in the cart, it is added:
            if (!this.productsData.find(cartProduct => cartProduct.id === stockProduct.id)){
                this.productsData.push({id:stockProduct.id, amountInCart:1});
            }
            else{
                const cartProductData = this.productsData.find(cartProduct => cartProduct.id === stockProduct.id);
                if (stockProduct.stock > cartProductData.amountInCart){
                    cartProductData.amountInCart++;
                }
            }
        }
        // localStorage update:
        localStorage.setItem("cartProducts", JSON.stringify(this.productsData));
    }

    this.subtractProductToCart = (stockProduct) => {
        const cartProductData = this.productsData.find(cartProduct => cartProduct.id === stockProduct.id);
        cartProductData.amountInCart--;
        if (cartProductData.amountInCart <= 0){
            this.productsData = this.productsData.filter(productData => productData.amountInCart > 0);
        }
        // localStorage update:
        localStorage.setItem("cartProducts", JSON.stringify(this.productsData));
    }

    this.removeProductToCart = (stockProduct) => {
        const cartProductData = this.productsData.find(cartProduct => cartProduct.id === stockProduct.id);
        cartProductData.amountInCart = 0;
        this.productsData = this.productsData.filter(productData => productData.amountInCart > 0);
        // localStorage update:
        localStorage.setItem("cartProducts", JSON.stringify(this.productsData));
    }

    this.clearProducts = () => {
        this.productsData.forEach((cartProductData) => {
            cartProductData.amountInCart = 0;
        });
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
            <div class="d-flex flex-column flex-xl-row gap-2 gap-xl-4 gap-xl-5 align-items-xl-center mt-1">
                <span><b>Precio:</b> $${stockProduct.price}</span> 
                <span><b>Stock:</b> ${stockProduct.stock}</span> 
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
const cartBuyBtn = document.getElementById("cart-buy-btn");
const cartDropBtn = document.getElementById("cart-drop-btn");

// Open cart modal:
cartBtn.addEventListener("click", () => {
    renderCartProductItems(cart.productsData, cartModalProductsContainer);
});

// Buy cart products:
cartBuyBtn.addEventListener("click", () => {

    if (cart.productsData.length){   
        cart.clearProducts();
        renderProductCards(getStockProducts(), productsContainer);
        // Confirmation modal:
        Swal.fire({
            icon: "success",
            title: "¡Compra exitosa!",
            showConfirmButton: false,
            timer: 1200,
            color: "#abb5bd",
            background: "#212529",
        })
    }
    else{
        Swal.fire({
            icon: "error",
            title: "¡EL carrito está vacio!",
            text: "Prueba agregar algunos productos",
            showConfirmButton: false,
            timer: 3000,
            color: "#abb5bd",
            background: "#212529",
        })
    }

});

// Clear cart products:
cartDropBtn.addEventListener("click", () => {

    if (cart.productsData.length){   
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc3545",
            confirmButtonText: "Si, vaciar",
            color: "#abb5bd",
            background: "#212529",
        }).then((result) => {
            if (result.isConfirmed) {
                cart.clearProducts();
                renderCartProductItems(cart.productsData, cartModalProductsContainer);
                renderProductCards(getStockProducts(), productsContainer);
                Swal.fire({
                    title: "Productos eliminados del carrito",
                    icon: "success",
                    timer: 1200,
                    showConfirmButton: false,
                    color: "#abb5bd",
                    background: "#212529",
                })
            }
        })
    }
    else{
        Swal.fire({
            icon: "error",
            title: "¡EL carrito está vacio!",
            text: "Prueba agregar algunos productos",
            showConfirmButton: false,
            timer: 3000,
            color: "#abb5bd",
            background: "#212529",
        })
    }

});

async function setCartProductItemEventListeners(productItem){

    const productId = productItem.getAttribute("data-product-id");
    const stockProducts = await getStockProducts();
    const stockProduct = stockProducts.find(product => product.id === productId);

    // Remove product to cart:
    const removeBtn = productItem.querySelector(".cart-product-remove-btn");
    removeBtn.addEventListener("click", () => {
        cart.removeProductToCart(stockProduct);
        renderCartProductItems(cart.productsData, cartModalProductsContainer);
        renderProductCards(getStockProducts(), productsContainer);
    });

    // Substract product unit from cart:
    const substractBtn = productItem.querySelector(".substract-product-unit-btn");
    substractBtn.addEventListener("click", () => {
        cart.subtractProductToCart(stockProduct);
        renderCartProductItems(cart.productsData, cartModalProductsContainer);
        renderProductCards(getStockProducts(), productsContainer);
    });

    // Add product unit to cart:
    const addBtn = productItem.querySelector(".add-product-unit-btn");
    addBtn.addEventListener("click", () => {
        cart.addProductToCart(stockProduct);
        renderCartProductItems(cart.productsData, cartModalProductsContainer);
        renderProductCards(getStockProducts(), productsContainer);
    });
}

// Functions:
async function renderCartProductItems(cartProductsData, cartProductsContainer){
    
    if (cart.productsData.length === 0){
        cartModalProductsContainer.innerHTML = "<p>El carrito se encuentra vacio.</p>";
    }
    else{
        // Products:
        const stockProducts = await getStockProducts();

        // Products rendering:
        let updatedCartProductsHTML = "";
        cartProductsData.forEach((cartProductData) => {
            const stockProduct = stockProducts.find(product => product.id === cartProductData.id);
            updatedCartProductsHTML += cartProductItemHTML(stockProduct, cartProductData);
        });

        // Total price:
        updatedCartProductsHTML += `
            <div class="d-flex justify-content-end mt-3">
                <span><b>Total: </b> $${await cart.totalPrice()}</span>
            </div>`;

        cartProductsContainer.innerHTML = updatedCartProductsHTML;

        // Cart product items events setting:
        const cartProductItems = cartProductsContainer.getElementsByClassName("cart-product-item");
        Array.from(cartProductItems).forEach(productCard => {
            setCartProductItemEventListeners(productCard);
        });
    }
}