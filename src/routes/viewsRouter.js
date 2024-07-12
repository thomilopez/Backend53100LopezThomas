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

router.get('/loggertest', (req, res) =>{
    
    req.logger.debug("Este es un mensaje de depuración");
    req.logger.http("Este es un mensaje http");
    req.logger.info("Este es un mensaje informativo");
    req.logger.warn("Este es un mensaje de advertencia");
    req.logger.error("Este es un mensaje de error");
    req.logger.fatal("Este es un mensaje fatal");
    
    res.send("Logs enviados con éxito");
})

export default router;

