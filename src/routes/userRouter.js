import { Router } from "express";
import passport from "passport";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, loginUser, logoutUser, getCurrentUser } from "../controllers/controllersRouter/userController.js";
import AuthorizationMiddleware from '../middlewares/authorizationMiddleware.js';
const router = Router();

// Ruta para obtener la lista de usuarios (solo accesible para administradores)
router.get("/users", passport.authenticate('jwt', { session: false }), AuthorizationMiddleware.isAdmin, getAllUsers);

// Ruta para obtener un usuario por su ID
router.get("/user/:id", getUserById);

// Ruta para crear un nuevo usuario
router.post("/user", createUser);

// Ruta para actualizar un usuario (solo accesible para el usuario o administradores)
router.put("/user/:id", AuthorizationMiddleware.isUserOrAdmin, updateUser);

// Ruta para eliminar un usuario (solo accesible para administradores)
router.delete("/user/:id", AuthorizationMiddleware.isAdmin, deleteUser);

// Ruta para iniciar sesión
router.post("/login", loginUser);

// Ruta para cerrar sesión
router.post("/logout", logoutUser);

// Ruta para obtener la información del usuario actual
router.get('/current', passport.authenticate('jwt', { session: false }), getCurrentUser); 


export default router;