import { Router } from "express";
// import userModel from "../models/usersModel.js";
import userModel from "../persistencia/usersModel.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";


const sessionRouter = Router();


sessionRouter.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json(req.user);
});

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
