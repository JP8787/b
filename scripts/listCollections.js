import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function main(){
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Colecciones encontradas:', collections.map(c=>c.name));

    for(const c of collections){
      const count = await db.collection(c.name).countDocuments();
      console.log(`- ${c.name}: ${count} documentos`);
    }

    process.exit(0);
  }catch(err){
    console.error('Error listando colecciones:', err);
    process.exit(1);
  }
}

main();
