let shoppingCart = [];

while (true){
    
    let option = prompt(
        `
        Seleccione una opción:
    
        1 - Ver productos
        2 - Agregar producto a carrito
        3 - Ver carrito
        `
    );

    if (option === null){
        break;
    }
    else if (option === "1"){   
        showProducts(products);
    }
    else if (option === "2"){   
        addProductToCart(products, shoppingCart);
    }
    else if (option === "3"){   
        showCart(shoppingCart);
    }
}

function listAvailableProducts(products){
    let productsView = "Productos:\n";
    for (let i = 0; i < products.length; i++){
        if (products[i].stock > 0){
            productsView  += `\n ${products[i].id} - ${products[i].viewAsString()}`;
        }
    }
    return productsView;
}

function showProducts(products){
    const productsView = listAvailableProducts(products);
    alert(productsView);
}

function addProductToCart(products, shoppingCart){
    const productsView = listAvailableProducts(products);

    let productId = parseInt(prompt(productsView + "\n\nIngrese el número de producto a agregar a la lista:"));

    const selectedProduct = products.find((product) => product.id === productId);

    if (selectedProduct){
        if (!shoppingCart.includes(selectedProduct)){
            shoppingCart.push(selectedProduct);
        }
        selectedProduct.stock--;
        selectedProduct.amountInCart++;
        alert("Producto agregado correctamente.");
    }
    else{
        alert("No se encontró el producto.");
    }
}

function showCart(shoppingCart){

    if (shoppingCart.length){   
        let cartView = "Carrito:\n";
        for (let i = 0; i < shoppingCart.length; i++){
            cartView  += `\n- ${shoppingCart[i].viewAsString()}`;
        }
        alert(cartView);
    }
    else{
        let cartView = "El carrito esta vacio.";
        alert(cartView);

    }
}