import mongoose from 'mongoose';

const { Schema } = mongoose;

const baseSync = {
  creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  actualizadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  deleted: { type: Boolean, default: false },
  version: { type: Number, default: 1 }
};

const tiempoPermanenciaSchema = new Schema({ anios: Number, meses: Number, dias: Number }, { _id: false });

const otraNacionalidadSchema = new Schema({ pais: String, pasaporte: String }, { _id: false });

const remisionSchema = new Schema({ entidadId: { type: Schema.Types.ObjectId, ref: 'Entidad' }, nombreEntidadSnapshot: String, prioridad: String, fechaRemision: Date, estado: { type: String, default: 'PENDIENTE' } }, { _id: false });

const CaracterizacionSchema = new Schema({
  eventoId: { type: Schema.Types.ObjectId, ref: 'Evento', required: true },
  asesorId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  ciudadano: {
    tipoDocumento: { type: String, required: true },
    numeroDocumento: { type: String, required: true },
    nombres: String,
    apellidos: String,
    fechaNacimiento: Date,
    genero: String,
    telefono: String,
    email: String,
    tieneCorreo: Boolean
  },
  identidad: {
    autoReconoce: String,
    esVictimaConflicto: Boolean,
    otrasNacionalidades: { type: [otraNacionalidadSchema], default: [] }
  },
  formacion: { nivelEstudio: String, areaConocimiento: String },
  migracion: {
    conQuienMigro: String,
    razonMigracion: String,
    actividadAntes: String,
    actividadOtra: String,
    ciudadDestino: String,
    departamentoDestino: String,
    direccionColombia: String,
    motivoRetorno: String,
    fechaIngresoPais: Date,
    paisProcedencia: String,
    tiempoPermanencia: tiempoPermanenciaSchema,
    riesgoTrayecto: { huboRiesgo: Boolean, descripcion: String }
  },
  redesApoyo: {
    retornaConNucleo: Boolean,
    composicionFamiliar: [String],
    hijosEnColombia: Boolean,
    hijosEstudian: Boolean,
    programaEstatal: { esBeneficiario: Boolean, nombre: String },
    apoyoFamiliar: { tieneApoyo: Boolean, quien: String, relacion: String, contacto: String }
  },
  salud: {
    accidente: { huboAccidente: Boolean, descripcion: String },
    discapacidad: { tiene: Boolean, tipo: String },
    afiliadoSalud: Boolean
  },
  gestion: {
    registradoRUR: Boolean,
    tipoRetorno: String,
    necesidadProteccion: { tiene: Boolean, condicion: String },
    motivoRemision: String,
    remisionHechaPor: String,
    remisiones: { type: [remisionSchema], default: [] },
    observaciones: String
  },
  metadataSync: { creadoOffline: { type: Boolean, default: false }, ultimaSincronizacion: Date, dispositivoId: String },
  ...baseSync
}, { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, collection: 'caracterizaciones' });

CaracterizacionSchema.index({ 'ciudadano.tipoDocumento': 1, 'ciudadano.numeroDocumento': 1, eventoId: 1 }, { unique: true });

export default mongoose.model('Caracterizacion', CaracterizacionSchema);
