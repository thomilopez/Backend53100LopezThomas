import userModel from "../../persistencia/models/usersDTO.js";
import { createHash, isValidPassword } from "../../utils.js";


export const getCurrentSession = (req, res) => {
    res.json(req.user);
};

export const registerUser = async (req, res) => {
    res.status(201).send({ status: "success", message: "Usuario registrado" });
};

export const failRegister = async (req, res) => {
    console.log("error");
    res.send({ error: "Falló" });
};

export const loginUser = async (req, res) => {
    if (!req.user) return res.status(400).send('error');
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age
    };
    res.status(200).send({ status: "success", payload: req.user });
};

export const failLogin = async (req, res) => {
    console.log("error");
    res.send({ error: "Falló" });
};

// export const githubCallback = async (req, res) => {
//     req.session.user = req.user;
//     res.redirect("/");
// };

export const restorePassword = async (req, res) => {
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
};
