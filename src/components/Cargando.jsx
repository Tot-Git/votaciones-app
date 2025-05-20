import React from 'react';

function Cargando() {
  return (
    <div className="my-3">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p className="mt-2">Procesando solicitud...</p>
    </div>
  );
}

export default Cargando;
