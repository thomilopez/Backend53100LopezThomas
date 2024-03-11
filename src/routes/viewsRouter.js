import express from 'express';
const router = express.Router();

// Manejar la ruta para la vista home
router.get('/', (req, res) => {
    res.render('home');
});

// Manejar la ruta para la vista realTimeProducts
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

export default router;