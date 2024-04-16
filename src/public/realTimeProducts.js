const socket = io();

document.getElementById("productForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const productName = document.getElementById("productName").value;
  const productPrice = document.getElementById("productPrice").value;
  const productStatus = document.getElementById("productStatus").value;
  const productStock = document.getElementById("productStock").value;
  const productCode = document.getElementById("productCode").value;
  const productBrand = document.getElementById("productBrand").value;
  const productCategory = document.getElementById("productCategory").value;
  const productDescription =
    document.getElementById("productDescription").value;
  const productTitle = document.getElementById("productTitle").value;

  socket.emit("addProduct", {
    name: productName,
    price: productPrice,
    status: productStatus,
    code: productCode,
    stock: productStock,
    brand: productBrand,
    category: productCategory,
    description: productDescription,
    title: productTitle,
  });

  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productStatus").value = "";
  document.getElementById("productStock").value = "";
  document.getElementById("productCode").value = "";
  document.getElementById("productBrand").value = "";
  document.getElementById("productCategory").value = "";
  document.getElementById("productDescription").value = "";
  document.getElementById("productTitle").value = "";

});
