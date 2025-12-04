import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Importar modelos para registrar sus índices
import Usuario from '../src/routes/models/usuarios.js';
import Evento from '../src/routes/models/eventos.js';
import Caracterizacion from '../src/routes/models/caracterizaciones.js';
import Seguimiento from '../src/routes/models/seguimientos.js';
import Auditoria from '../src/routes/models/auditoria.js';
import Parametro from '../src/routes/models/parametros.js';

dotenv.config();

async function initIndexes() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Conectado a MongoDB Atlas');

    console.log('\nCreando índices...\n');

    // Sincronizar índices de cada modelo
    console.log('→ Usuarios...');
    await Usuario.syncIndexes();
    console.log('  ✓ Índices de usuarios sincronizados');

    console.log('→ Eventos...');
    await Evento.syncIndexes();
    console.log('  ✓ Índices de eventos sincronizados');

    console.log('→ Caracterizaciones...');
    await Caracterizacion.syncIndexes();
    console.log('  ✓ Índices de caracterizaciones sincronizados');

    console.log('→ Seguimientos...');
    await Seguimiento.syncIndexes();
    console.log('  ✓ Índices de seguimientos sincronizados');

    console.log('→ Auditoría...');
    await Auditoria.syncIndexes();
    console.log('  ✓ Índices de auditoría sincronizados');

    console.log('→ Parámetros...');
    await Parametro.syncIndexes();
    console.log('  ✓ Índices de parámetros sincronizados');

    console.log('\n✓ Todos los índices fueron creados exitosamente');

    // Mostrar resumen de índices
    console.log('\n--- Resumen de índices ---\n');
    
    const collections = [
      { name: 'usuarios', model: Usuario },
      { name: 'eventos', model: Evento },
      { name: 'caracterizaciones', model: Caracterizacion },
      { name: 'seguimientos', model: Seguimiento },
      { name: 'auditoria', model: Auditoria },
      { name: 'parametros', model: Parametro }
    ];

    for (const col of collections) {
      const indexes = await col.model.collection.indexes();
      console.log(`${col.name}: ${indexes.length} índice(s)`);
      indexes.forEach(idx => {
        if (idx.name !== '_id_') {
          console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
        }
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDesconectado de MongoDB');
  }
}

initIndexes();
