import { Router } from "express";
import UserManager from "../controllers/userManager.js";
import AuthManager from "../controllers/authManager.js";
import passport from "passport";
import usersDAO from "../persistencia/DAO/usersDAO.js";
const router = Router();

const userManager = new UserManager();
const authManager = new AuthManager();

// Obtener todos los usuarios
router.get("/users",passport.authenticate('jwt', {session:false}), async (req, res) => {
    try {
        const users = await userManager.getAll();
        res.status(200).json({ users });
    } catch (error) {
        console.error(`Error al cargar los usuarios: ${error}`);
        res.status(500).json({ error: `Error al recibir los usuarios` });
    }
});

  // Obtener un usuario por su ID
router.get("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userManager.getById(id);
    if (user) {
        res.status(200).json({ user });
    } else {
        res.status(404).json({ error: `Usuario con id: ${id} no encontrado` });
    }
    } catch (error) {
        console.error(`Error al cargar el usuario: ${error}`);
        res.status(500).json({ error: `Error al recibir el usuario` });
    }
});

  // Crear un nuevo usuario
router.post("/user", async (req, res) => {
    try {
        const newUser = req.body;
        const result = await userManager.createUser(newUser);
        res.status(201).json({ result });
    } catch (error) {
        console.error(`Error al crear el usuario: ${error}`);
        res.status(500).json({ error: `Error al crear el usuario` });
    }
});

  // Actualizar un usuario existente
router.put("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = req.body;
        const result = await userManager.updateUser(id, updatedUser);
    if (result) {
        res.status(200).json({ message: "Usuario actualizado exitosamente" });
    } else {
        res.status(404).json({ error: "Usuario no encontrado" });
    }
    } catch (error) {
        console.error(`Error al actualizar el usuario: ${error}`);
        res.status(500).json({ error: `Error al actualizar el usuario` });
    }
});

  // Eliminar un usuario por su ID
router.delete("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await userManager.deleteUser(id);
    if (deletedUser) {
        res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } else {
        res.status(404).json({ error: "Usuario no encontrado" });
    }
    } catch (error) {
        console.error(`Error al eliminar el usuario: ${error}`);
        res.status(500).json({ error: `Error al eliminar el usuario` });
    }
});


router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await authManager.login({ email, password });
        console.log(user.token);
    if (user.token) {
        res
        .cookie("hola", user.token, {
            httpOnly: true,
        })
        .send({ status: "success", message: user.message });
    }
    } catch (error) {
        res.send({ status: "error", message: error });
    }
  });

  router.post("/logout", (req, res) => {
    //lógica a implementar
  });

  router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        // Aquí obtenemos el usuario desde el repositorio usando el DTO
        const user = await userManager.getUserById(req.user.id);

        // Crear DTO del usuario con la información necesaria
        const userDTO = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            rol: user.rol
        };

        // Enviar el DTO como respuesta
        res.status(200).json(userDTO);
    } catch (error) {
        console.error(`Error al obtener el usuario actual: ${error}`);
        res.status(500).json({ error: 'Error al obtener el usuario actual' });
    }
});

  
  export default router;