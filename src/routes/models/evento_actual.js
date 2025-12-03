import mongoose from 'mongoose';

const { Schema } = mongoose;

const baseSync = {
  creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  actualizadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  deleted: { type: Boolean, default: false },
  version: { type: Number, default: 1 }
};

const EventoActualSchema = new Schema({
  eventoId: { type: Schema.Types.ObjectId },
  datosEvento: {
    fechaInicio: Date,
    fechaFinalizacion: Date,
    ciudad: String,
    lugar: String,
    estado: String,
    asesores: [{ type: Schema.Types.ObjectId }]
  },
  fechaInicializacion: { type: Date, default: Date.now },
  usuarioInicializacion: { type: Schema.Types.ObjectId },
  sincronizado: { type: Boolean, default: true },
  ...baseSync
}, { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, collection: 'evento_actual' });

EventoActualSchema.index({ eventoId: 1 }, { unique: true });

export default mongoose.model('EventoActual', EventoActualSchema);
