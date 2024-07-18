class AuthorizationMiddleware {
    // Middleware para verificar si el usuario es administrador
    static async isAdmin(req, res, next) {
        try {
        const user = await req.user; 
        if (user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Error de autenticacion' });
        }
        } catch (error) {
        next(error);
        }
    }

    // Middleware para verificar si el usuario es un usuario común
    static async isUser(req, res, next) {
        try {
        const user = await req.user; 
        if (user.role === 'user') {
            next();
        } else {
            res.status(403).json({ error: 'Error de autenticacion' });
        }
    } catch (error) {
        next(error);
    }
    }
      // Middleware para verificar si el usuario es el usuario actual o un administrador
  static async isUserOrAdmin(req, res, next) {
    try {
      const user = await req.user;
      if (user.role === 'user' && user.id === req.params.id) {
        next();
      } else if (user.role === 'admin') {
        next();
      } else {
        res.status(403).json({ error: 'Error de autenticación' });
      }
    } catch (error) {
      next(error);
    }
  }

// Middleware para verificar si el usuario es administrador o propietario del producto  
  static async isAdminOrOwner(req, res, next) {
      try {
          const user = await req.user;
          const productId = req.params.id;
          const product = await productModel.findById(productId);

          if (user.rol === 'admin' || (user.rol === 'premium' && product.owner === user.email)) {
              next();
          } else {
              res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
          }
      } catch (error) {
          next(error);
      }
  }

// Middleware para verificar si el usuario premium no agrega su propio producto al carrito
  static async isNotOwner(req, res, next) {
      try {
          const user = await req.user;
          const productId = req.body.productId;
          const product = await productModel.findById(productId);

          if (user.rol !== 'premium' || product.owner !== user.email) {
              next();
          } else {
              res.status(403).json({ error: 'No puedes agregar tu propio producto al carrito' });
          }
      } catch (error) {
          next(error);
      }
  }



}
  
  export default AuthorizationMiddleware;