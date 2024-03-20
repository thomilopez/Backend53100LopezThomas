// const socket = io();

// socket.on('addToTheList', (product) => {
//     const productList = document.getElementById('productList');
//     const newProduct = document.createElement('li');
//     newProduct.innerText = `${product.name} - ${product.price}`;
//     productList.appendChild(newProduct);
// });

const socket = io();


document.getElementById('productForm').addEventListener('submit', (event) => {
    event.preventDefault(); 

    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;

    socket.emit('addProduct', { name: productName, price: productPrice });

    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
});

