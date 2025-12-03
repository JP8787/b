import mongoose from 'mongoose';

const { Schema } = mongoose;

const baseSync = {
  creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  actualizadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  deleted: { type: Boolean, default: false },
  version: { type: Number, default: 1 }
};

const EventoSchema = new Schema({
  nombre: { type: String },
  ciudad: { type: String, required: true },
  departamento: { type: String, required: true },
  lugarCaracterizacion: { type: String },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
  estado: { type: String, enum: ['ACTIVO', 'INACTIVO', 'CERRADO'], default: 'ACTIVO' },
  asesoresAsignados: [{ type: Schema.Types.ObjectId, ref: 'Usuario' }],
  ...baseSync
}, { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, collection: 'eventos' });

EventoSchema.index({ fechaInicio: 1, fechaFin: 1 });
EventoSchema.index({ estado: 1 });
EventoSchema.index({ ciudad: 1, departamento: 1 });

export default mongoose.model('Evento', EventoSchema);
