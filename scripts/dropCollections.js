import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function main(){
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');
    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();
    const names = collections.map(c=>c.name);

    if(names.includes('books')){
      await db.collection('books').drop();
      console.log('Colección "books" borrada.');
    } else {
      console.log('Colección "books" no existe.');
    }

    if(names.includes('users')){
      await db.collection('users').drop();
      console.log('Colección "users" borrada.');
    } else {
      console.log('Colección "users" no existe.');
    }

    process.exit(0);
  }catch(err){
    console.error('Error al borrar colecciones:', err.message || err);
    process.exit(1);
  }
}

main();
