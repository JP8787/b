import mongoose from 'mongoose';

const entidadSchema = new mongoose.Schema({
  nombre: { type: String },
  correoElectronico: { type: String },
  telefono: { type: String },
  direccion: { type: String },
  ciudad: { type: String },
  departamento: { type: String },
  tipo: { type: String },
  estado: { type: String, enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' },
  creadoPor: { type: String },
  actualizadoPor: { type: String }
}, {
  collection: 'entidades',
  timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

entidadSchema.index({ estado: 1 });
entidadSchema.index({ tipo: 1 });

export default mongoose.model('Entidad', entidadSchema);
