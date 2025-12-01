import mongoose from 'mongoose';

const configuracionSchema = new mongoose.Schema({
  clave: { type: String, required: true, unique: true },
  valor: { type: String },
  descripcion: { type: String },
  tipo: { type: String },
  modulo: { type: String },
  editable: { type: Boolean, default: true },
  usuarioCreacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  usuarioActualizacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
}, {
  collection: 'configuracion',
  timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

configuracionSchema.index({ modulo: 1 });

export default mongoose.model('Configuracion', configuracionSchema);
