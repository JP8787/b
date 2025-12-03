import mongoose from 'mongoose';

const { Schema } = mongoose;

const baseSync = {
  creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  actualizadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  deleted: { type: Boolean, default: false },
  version: { type: Number, default: 1 }
};

const UsuarioSchema = new Schema({
  nombreUsuario: { type: String, required: true, unique: true, index: true },
  password: { type: String, select: false },
  tipoDocumento: { type: String, required: true },
  numeroDocumento: { type: String, required: true },
  nacionalidad: { type: String },
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  correoElectronico: { type: String, required: true, index: true },
  rol: { type: String, enum: ['LIDER', 'ASESOR_CRORE', 'ADMIN'], required: true },
  liderAsignado: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  departamento: { type: String },
  ciudad: { type: String },
  estado: { type: String, enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' },
  ...baseSync
}, { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, collection: 'usuarios' });

UsuarioSchema.index({ numeroDocumento: 1, tipoDocumento: 1 });
UsuarioSchema.index({ liderAsignado: 1 });

export default mongoose.model('Usuario', UsuarioSchema);
