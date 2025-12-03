import mongoose from 'mongoose';

const { Schema } = mongoose;

const baseSync = {
  creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  actualizadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  deleted: { type: Boolean, default: false },
  version: { type: Number, default: 1 }
};

const PendienteSchema = new Schema({
  coleccion: { type: String },
  documentoId: { type: Schema.Types.ObjectId },
  accion: { type: String },
  datos: { type: Schema.Types.Mixed },
  fechaCreacion: { type: Date, default: Date.now },
  intentos: { type: Number, default: 0 },
  ultimoIntento: { type: Date },
  error: { type: String },
  prioridad: { type: Number, default: 0 },
  ...baseSync
}, { collection: 'pendientes_sincronizacion', timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' } });

PendienteSchema.index({ coleccion: 1 });
PendienteSchema.index({ fechaCreacion: 1 });
PendienteSchema.index({ prioridad: -1 });
PendienteSchema.index({ intentos: 1 });

export default mongoose.model('PendienteSincronizacion', PendienteSchema);
