import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombreUsuario: { type: String },
  tipoDocumento: { type: String },
  numeroDocumento: { type: String },
  nacionalidad: { type: String },
  primerNombre: { type: String },
  segundoNombre: { type: String },
  primerApellido: { type: String },
  segundoApellido: { type: String },
  correoElectronico: { type: String },
  rol: { type: String },

  // Para Asesores CRORE
  liderAsignado: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  departamento: { type: String },
  ciudad: { type: String },

  estado: { type: String, enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' },

  creadoPor: { type: String },
  actualizadoPor: { type: String }
}, {
  collection: 'usuarios',
  timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

// Índices sugeridos
usuarioSchema.index({ numeroDocumento: 1, tipoDocumento: 1 });
usuarioSchema.index({ nombreUsuario: 1 }, { unique: true, sparse: true });
usuarioSchema.index({ rol: 1, estado: 1 });
usuarioSchema.index({ liderAsignado: 1 });

export default mongoose.model('Usuario', usuarioSchema);
