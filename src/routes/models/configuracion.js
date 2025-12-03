import mongoose from 'mongoose';

const { Schema } = mongoose;

const baseSync = {
  creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  actualizadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  deleted: { type: Boolean, default: false },
  version: { type: Number, default: 1 }
};

const ConfiguracionSchema = new Schema({
  clave: { type: String, required: true, unique: true },
  valor: { type: String },
  descripcion: { type: String },
  tipo: { type: String },
  modulo: { type: String },
  editable: { type: Boolean, default: true },
  usuarioCreacion: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  usuarioActualizacion: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  ...baseSync
}, { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, collection: 'configuracion' });

ConfiguracionSchema.index({ modulo: 1 });

export default mongoose.model('Configuracion', ConfiguracionSchema);
