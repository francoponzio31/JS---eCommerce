function Product(id, name, price, stock){
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.amountInCart = 0;

    this.viewAsString = () => `${this.name.toUpperCase()} - Precio: ${this.price} - Stock: ${this.stock} - Cantidad en el carrito: ${this.amountInCart}`;
}

let products = [
    new Product(0, "Producto 0", "$10", 5),
    new Product(1, "Producto 1", "$20", 10),
    new Product(2, "Producto 2", "$250", 2),
    new Product(3, "Producto 3", "$40", 5),
    new Product(4, "Producto 4", "$80", 20),
]