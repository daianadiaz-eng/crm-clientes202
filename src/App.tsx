import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle, Clock, Users, Briefcase } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

export default function App() {
  // Datos iniciales basados en tu Excel de Control de Contactos
  const [contactos, setContactos] = useState([
    { id: 1, empresa: 'Laboratorio A', industria: 'Farmacéutica', contacto: 'Ing. Alejandro Sanz', medio: 'Mail', presentacion: 'Sí', encargado: 'Ana', respuesta: 'Sí', observaciones: 'Interesado' },
    { id: 2, empresa: 'Cosméticos B', industria: 'Perfumera', contacto: 'Lic. Beatriz Pinzón', medio: 'LinkedIn', presentacion: 'No', encargado: 'Camila', respuesta: 'No', observaciones: 'Enviar catálogo' },
    { id: 3, empresa: 'Alimentos C', industria: 'Alimenticia', contacto: 'Andrés Mendoza', medio: 'Teléfono', presentacion: 'Sí', encargado: 'Ana', respuesta: 'Pendiente', observaciones: 'Llamar el viernes' },
    { id: 4, empresa: 'Distribuidora D', industria: 'Autopartes', contacto: 'Valeria Duque', medio: 'Mail', presentacion: 'Sí', encargado: 'Camila', respuesta: 'No', observaciones: 'Sin respuesta a 1er contacto' },
  ]);

  // Cálculos automáticos para los gráficos y panel de resumen
  const resumenIndustria = useMemo(() => {
    const conteo = {};
    contactos.forEach(c => conteo[c.industria] = (conteo[c.industria] || 0) + 1);
    return Object.keys(conteo).map(key => ({ name: key, cantidad: conteo[key] }));
  }, [contactos]);

  const resumenEfectividad = useMemo(() => {
    const conteo = { 'Sí': 0, 'No': 0, 'Pendiente': 0 };
    contactos.forEach(c => conteo[c.respuesta] += 1);
    return [
      { name: 'Respondieron', value: conteo['Sí'], color: '#10b981' },
      { name: 'Sin Respuesta', value: conteo['No'], color: '#ef4444' },
      { name: 'Pendientes', value: conteo['Pendiente'], color: '#f59e0b' }
    ];
  }, [contactos]);

  // Filtro de Alertas (Sin respuesta o sin presentación enviada)
  const alertas = contactos.filter(c => c.respuesta === 'No' || c.presentacion === 'No');

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabecera */}
        <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Panel de Resumen 2026</h1>
            <p className="text-gray-500 text-sm">Control Comercial - Ana & Camila</p>
          </div>
          <div className="flex space-x-4 text-sm font-medium">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Total Mapeadas: {contactos.length}</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Respuestas Recibidas: {resumenEfectividad[0].value}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Gráfico: Distribución por Industria */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2"/> Por Industria</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resumenIndustria}>
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico: Efectividad de Contacto */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center"><Users className="w-5 h-5 mr-2"/> Efectividad de Contacto</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={resumenEfectividad} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {resumenEfectividad.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 text-xs font-semibold mt-2">
              <span className="text-green-600">● Respondieron</span>
              <span className="text-red-600">● Sin Respuesta</span>
              <span className="text-yellow-600">● Pendientes</span>
            </div>
          </div>

          {/* Panel de Alertas */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-red-200">
            <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center"><AlertCircle className="w-5 h-5 mr-2"/> Alertas de Seguimiento</h3>
            <div className="space-y-3 overflow-y-auto h-64 pr-2">
              {alertas.map(alerta => (
                <div key={alerta.id} className="bg-red-50 p-3 rounded-lg border border-red-100 flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-red-800">{alerta.empresa}</h4>
                    <p className="text-xs text-red-600 mt-1">
                      {alerta.respuesta === 'No' ? '⚠️ Sin respuesta al contacto' : '⚠️ Falta enviar presentación'}
                    </p>
                  </div>
                  <span className="text-xs bg-white text-gray-600 px-2 py-1 rounded shadow-sm font-medium">
                    Resp: {alerta.encargado}
                  </span>
                </div>
              ))}
              {alertas.length === 0 && <p className="text-sm text-gray-500 text-center mt-10">Todo al día. No hay alertas.</p>}
            </div>
          </div>

        </div>

        {/* Tabla: Control de Contactos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Control de Contactos</h2>
            <button className="bg-blue-600 text-white px-4 py-2 text-sm rounded shadow hover:bg-blue-700 font-medium">
              + Nuevo Contacto
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-xs uppercase text-gray-500 font-bold">
                  <th className="p-4">Empresa / Industria</th>
                  <th className="p-4">Contacto</th>
                  <th className="p-4">Vía</th>
                  <th className="p-4 text-center">Encargada</th>
                  <th className="p-4 text-center">Presentación</th>
                  <th className="p-4 text-center">Respuesta</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {contactos.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{c.empresa}</div>
                      <div className="text-xs text-gray-500">{c.industria}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-700">{c.contacto}</div>
                    </td>
                    <td className="p-4"><span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{c.medio}</span></td>
                    <td className="p-4 text-center font-medium text-gray-600">{c.encargado}</td>
                    <td className="p-4 text-center">
                      {c.presentacion === 'Sí' ? 
                        <span className="inline-flex items-center text-green-600 text-xs font-bold"><CheckCircle className="w-4 h-4 mr-1"/> Sí</span> : 
                        <span className="inline-flex items-center text-red-500 text-xs font-bold"><Clock className="w-4 h-4 mr-1"/> No</span>
                      }
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        c.respuesta === 'Sí' ? 'bg-green-100 text-green-700' :
                        c.respuesta === 'No' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {c.respuesta}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}