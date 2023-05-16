// Product objects model:
function Product(id, name, price, stock, img){
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.img = img;
}

// Product card HTML model:
function productCardHTML(stockProduct, cartProductData){
    return `
    <div class="col">
        <div class="product-card card" data-product-id="${stockProduct.id}">
            <img src="${stockProduct.img}" class="bd-placeholder-img card-img-top mt-3" width="100%" height="110px" alt="product-img">
            <div class="card-body">
                <h4 class="card-title">${stockProduct.name}</h4>
                <p> <b>$${stockProduct.price}</b> </p>
                <div class="d-flex justify-content-between align-items-center">
                    <btn class="add-to-cart-btn btn btn-sm btn-secondary" style="background-color:#1f5184; border-color:#1f5184;">Agregar al carrito</btn>
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


// Functions:
async function getStockProducts(order=null, minPrice=null, maxPrice=null){

    return fetch("products.json")
    .then(response => {
        return response.json();
    })
    .then(data => {
        let stockProducts = data.map(({id, name, price, stock, img }) => new Product(id, name, price, stock, img));

        // Filters:
        if (minPrice){
            stockProducts = stockProducts.filter(product => product.price >= minPrice);
        }
        if (maxPrice){
            stockProducts = stockProducts.filter(product => product.price <= maxPrice);
        }

        // Ordering:
        if(order==="lower"){
            stockProducts = stockProducts.sort((a, b) => a.price - b.price);
        }
        else if(order==="higher"){
            stockProducts = stockProducts.sort((a, b) => b.price - a.price);
        }

        return stockProducts
    })
    .catch(error => console.error(error));
}

async function renderProductCards(stockProductsPromise, productsContainer){

    stockProductsPromise
        .then(stockProductsPromise => {
            return stockProductsPromise;
        })
        .then(stockProductsArray => {
            
            // Filtering of products with stock:
            const availableProducts = stockProductsArray.filter(product => product.stock > 0);

            // Rendering of products cards:
            productsContainer.innerHTML = "";

            if (!availableProducts.length){
                productsContainer.innerHTML = "<p>No hay productos disponibles.</p>";
            }
            else{
                availableProducts.forEach((stockProduct) => {
                    const cartProductData = cart.productsData.find(product => product.id === stockProduct.id);
                    productsContainer.insertAdjacentHTML(
                        "beforeend",
                        productCardHTML(stockProduct, cartProductData)
                    );
                })
            }

            // Add to cart btn event:
            const productCards = productsContainer.getElementsByClassName("product-card");
            Array.from(productCards).forEach(productCard => {
                setProductCardAddToCartEvent(stockProductsArray, productCard);
            });

        }
    )
}

function setProductCardAddToCartEvent(stockProductsArray, productCard){
    const cardAddToCartBtn = productCard.querySelector(".add-to-cart-btn");
    cardAddToCartBtn.addEventListener("click", async () => {
        // Selected product object:
        const productId = productCard.getAttribute("data-product-id");
        const stockProduct = stockProductsArray.find(product => product.id === productId);
        cart.addProductToCart(stockProduct);

        // Confirmation modal:
        Swal.fire({
            icon: "success",
            title: "Producto agregado al carrito",
            showConfirmButton: false,
            timer: 1000,
            color: "#abb5bd",
            background: "#212529",
        })

        // Render cards again to update products data:
        renderProductCards(getStockProducts(), productsContainer);
    });
}