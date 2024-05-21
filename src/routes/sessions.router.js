import { Router } from "express";
import userModel from "../models/usersModel.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";


const sessionRouter = Router();

// sessionRouter.post("/register", async (req, res) => {
//         const { first_name, last_name, email, age, password } = req.body;
    
//         try {
//         // Validación de campos
//         if (!first_name || !last_name || !email || !age || !password) {
//             return res.status(400).send({ status: "error", error: "Todos los campos son obligatorios" });
//         }
    
//         // Validar formato de email
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             return res.status(400).send({ status: "error", error: "El formato de correo electrónico no es válido" });
//         }
    
//         // Validar edad como número entero positivo
//         if (Number.isNaN(age) || age < 0) {
//             return res.status(400).send({ status: "error", error: "La edad debe ser un número entero positivo" });
//         }
    
//         // Verificar si el correo ya existe
//         const existingUser = await userModel.findOne({ email: email });
//         if (existingUser) {
//             return res.status(400).send({ status: "error", error: "El correo ya está registrado" });
//         }
    
//         // Crear nuevo usuario
//         const newUser = {
//             first_name,
//             last_name,
//             email,
//             age,
//             password: createHash(password),
//         };
    
//         const result = await userModel.create(newUser);
//         console.log(result);
//         res.status(201).send({ status: "success", payload: result });
//         } catch (error) {
//         console.error(error);
//         res.status(500).send({ status: "error", error: "Error al registrar el usuario" });
//         }
//     });


sessionRouter.post(
    "/register",
    passport.authenticate("register", { failureRedirect: "/failregister" }),
    async (req, res) => {
        res.status(201).send({ status: "success", message: "Usuario registrado" });
    }
);


sessionRouter.get("/failregister", async (req, res) => {
    console.log("error");
    res.send({ error: "Falló" });
    });

// sessionRouter.post("/login", async (req, res) => {

//     const { email, password } = req.body;
//     const user = await userModel.findOne({ email }); //solo correo
//     if (!user) {
//         return res.status(400).send({ status: "error", error: "error en las credenciales" });
//     }
//     const isValid = isValidPassword(user, password);
//     console.log(isValid);
//     if (!isValid) {
//         return res.status(401).send({ error: "error", message: "Error de credenciales" });
//     }

//     req.session.user = {
//         name: `${user.first_name} ${user.last_name}`,
//         email: user.email,
//         age: user.age,
//     };

//     delete user.password;

//     res.send({
//         status: "success",
//         payload: req.session.user,
//         message: "Inicio exitoso",
//     });
// });

sessionRouter.post('/login', passport.authenticate('login',{failureRedirect:"/faillogin"}),
        async(req,res)=>{
        if(!req.user)return res.status(400).send('error')
        req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        };
        res.status(200).send({ status: "success", payload: req.user });
        })


sessionRouter.get("/faillogin", async (req, res) => {
    console.log("error");
    res.send({ error: "Fallo" });
    });


sessionRouter.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => {
    }
);

sessionRouter.get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    async (req, res) => {
    req.session.user = req.user;
    res.redirect("/"); 
    }
);


sessionRouter.post("/restore", async (req, res) => {
    const { email, password } = req.body;


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send({ status: "error", message: "Formato de correo electrónico inválido" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).send({ status: "error", message: "No se encuentra el usuario" });
    }

    const newPass = createHash(password);
    await userModel.updateOne({ _id: user._id }, { $set: { password: newPass } });

    res.send({ status: "success", message: "Contraseña actualizada" });
});
export default sessionRouter;
