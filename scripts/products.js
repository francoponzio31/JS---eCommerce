// Product objects model:
function Product(id, name, price, stock, img, amountInCart=0){
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.img = img;
    this.amountInCart = amountInCart;
}

// Product card HTML model:
function productCardHTML(stockProduct, cartProductData){
    return `
    <div class="col">
        <div class="product-card card" data-product-id="${stockProduct.id}">
            <img src="${stockProduct.img}" class="bd-placeholder-img card-img-top" width="100%" height="225" alt="product-img">
            <div class="card-body">
                <h4 class="card-title">${stockProduct.name}</h4>
                <p> <b>$${stockProduct.price}</b> </p>
                <div class="d-flex justify-content-between align-items-center">
                    <btn class="add-to-cart-btn btn btn-sm btn-primary">Agregar al carrito</btn>
                    <div class="d-flex flex-column">
                        <small class="text-body-secondary d-block">Stock: ${stockProduct.stock}</small>
                        <small class="text-body-secondary d-block">En carrito: ${cartProductData ? cartProductData.amountInCart : 0}</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

// Default products:
let stockProducts = [
    new Product("0", "Producto 0", 10, 3, "../img/bx-shopping-bag.svg"),
    new Product("1", "Producto 1", 20, 10, "../img/bx-shopping-bag.svg"),
    new Product("2", "Producto 2", 250, 2, "../img/bx-shopping-bag.svg"),
    new Product("3", "Producto 3", 40, 5, "../img/bx-shopping-bag.svg"),
    new Product("4", "Producto 4", 80, 20, "../img/bx-shopping-bag.svg"),
    new Product("5", "Producto 5", 30, 10, "../img/bx-shopping-bag.svg"),
    new Product("6", "Producto 6", 110, 3, "../img/bx-shopping-bag.svg"),
];


// Functions:
function renderProductCards(stockProducts, productsContainer){

    // Filtering of products with stock:
    const availableProducts = stockProducts.filter(product => product.stock > 0);

    // Rendering of products cards:
    productsContainer.innerHTML = "";

    if (!availableProducts.length){
        productsContainer.innerHTML = "<p>No hay productos disponibles.</p>";
    }
    else{
        for (const stockProduct of availableProducts){
            const cartProductData = cart.productsData.find(product => product.id === stockProduct.id);
            productsContainer.insertAdjacentHTML(
                "beforeend",
                productCardHTML(stockProduct, cartProductData)
            );
        }   
    }

    // Add to cart btn event:
    const productCards = productsContainer.getElementsByClassName("product-card");
    Array.from(productCards).forEach(productCard => {
        setProductCardAddToCartEvent(productCard);
    });
}

function setProductCardAddToCartEvent(productCard){
    const cardAddToCartBtn = productCard.querySelector(".add-to-cart-btn");
    cardAddToCartBtn.addEventListener("click", () => {
        // Selected product object:
        const productId = productCard.getAttribute("data-product-id");
        const stockProduct = stockProducts.find(product => product.id === productId);
        cart.addProductToCart(stockProduct);

        // Render cards again to update products data:
        renderProductCards(stockProducts, productsContainer);
    });
}