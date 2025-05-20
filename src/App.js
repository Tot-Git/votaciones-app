// src/App.js

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login';
import FormularioRegistro from './components/FormularioRegistro';
import AgregarCandidato from './components/AgregarCandidato';
import ListaCandidatos from './components/ListaCandidatos';
import HistorialVotos from './components/HistorialVotos';
import MensajeAlert from './components/MensajeAlert';
import ChartVotos from './components/ChartVotos';
import Cargando from './components/Cargando';


function App() {
  // Estado de usuario autenticado
  const [usuario, setUsuario] = useState(null);

  // Estados de la votación
  const [votos, setVotos] = useState({});
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [historial, setHistorial] = useState([]);
  const [candidatos, setCandidatos] = useState([]);
  const [nuevoCandidato, setNuevoCandidato] = useState('');

  // Recuperar sesión al cargar la app
  useEffect(() => {
    const stored = localStorage.getItem('usuario');
    if (stored) setUsuario(JSON.parse(stored));
  }, []);

  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => {
      setMensaje('');
      setTipoMensaje('');
    }, 3000);
  };

  const cargarVotos = (silencioso = false) => {
    if (!silencioso) setCargando(true);
    fetch('http://localhost:3001/votos')
      .then(res => res.json())
      .then(data => {
        const m = {};
        data.forEach(r => m[r.id] = r.votos);
        setVotos(m);
      })
      .catch(() => !silencioso && mostrarMensaje('Error al cargar votos','danger'))
      .finally(() => !silencioso && setCargando(false));
  };

  const cargarHistorial = () => {
    fetch('http://localhost:3001/historial')
      .then(res => res.json())
      .then(setHistorial)
      .catch(() => mostrarMensaje('Error al cargar historial','danger'));
  };

  const cargarCandidatos = () => {
    fetch('http://localhost:3001/candidatos')
      .then(res => res.json())
      .then(setCandidatos)
      .catch(console.error);
  };

  useEffect(() => {
    if (!usuario) return;
    cargarCandidatos();
    cargarVotos();
    cargarHistorial();
    const iv = setInterval(() => {
      cargarCandidatos();
      cargarVotos(true);
      cargarHistorial();
    }, 5000);
    return () => clearInterval(iv);
  }, [usuario]);

  const votar = candidatoId => {
    setCargando(true);
    fetch('http://localhost:3001/votar', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ candidatoId })
    })
      .then(res => res.ok ? res.text() : Promise.reject())
      .then(() => {
        mostrarMensaje('¡Voto registrado con éxito!','success');
        cargarVotos();
        cargarHistorial();
      })
      .catch(() => mostrarMensaje('Error al votar','danger'))
      .finally(() => setCargando(false));
  };

  const agregarCandidato = e => {
    e.preventDefault();
    if (!nuevoCandidato.trim()) return;
    fetch('http://localhost:3001/candidatos', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ nombre: nuevoCandidato.trim() })
    })
      .then(res => res.ok ? res.text() : Promise.reject())
      .then(() => {
        mostrarMensaje('Candidato agregado','success');
        setNuevoCandidato('');
        cargarCandidatos();
        cargarVotos();
      })
      .catch(() => mostrarMensaje('Error al agregar candidato','danger'));
  };

  // **función para eliminar un candidato**
  const eliminarCandidato = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este candidato?')) return;

    fetch(`http://localhost:3001/candidatos/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) return Promise.reject();
        return res.text();
      })
      .then(() => {
        mostrarMensaje('Candidato eliminado', 'warning');
        cargarCandidatos();
        cargarVotos();
        cargarHistorial();
      })
      .catch(() => mostrarMensaje('Error al eliminar candidato', 'danger'));
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  // Si no está autenticado, mostrar login
  if (!usuario) {
    return <Login onLogin={user => {
      localStorage.setItem('usuario', JSON.stringify(user));
      setUsuario(user);
    }} />;
  }

  return (
    <div className="container text-center mt-5">
      <h1>Votación</h1>
      <button
        className="btn btn-outline-secondary float-end"
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>

      <div className="row">
        {/* Lista de candidatos y botón de votar - disponible para todos */}
        <div className="col-12 mb-4">
          <ListaCandidatos
            candidatos={candidatos}
            votos={votos}
            votar={votar}
            cargando={cargando}
            // Los votantes no ven el botón "Eliminar", porque recibirán undefined para eliminarCandidato
            eliminarCandidato={usuario.tipoUsuario === 'administrador' ? eliminarCandidato : undefined}
          />
        </div>

        {/* Gráfica de barras - solo admins */}
        {usuario.tipoUsuario === 'administrador' && (
          <div className="col-12 mb-4">
            <ChartVotos candidatos={candidatos} votos={votos} />
          </div>
        )}

        {/* Formulario para agregar candidatos - solo admins */}
        {usuario.tipoUsuario === 'administrador' && (
          <div className="col-md-6 offset-md-3 mb-4">
            <AgregarCandidato
              nuevoCandidato={nuevoCandidato}
              setNuevoCandidato={setNuevoCandidato}
              agregarCandidato={agregarCandidato}
            />
          </div>
        )}

        {/* Historial de votos - solo admins */}
        {usuario.tipoUsuario === 'administrador' && (
          <div className="col-12">
            <HistorialVotos historial={historial} />
          </div>
        )}

        {/* Registro de usuarios (solo admins) */}
        {usuario.tipoUsuario === 'administrador' && (
          <div className="col-md-6 offset-md-3 mb-4">
            <FormularioRegistro soloVotante={false} />
          </div>
        )}
      </div>

      {/* Mensajes y spinner */}
      <MensajeAlert mensaje={mensaje} tipoMensaje={tipoMensaje} />
      {cargando && <Cargando />}
    </div>
  );
}

export default App;
