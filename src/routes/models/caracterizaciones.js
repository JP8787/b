import mongoose from 'mongoose';

const tiempoPermanenciaSchema = new mongoose.Schema({
  anos: { type: Number },
  meses: { type: Number },
  dias: { type: Number }
}, { _id: false });

const otraNacionalidadSchema = new mongoose.Schema({
  nacionalidad: { type: String },
  numeroPasaporte: { type: String }
}, { _id: false });

const remisionSchema = new mongoose.Schema({
  entidad: { type: String },
  correoEntidad: { type: String },
  prioridad: { type: String },
  fechaRemision: { type: Date }
}, { _id: false });

const caracterizacionSchema = new mongoose.Schema({
  eventoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Evento' },
  fechaRegistro: { type: Date },
  asesorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },

  tipoDocumento: { type: String },
  numeroDocumento: { type: String },
  primerNombre: { type: String },
  segundoNombre: { type: String },
  primerApellido: { type: String },
  segundoApellido: { type: String },
  fechaNacimiento: { type: Date },
  genero: { type: String },
  telefono: { type: String },
  tieneCorreo: { type: Boolean },
  correoElectronico: { type: String },

  autoReconoce: { type: String },
  esVictimaConflicto: { type: Boolean },

  otraNacionalidad: { type: [otraNacionalidadSchema], default: [] },

  nivelEstudio: { type: String },
  areaConocimiento: { type: String },

  conQuienMigro: { type: String },
  razonMigracion: { type: String },
  actividadPrincipalAntesMigracion: { type: String },
  actividadOtra: { type: String },

  ciudadDestino: { type: String },
  departamentoDestino: { type: String },
  direccionResidencia: { type: String },

  motivoRetorno: { type: String },
  fechaIngresoAlPais: { type: Date },
  paisDelQueRegresa: { type: String },
  tiempoPermanencia: { type: tiempoPermanenciaSchema },

  situacionRiesgo: { type: Boolean },
  descripcionRiesgo: { type: String },

  retornaConNucleoFamiliar: { type: Boolean },
  composicionNucleoFamiliar: { type: [String], default: [] },

  expectativaEnCincoAños: { type: String },
  paisDestino: { type: String },
  ciudadDestino: { type: String },

  tieneHijosEnColombia: { type: Boolean },
  hijosAsistenInstitucion: { type: Boolean },
  beneficiarioProgramaEstatal: { type: Boolean },
  programaEstatal: { type: String },

  apoyoFamiliar: { type: Boolean },
  quienApoya: { type: String },
  relacionFamiliar: { type: String },
  numeroContactoFamiliar: { type: String },

  accidenteEnfermedad: { type: Boolean },
  descripcionAccidenteEnfermedad: { type: String },
  tieneDiscapacidad: { type: Boolean },
  tipoDiscapacidad: { type: String },
  vinculadoRegimenSalud: { type: Boolean },

  registradoRUR: { type: Boolean },
  tipoRetorno: { type: String },
  interesadoOrientacion: { type: Boolean },
  necesidadProteccion: { type: Boolean },
  condicionProteccion: { type: String },

  motivoRemision: { type: String },
  remisionHechaPor: { type: String },

  remisiones: { type: [remisionSchema], default: [] },

  cargoGIT: { type: String },
  correoGIT: { type: String },
  lugar: { type: String },
  observaciones: { type: String },

  estado: { type: String },
  modoConexion: { type: String, enum: ['ONLINE', 'OFFLINE'] },
  sincronizado: { type: Boolean, default: true },
  fechaSincronizacion: { type: Date },

  consentimientoDatos: { type: Boolean },

  creadoPor: { type: String },
  actualizadoPor: { type: String }
}, {
  collection: 'caracterizaciones',
  timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

// Índices sugeridos
caracterizacionSchema.index({ numeroDocumento: 1, tipoDocumento: 1 });
caracterizacionSchema.index({ eventoId: 1, estado: 1 });
caracterizacionSchema.index({ sincronizado: 1, modoConexion: 1 });
caracterizacionSchema.index({ fechaRegistro: 1 });
caracterizacionSchema.index({ asesorId: 1 });

export default mongoose.model('Caracterizacion', caracterizacionSchema);
