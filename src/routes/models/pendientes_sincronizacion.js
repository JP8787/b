import mongoose from 'mongoose';

const pendienteSchema = new mongoose.Schema({
  coleccion: { type: String },
  documentoId: { type: mongoose.Schema.Types.ObjectId },
  accion: { type: String },
  datos: { type: Object },
  fechaCreacion: { type: Date, default: Date.now },
  intentos: { type: Number, default: 0 },
  ultimoIntento: { type: Date },
  error: { type: String },
  prioridad: { type: Number, default: 0 }
}, {
  collection: 'pendientes_sincronizacion'
});

pendienteSchema.index({ coleccion: 1 });
pendienteSchema.index({ fechaCreacion: 1 });
pendienteSchema.index({ prioridad: -1 });
pendienteSchema.index({ intentos: 1 });

export default mongoose.model('PendienteSincronizacion', pendienteSchema);
