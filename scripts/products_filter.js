const productsOrderSelect = document.getElementById("products-order-input");
const minPriceInput = document.getElementById("min-price-input");
const maxPriceInput = document.getElementById("max-price-input");

productsOrderSelect.addEventListener("change", () => {
    renderProductCards(getStockProducts(productsOrderSelect.value, parseInt(minPriceInput.value), parseInt(maxPriceInput.value)), productsContainer);
});
minPriceInput.addEventListener("input", () => {
    renderProductCards(getStockProducts(productsOrderSelect.value, parseInt(minPriceInput.value), parseInt(maxPriceInput.value)), productsContainer);
});
maxPriceInput.addEventListener("input", () => {
    renderProductCards(getStockProducts(productsOrderSelect.value, parseInt(minPriceInput.value), parseInt(maxPriceInput.value)), productsContainer);
});