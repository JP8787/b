import mongoose from 'mongoose';

const eventoActualSchema = new mongoose.Schema({
  eventoId: { type: mongoose.Schema.Types.ObjectId, unique: true },
  datosEvento: {
    fechaInicio: { type: Date },
    fechaFinalizacion: { type: Date },
    ciudad: { type: String },
    lugar: { type: String },
    estado: { type: String },
    asesores: [{ type: mongoose.Schema.Types.ObjectId }]
  },
  fechaInicializacion: { type: Date, default: Date.now },
  usuarioInicializacion: { type: mongoose.Schema.Types.ObjectId },
  sincronizado: { type: Boolean, default: true }
}, {
  collection: 'evento_actual'
});

eventoActualSchema.index({ eventoId: 1 }, { unique: true });

export default mongoose.model('EventoActual', eventoActualSchema);
