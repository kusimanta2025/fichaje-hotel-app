import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Mail, MessageSquare, History, Settings, Coffee, Hotel, Eye, Users } from 'lucide-react';

const TimeClockApp = () => {
  const [viewMode, setViewMode] = useState('employee'); // 'employee' or 'hotel'
  const [isWorking, setIsWorking] = useState(true);
  const [currentSession, setCurrentSession] = useState({ id: Date.now(), clockIn: new Date(Date.now() - 3600000), clockOut: null });
  const [timeRecords, setTimeRecords] = useState([]);
  const [allEmployees, setAllEmployees] = useState([
    { id: 'EMP001', name: 'María García', department: 'Recepción', isWorking: true, clockIn: new Date(Date.now() - 2 * 60 * 60 * 1000), location: 'Lobby' },
    { id: 'EMP002', name: 'Carlos López', department: 'Restaurante', isWorking: true, clockIn: new Date(Date.now() - 2 * 60 * 60 * 1000), location: 'Comedor' },
    { id: 'EMP003', name: 'Ana Martín', department: 'Limpieza', isWorking: true, clockIn: new Date(Date.now() - 1 * 60 * 60 * 1000), location: 'Planta 3' },
    { id: 'EMP004', name: 'José Ruiz', department: 'Cocina', isWorking: false, clockIn: null, location: 'Cocina' },
    { id: 'EMP005', name: 'Laura Sanz', department: 'Bar', isWorking: true, clockIn: new Date(Date.now() - 3 * 60 * 60 * 1000), location: 'Terraza' }
  ]);
  const [employee, setEmployee] = useState({
    name: 'María García',
    id: 'EMP001',
    department: 'Recepción',
    company: 'Hotel Vista Mar'
  });
  const [showNotification, setShowNotification] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, employee: 'Carlos López', action: 'ENTRADA', time: new Date(Date.now() - 2 * 60 * 60 * 1000), department: 'Restaurante' },
    { id: 2, employee: 'Ana Martín', action: 'ENTRADA', time: new Date(Date.now() - 1 * 60 * 60 * 1000), department: 'Limpieza' },
    { id: 3, employee: 'Laura Sanz', action: 'ENTRADA', time: new Date(Date.now() - 3 * 60 * 60 * 1000), department: 'Bar' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const showNotificationMessage = (message, type) => {
    setShowNotification({ message, type });
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleClockIn = () => {
    const now = new Date();
    const session = {
      id: Date.now(),
      clockIn: now,
      clockOut: null,
      date: now.toDateString(),
      location: 'Hotel Vista Mar - Recepción'
    };

    setCurrentSession(session);
    setIsWorking(true);

    setAllEmployees(prev => prev.map(emp =>
      emp.id === employee.id ? { ...emp, isWorking: true, clockIn: now } : emp
    ));

    setRecentActivity(prev => [{
      id: Date.now(),
      employee: employee.name,
      action: 'ENTRADA',
      time: now,
      department: employee.department
    }, ...prev.slice(0, 9)]);

    showNotificationMessage(
      'Entrada registrada. Email enviado a gerencia y SMS confirmación enviado.',
      'success'
    );

    console.log('Email enviado a: gerencia@hotelvistmar.com');
    console.log(`SMS enviado a ${employee.name}: "Entrada registrada a las ${formatTime(now)}"`);
  };

  const handleClockOut = () => {
    if (!currentSession) return;

    const now = new Date();
    const updatedSession = {
      ...currentSession,
      clockOut: now,
      totalHours: ((now - currentSession.clockIn) / (1000 * 60 * 60)).toFixed(2)
    };

    setTimeRecords(prev => [updatedSession, ...prev]);
    setCurrentSession(null);
    setIsWorking(false);

    setAllEmployees(prev => prev.map(emp =>
      emp.id === employee.id ? { ...emp, isWorking: false, clockIn: null } : emp
    ));

    setRecentActivity(prev => [{
      id: Date.now(),
      employee: employee.name,
      action: 'SALIDA',
      time: now,
      department: employee.department
    }, ...prev.slice(0, 9)]);

    showNotificationMessage(
      'Salida registrada. Resumen enviado por email y SMS.',
      'success'
    );

    console.log('Email enviado a: gerencia@hotelvistmar.com');
    console.log(`SMS enviado a ${employee.name}: "Salida registrada. Total: ${updatedSession.totalHours}h"`);
  };

  const getWorkingTime = () => {
    if (!currentSession) return '00:00:00';
    const diff = currentTime - currentSession.clockIn;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getEmployeeWorkingTime = (clockInTime) => {
    if (!clockInTime) return '00:00:00';
    const diff = currentTime - clockInTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderEmployeeView = () => (
    <div className="px-4 py-6 bg-gray-50 min-h-screen">
      {/* Employee Info */}
      <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-full">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{employee.name}</h2>
            <p className="text-gray-600">{employee.department}</p>
            <p className="text-sm text-gray-500">{employee.company}</p>
          </div>
        </div>
      </div>

      {/* Current Time */}
      <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <Clock className="h-6 w-6 text-indigo-600 mr-2" />
          <span className="text-lg font-semibold text-gray-700">Hora Actual</span>
        </div>
        <div className="text-4xl font-extrabold text-indigo-700 mb-2">
          {formatTime(currentTime)}
        </div>
        <div className="text-gray-600 text-sm">
          {formatDate(currentTime)}
        </div>
      </div>

      {/* Working Status */}
      {isWorking && (
        <div className="bg-green-100 border border-green-300 rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-green-500 w-3 h-3 rounded-full mr-3 animate-pulse"></div>
              <span className="text-green-800 font-semibold text-lg">En Servicio</span>
            </div>
            <Coffee className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-800 mb-2">
            {getWorkingTime()}
          </div>
          <div className="text-sm text-green-700">
            Entrada: {currentSession ? formatTime(currentSession.clockIn) : ''}
          </div>
        </div>
      )}

      {/* Clock In/Out Buttons */}
      <div className="space-y-4 mb-6">
        {!isWorking ? (
          <button
            onClick={handleClockIn}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-8 rounded-3xl shadow-xl transform transition duration-200 hover:scale-105 active:scale-95 flex items-center justify-center space-x-4"
          >
            <Clock className="h-10 w-10" />
            <div>
              <div className="text-2xl">FICHAR ENTRADA</div>
              <div className="text-sm opacity-90">Comenzar jornada</div>
            </div>
          </button>
        ) : (
          <button
            onClick={handleClockOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-8 rounded-3xl shadow-xl transform transition duration-200 hover:scale-105 active:scale-95 flex items-center justify-center space-x-4"
          >
            <Clock className="h-10 w-10" />
            <div>
              <div className="text-2xl">FICHAR SALIDA</div>
              <div className="text-sm opacity-90">Finalizar jornada</div>
            </div>
          </button>
        )}
      </div>

      {/* Location Info */}
      <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
        <div className="flex items-center space-x-3">
          <MapPin className="h-6 w-6 text-blue-600" />
          <div>
            <div className="font-semibold text-gray-800">Ubicación Actual</div>
            <div className="text-sm text-gray-600">Hotel Vista Mar - Recepción</div>
          </div>
        </div>
      </div>

      {/* Recent Records */}
      {timeRecords.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <History className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800">Registros Recientes</h3>
          </div>
          <div className="space-y-3">
            {timeRecords.slice(0, 3).map((record) => (
              <div key={record.id} className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-800">
                      {new Date(record.date).toLocaleDateString('es-ES')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatTime(record.clockIn)} - {formatTime(record.clockOut)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{record.totalHours}h</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderHotelView = () => (
    <div className="px-4 py-6 bg-gray-50 min-h-screen">
      {/* Hotel Dashboard Header */}
      <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Panel de Control</h2>
            <p className="text-gray-600">Hotel Vista Mar - Supervisión</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Hotel className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-100 border border-green-300 rounded-2xl p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-700">
              {allEmployees.filter(emp => emp.isWorking).length}
            </div>
            <div className="text-sm text-green-600">Trabajando Ahora</div>
          </div>
        </div>
        <div className="bg-blue-100 border border-blue-300 rounded-2xl p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-700">
              {allEmployees.length}
            </div>
            <div className="text-sm text-blue-600">Total Empleados</div>
          </div>
        </div>
      </div>

      {/* Current Time */}
      <div className="bg-white rounded-3xl shadow-xl p-4 mb-6 text-center">
        <div className="text-2xl font-bold text-gray-800 mb-1">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-gray-600">
          {formatDate(currentTime)}
        </div>
      </div>

      {/* Active Employees */}
      <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <div className="bg-green-500 w-3 h-3 rounded-full mr-2 animate-pulse"></div>
          Empleados en Servicio
        </h3>
        <div className="space-y-3">
          {allEmployees.filter(emp => emp.isWorking).map((emp) => (
            <div key={emp.id} className="bg-green-50 border border-green-200 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800">{emp.name}</div>
                  <div className="text-sm text-gray-600">{emp.department} - {emp.location}</div>
                  <div className="text-xs text-green-600 mt-1">
                    Entrada: {formatTime(emp.clockIn)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-700">
                    {getEmployeeWorkingTime(emp.clockIn)}
                  </div>
                  <div className="text-xs text-green-600">Trabajando</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Employees Status */}
      <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Estado de Todo el Personal</h3>
        <div className="space-y-3">
          {allEmployees.map((emp) => (
            <div key={emp.id} className={`p-4 rounded-xl ${emp.isWorking ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800">{emp.name}</div>
                  <div className="text-sm text-gray-600">{emp.department} - {emp.location}</div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${emp.isWorking ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {emp.isWorking ? 'TRABAJANDO' : 'FUERA'}
                  </div>
                  {emp.isWorking && (
                    <div className="text-xs text-green-600 mt-1">
                      {getEmployeeWorkingTime(emp.clockIn)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <History className="h-5 w-5 text-gray-600 mr-2" />
          Actividad Reciente
        </h3>
        <div className="space-y-3">
          {recentActivity.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className={`w-3 h-3 rounded-full ${activity.action === 'ENTRADA' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">
                  {activity.employee} - {activity.action}
                </div>
                <div className="text-xs text-gray-600">
                  {activity.department} • {formatTime(activity.time)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-md p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hotel className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg text-gray-800">FichajeHotel</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'employee' ? 'hotel' : 'employee')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                viewMode === 'employee'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {viewMode === 'employee' ? (
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Ver Hotel</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Ver Empleado</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className={`mx-4 mt-4 p-3 rounded-lg ${showNotification.type === 'success' ? 'bg-green-100 text-green-800 border-green-200 border' : 'bg-red-100 text-red-800 border-red-200 border'}`}>
          {showNotification.message}
        </div>
      )}

      {/* Main Content */}
      {viewMode === 'employee' ? renderEmployeeView() : renderHotelView()}

      {/* Bottom Info */}
      <div className="px-4 pb-6 mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-700">
            Las notificaciones se envían automáticamente por email y SMS
          </div>
          <div className="text-xs text-blue-600 mt-1">
            {viewMode === 'employee'
              ? 'Empresa: gerencia@hotelvistmar.com | Empleado: +34 xxx xxx xxx'
              : 'Sistema de control en tiempo real para supervisores'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeClockApp;