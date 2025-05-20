// src/components/Login.jsx

import React, { useState } from 'react';
import FormularioRegistro from './FormularioRegistro';

function Login({ onLogin }) {
  // Cuando modoRegistro===true, mostramos <FormularioRegistro soloVotante />
  const [modoRegistro, setModoRegistro] = useState(false);

  // --- Estados para login ---
  const [usuarioLogin, setUsuarioLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [errorLogin, setErrorLogin] = useState('');

  // Handler para login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorLogin('');

    if (!usuarioLogin.trim() || !passwordLogin.trim()) {
      setErrorLogin('Por favor completa todos los campos.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: usuarioLogin.trim(),
          contraseña: passwordLogin
        })
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      const user = await res.json();
      localStorage.setItem('usuario', JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      console.error('Error en login:', err);
      setErrorLogin(err.message || 'Credenciales incorrectas.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      {modoRegistro ? (
        <>
          <h2 className="mb-4 text-center">Registro de Votante</h2>
          <FormularioRegistro
            soloVotante={true}
            onRegistroExitoso={() => {
              // Una vez registrado, volvemos a pantalla de login:
              setModoRegistro(false);
              setErrorLogin('');
              setUsuarioLogin('');
              setPasswordLogin('');
            }}
          />
          <div className="text-center mt-3">
            <button
              className="btn btn-link"
              onClick={() => setModoRegistro(false)}
            >
              Volver al Inicio de Sesión
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="mb-4 text-center">Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            {errorLogin && <div className="alert alert-danger">{errorLogin}</div>}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Usuario"
                value={usuarioLogin}
                onChange={(e) => setUsuarioLogin(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                value={passwordLogin}
                onChange={(e) => setPasswordLogin(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Entrar
            </button>
          </form>
          <div className="text-center mt-3">
            <span>¿No tienes cuenta? </span>
            <button
              className="btn btn-link"
              onClick={() => {
                setModoRegistro(true);
                setErrorLogin('');
              }}
            >
              Regístrate
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Login;
