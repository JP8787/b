import express from 'express';
import Pendiente from './models/pendientes_sincronizacion.js';

const router = express.Router();

router.post('/pendientes_sincronizacion', async (req, res) => {
  try {
    const payload = req.body;
    const nuevo = new Pendiente(payload);
    const saved = await nuevo.save();
    res.status(201).json({ ok: true, data: saved });
  } catch (error) {
    console.error('Error creando pendiente:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.get('/pendientes_sincronizacion', async (req, res) => {
  try {
    const items = await Pendiente.find().limit(200);
    res.json({ ok: true, data: items });
  } catch (error) {
    console.error('Error listando pendientes:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
