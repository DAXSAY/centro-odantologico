import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  User,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({ isOpen, onClose }) => {
  const { addPatient, selectedSede } = useApp();

  const [docType, setDocType] = useState<'DNI' | 'RUC' | 'CE' | 'PASAPORTE'>('DNI');
  const [docNumber, setDocNumber] = useState('');
  const [isSearchingReniec, setIsSearchingReniec] = useState(false);
  const [reniecSuccess, setReniecSuccess] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [paternalSurname, setPaternalSurname] = useState('');
  const [maternalSurname, setMaternalSurname] = useState('');
  const [birthDate, setBirthDate] = useState('1995-05-10');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [civilStatus, setCivilStatus] = useState<'soltero' | 'casado' | 'divorciado' | 'viudo'>('soltero');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Santiago de Surco');
  const [department, setDepartment] = useState('Lima');
  const [occupation, setOccupation] = useState('');
  const [insuranceType, setInsuranceType] = useState('Particular');
  const [insuranceNumber, setInsuranceNumber] = useState('');

  // Medical alerts
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>(['Ninguna']);
  const [customAllergy, setCustomAllergy] = useState('');

  if (!isOpen) return null;

  const handleReniecSearch = () => {
    if (!docNumber) return;
    setIsSearchingReniec(true);
    setReniecSuccess(false);

    setTimeout(() => {
      setIsSearchingReniec(false);
      setReniecSuccess(true);

      if (docType === 'DNI') {
        if (docNumber === '42789312') {
          setFirstName('Manuel Hipólito');
          setPaternalSurname('Aguado');
          setMaternalSurname('Sierra');
          setBirthDate('1983-04-12');
          setGender('M');
          setPhone('+51972781904');
          setEmail('systemcft.pe@gmail.com');
          setAddress('Av. Santa Anita 440');
          setDistrict('Santa Anita');
        } else if (docNumber.length >= 8) {
          // Realistic generation based on digits
          const sampleNames = ['Carlos Alberto', 'María Elena', 'Jorge Luis', 'Patricia Rosa', 'Diego Alejandro'];
          const samplePaterno = ['Vargas', 'Ramos', 'Gutiérrez', 'Medina', 'Castillo'];
          const sampleMaterno = ['Flores', 'Quispe', 'Rojas', 'Huamán', 'Morales'];
          const idx = parseInt(docNumber.slice(-1), 10) % 5;
          setFirstName(sampleNames[idx]);
          setPaternalSurname(samplePaterno[idx]);
          setMaternalSurname(sampleMaterno[idx]);
          setAddress('Av. Principal 450');
          setDistrict('Surco');
        }
      } else if (docType === 'RUC') {
        setFirstName('Empresa Dental Corp S.A.C.');
        setPaternalSurname('S.A.C.');
        setMaternalSurname('');
        setAddress('Av. Javier Prado Este 2340');
        setDistrict('San Isidro');
      }
    }, 650);
  };

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  const toggleCondition = (condition: string) => {
    if (condition === 'Ninguna') {
      setSelectedConditions(['Ninguna']);
      return;
    }
    setSelectedConditions((prev) => {
      const filtered = prev.filter((c) => c !== 'Ninguna');
      return filtered.includes(condition)
        ? filtered.filter((c) => c !== condition)
        : [...filtered, condition];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${firstName} ${paternalSurname} ${maternalSurname}`.trim();
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = 2026;
    const age = Math.max(1, currentYear - birthYear);

    const finalAllergies = customAllergy.trim()
      ? [...selectedAllergies, customAllergy.trim()]
      : selectedAllergies;

    addPatient({
      fullName,
      firstName,
      paternalSurname,
      maternalSurname,
      docType,
      docNumber: docNumber || '00000000',
      birthDate,
      age,
      gender,
      civilStatus,
      phone,
      email,
      address,
      district,
      department,
      occupation,
      insuranceType,
      insuranceNumber,
      allergies: finalAllergies,
      baseConditions: selectedConditions,
      sedeId: selectedSede === 'todas' ? 'clinica-surco' : selectedSede,
      notes: 'Paciente registrado vía formulario de admisión.',
    });

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-teal-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-teal-300" />
            <h2 className="text-sm md:text-base font-bold">Registro de Nuevo Paciente</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Section 1: RENIEC / SUNAT lookup */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-teal-600" />
              1. BÚSQUEDA POR DOCUMENTO (RENIEC / SUNAT)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-4">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Tipo de documento
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="DNI">DNI (8 dígitos)</option>
                  <option value="RUC">RUC (11 dígitos)</option>
                  <option value="CE">Carné de Extranjería</option>
                  <option value="PASAPORTE">Pasaporte</option>
                </select>
              </div>

              <div className="sm:col-span-5">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Número de documento
                </label>
                <input
                  type="text"
                  placeholder="Ej: 42789312"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="button"
                  onClick={handleReniecSearch}
                  disabled={isSearchingReniec || !docNumber}
                  className="w-full text-xs font-bold py-2 px-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  {isSearchingReniec ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  <span>Buscar RENIEC</span>
                </button>
              </div>
            </div>

            {reniecSuccess && (
              <div className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 p-2 rounded-lg flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Datos recuperados automáticamente de RENIEC/SUNAT. Verifique los campos.</span>
              </div>
            )}
          </div>

          {/* Section 2: Datos Personales */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              2. DATOS PERSONALES
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Nombres *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Manuel Hipólito"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Apellido Paterno *</label>
                <input
                  type="text"
                  value={paternalSurname}
                  onChange={(e) => setPaternalSurname(e.target.value)}
                  placeholder="Aguado"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Apellido Materno</label>
                <input
                  type="text"
                  value={maternalSurname}
                  onChange={(e) => setMaternalSurname(e.target.value)}
                  placeholder="Sierra"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Sexo</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Estado Civil</label>
                <select
                  value={civilStatus}
                  onChange={(e) => setCivilStatus(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="soltero">Soltero(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viudo">Viudo(a)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+51 972781904"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="paciente@correo.com"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Dirección</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Av. Primavera 123"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Distrito</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Surco"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Tipo de Seguro</label>
                <select
                  value={insuranceType}
                  onChange={(e) => setInsuranceType(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Particular">Particular</option>
                  <option value="Rimac Seguros">Rímac Seguros</option>
                  <option value="Pacífico">Pacífico</option>
                  <option value="Mapfre">Mapfre</option>
                  <option value="La Positiva">La Positiva</option>
                  <option value="EsSalud">EsSalud</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Antecedentes Médicos (N° 0153 MINSA) */}
          <div className="space-y-3 p-4 bg-rose-50/50 border border-rose-200/80 rounded-xl">
            <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wide flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              3. ANTECEDENTES MÉDICOS (N° 0153 MINSA)
            </h3>

            {/* Alergias */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Alergias Conocidas:</label>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Penicilina', 'Aines / Ibuprofeno', 'Sulfas', 'Látex', 'Anestésicos locales'].map(
                  (alg) => {
                    const active = selectedAllergies.includes(alg);
                    return (
                      <button
                        type="button"
                        key={alg}
                        onClick={() => toggleAllergy(alg)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                          active
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {alg}
                      </button>
                    );
                  }
                )}
              </div>
              <input
                type="text"
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                placeholder="Otra alergia no listada..."
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none mt-1"
              />
            </div>

            {/* Enfermedades de Base */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700">Enfermedades de Base:</label>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Ninguna', 'Diabetes Mellitus', 'Hipertensión Arterial', 'Asma', 'Cardiopatía', 'Epilepsia'].map(
                  (cond) => {
                    const active = selectedConditions.includes(cond);
                    return (
                      <button
                        type="button"
                        key={cond}
                        onClick={() => toggleCondition(cond)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                          active
                            ? 'bg-teal-700 text-white border-teal-700'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {cond}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              id="btn-submit-nuevo-paciente"
              type="submit"
              className="px-5 py-2.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md transition-all hover:scale-[1.02]"
            >
              Guardar y Crear Ficha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
