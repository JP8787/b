import express from 'express';
import Configuracion from './models/configuracion.js';

const router = express.Router();

// Crear o actualizar configuración (POST)
router.post('/configuracion', async (req, res) => {
  try {
    const payload = req.body;
    // si se envía `clave`, intentamos upsert para evitar duplicados
    if (payload.clave) {
      const updated = await Configuracion.findOneAndUpdate(
        { clave: payload.clave },
        payload,
        { upsert: true, new: true, runValidators: true }
      );
      return res.status(201).json({ ok: true, data: updated });
    }

    const nuevo = new Configuracion(payload);
    const saved = await nuevo.save();
    res.status(201).json({ ok: true, data: saved });
  } catch (error) {
    console.error('Error creando configuracion:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Listar configuraciones
router.get('/configuracion', async (req, res) => {
  try {
    const items = await Configuracion.find().sort({ clave: 1 }).limit(200);
    res.json({ ok: true, data: items });
  } catch (error) {
    console.error('Error listando configuraciones:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
