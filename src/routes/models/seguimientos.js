import mongoose from 'mongoose';

const registroSchema = new mongoose.Schema({
  fecha: { type: Date },
  accionRealizada: { type: String },
  gestionRealizadaAnte: { type: String },
  tipoConsulta: { type: String },
  registradoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  fechaRegistro: { type: Date }
}, { _id: false });

const seguimientoSchema = new mongoose.Schema({
  caracterizacionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Caracterizacion' },
  enlaceId: { type: mongoose.Schema.Types.ObjectId },
  asesorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  registros: { type: [registroSchema], default: [] },
  estado: { type: String, enum: ['ABIERTO', 'CERRADO'], default: 'ABIERTO' },
  creadoPor: { type: String },
  actualizadoPor: { type: String }
}, {
  collection: 'seguimientos',
  timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

seguimientoSchema.index({ caracterizacionId: 1 });
seguimientoSchema.index({ estado: 1 });

export default mongoose.model('Seguimiento', seguimientoSchema);
