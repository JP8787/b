import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Caracterizacion from '../src/routes/models/caracterizaciones.js';

dotenv.config();

async function main(){
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a Mongo para crear muestra');
    const sample = {
      tipoDocumento: 'CEDULA',
      numeroDocumento: 'SAMPLE-0001',
      primerNombre: 'ScriptTest',
      primerApellido: 'Usuario'
    };
    const created = await Caracterizacion.create(sample);
    console.log('Creado:', created);
    process.exit(0);
  }catch(err){
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
