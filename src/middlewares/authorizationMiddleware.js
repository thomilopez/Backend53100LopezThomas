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

}
  
  export default AuthorizationMiddleware;