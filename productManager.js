class ProductManager {
    constructor() {
        this.products = [];
        this.nextId = 1;
    }

    addProduct(product) {
            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        console.log("All fields are mandatory.");
        return;
    }

    if (this.isCodeUnique(product.code)) {
        product.id = this.nextId++;
        this.products.push(product);
    } else {
        console.log("Product with the same code already exists.");
    }
    }

    isCodeUnique(code) {
        return this.products.every(product => product.code !== code);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
            if (product) {
                return product;
            } else {
        console.log("Product not found.");
        }
    }
}

  // Crear una instancia de ProductManager
    const productManager = new ProductManager();

  // Ejemplo de cómo agregar un producto
    productManager.addProduct({
        title: "Producto 1",
        description: "Descripción del producto 1",
        price: 100,
        thumbnail: "https://example.com/product1.jpg",
        code: "ABC123",
        stock: 10
    });

  // Ejemplo de cómo obtener todos los productos
    const allProducts = productManager.getProducts();
    console.log(allProducts);

  // Ejemplo de cómo obtener un producto por su id
  const productById = productManager.getProductById(1); // Cambiar el 1 por el id deseado
    console.log(productById);