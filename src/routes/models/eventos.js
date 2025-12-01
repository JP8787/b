import mongoose from 'mongoose';

const asesorSubschema = new mongoose.Schema({
  asesorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  nombreCompleto: { type: String },
  correoElectronico: { type: String }
}, { _id: false });

const eventoSchema = new mongoose.Schema({
  ciudad: { type: String },
  departamento: { type: String },
  lugarCaracterizacion: { type: String },
  fechaInicio: { type: Date },
  fechaFin: { type: Date },
  estado: { type: String, enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' },
  asesores: { type: [asesorSubschema], default: [] },
  creadoPor: { type: String },
  actualizadoPor: { type: String }
}, {
  collection: 'eventos',
  timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

eventoSchema.index({ fechaInicio: 1, fechaFin: 1 });
eventoSchema.index({ estado: 1 });
eventoSchema.index({ ciudad: 1, departamento: 1 });

export default mongoose.model('Evento', eventoSchema);
