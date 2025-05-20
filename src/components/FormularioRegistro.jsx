// src/components/FormularioRegistro.jsx

import React, { useState, useEffect } from 'react';

function FormularioRegistro({ soloVotante = false, onRegistroExitoso }) {
  // si soloVotante === true, el campo "tipo" estará fijado a "votante"
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [tipo, setTipo] = useState('votante');

  // Si estamos en modo "soloVotante", nos aseguramos de que 'tipo' sea "votante"
  useEffect(() => {
    if (soloVotante) {
      setTipo('votante');
    }
  }, [soloVotante]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usuario.trim() || !correo.trim() || !password.trim()) {
      return alert('Por favor completa todos los campos.');
    }

    // Preparamos el JSON con el campo tipoUsuario:
    const payload = {
      usuario: usuario.trim(),
      correo: correo.trim(),
      contraseña: password,
      tipoUsuario: tipo  // Si soloVotante, tipo === 'votante'
    };

    fetch('http://localhost:3001/registrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.text();
      })
      .then(msg => {
        alert(`Registro exitoso: ${msg}`);
        setUsuario('');
        setCorreo('');
        setPassword('');
        // Si vienen de Login, avisamos al padre para volver a pantalla de login:
        if (onRegistroExitoso) {
          onRegistroExitoso();
        }
      })
      .catch(() => alert('Error al registrar usuario.'));
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <div className="mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Nombre de usuario"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <input
          type="email"
          className="form-control"
          placeholder="Correo electrónico"
          value={correo}
          onChange={e => setCorreo(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <input
          type="password"
          className="form-control"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      {/* Si no es "soloVotante", dejamos ver el selector de tipo; 
          si soloVotante===true, ocultamos el selector y forzamos 'votante' */}
      {!soloVotante && (
        <div className="input-group mb-3">
          <select
            className="form-select"
            value={tipo}
            onChange={e => setTipo(e.target.value)}
          >
            <option value="votante">Votante</option>
            <option value="administrador">Administrador</option>
          </select>
          <button className="btn btn-outline-success" type="submit">
            Registrar
          </button>
        </div>
      )}
      {soloVotante && (
        <div className="mb-3">
          <button className="btn btn-outline-success w-100" type="submit">
            Registrarme como votante
          </button>
        </div>
      )}
    </form>
  );
}

export default FormularioRegistro;
