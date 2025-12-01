import mongoose from 'mongoose';

const parametroSchema = new mongoose.Schema({
  tipo: { type: String },
  codigo: { type: String },
  valor: { type: String },
  valorAdicional: { type: String },
  codigoDIVIPOLA: { type: String },
  codigoISO3166: { type: String },
  orden: { type: Number },
  estado: { type: String, enum: ['ACTIVO','INACTIVO'], default: 'ACTIVO' }
}, {
  collection: 'parametros',
  timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

parametroSchema.index({ tipo: 1, codigo: 1 }, { unique: true, sparse: true });
parametroSchema.index({ tipo: 1, estado: 1 });

export default mongoose.model('Parametro', parametroSchema);
