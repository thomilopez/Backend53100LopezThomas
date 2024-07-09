import { Router } from 'express';
import auth from "../middlewares/auth.js"
import { generateMockingProducts } from '../utils.js';
const router = Router();

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});
  
router.get("/", auth, (req, res) => {
    res.render("profile", {
        user: req.session.user,
    });
});
  //restaurar password
router.get("/restore", (req, res) => {
    res.render("restore");
});
  

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

router.get('/chat', (req, res) => {
    res.render('chat'); 
});

router.get("/mockingproduct", async (req, res) => {
    let products = generateMockingProducts();
    res.send({ status: "success", payload: products });
  });


export default router;

