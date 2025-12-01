import express from 'express';
import EventoActual from './models/evento_actual.js';

const router = express.Router();

router.post('/evento_actual', async (req, res) => {
  try {
    const payload = req.body;
    const nuevo = new EventoActual(payload);
    const saved = await nuevo.save();
    res.status(201).json({ ok: true, data: saved });
  } catch (error) {
    console.error('Error creando evento_actual:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.get('/evento_actual', async (req, res) => {
  try {
    const items = await EventoActual.find().limit(200);
    res.json({ ok: true, data: items });
  } catch (error) {
    console.error('Error listando evento_actual:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
