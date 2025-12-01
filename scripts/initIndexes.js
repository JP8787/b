import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Import models to ensure their indexes are registered
import Usuario from '../src/routes/models/usuarios.js';
import Evento from '../src/routes/models/eventos.js';
import Caracterizacion from '../src/routes/models/caracterizaciones.js';
import Seguimiento from '../src/routes/models/seguimientos.js';
import Entidad from '../src/routes/models/entidades.js';
import Auditoria from '../src/routes/models/auditoria.js';
import Configuracion from '../src/routes/models/configuracion.js';
import EventoActual from '../src/routes/models/evento_actual.js';
import Pendiente from '../src/routes/models/pendientes_sincronizacion.js';

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB para crear índices');

    // Esperar a que Mongoose cree los índices de cada modelo.
    // En entornos donde ya existen índices puede haber conflictos; capturamos
    // errores por modelo para continuar con el resto.
    const models = [
      { name: 'Usuario', model: Usuario },
      { name: 'Evento', model: Evento },
      { name: 'Caracterizacion', model: Caracterizacion },
      { name: 'Seguimiento', model: Seguimiento },
      { name: 'Entidad', model: Entidad },
      { name: 'Auditoria', model: Auditoria },
      { name: 'Configuracion', model: Configuracion },
      { name: 'EventoActual', model: EventoActual },
      { name: 'PendienteSincronizacion', model: Pendiente }
    ];

    for (const m of models) {
      try {
        await m.model.init();
        console.log(`Índices asegurados para modelo: ${m.name}`);
      } catch (err) {
        console.warn(`Advertencia: no se pudieron crear todos los índices para ${m.name}:`, err.message || err);
      }
    }

    console.log('Proceso de inicialización de índices finalizado.');
    process.exit(0);
  } catch (err) {
    console.error('Error inicializando índices:', err);
    process.exit(1);
  }
}

main();
