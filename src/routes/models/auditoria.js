import mongoose from 'mongoose';

const auditoriaSchema = new mongoose.Schema({
  coleccion: { type: String },
  documentoId: { type: mongoose.Schema.Types.ObjectId },
  operacion: { type: String },
  usuario: { type: String },
  datosAnteriores: { type: Object },
  datosNuevos: { type: Object },
  modoConexion: { type: String },
  dispositivoId: { type: String },
  estadoSincronizacion: { type: String },
  mensajeError: { type: String },
  fechaOperacion: { type: Date, default: Date.now },
  ip: { type: String }
}, {
  collection: 'auditoria'
});

auditoriaSchema.index({ coleccion: 1, documentoId: 1 });
auditoriaSchema.index({ usuario: 1, fechaOperacion: -1 });
auditoriaSchema.index({ estadoSincronizacion: 1 });
auditoriaSchema.index({ fechaOperacion: -1 });

export default mongoose.model('Auditoria', auditoriaSchema);
