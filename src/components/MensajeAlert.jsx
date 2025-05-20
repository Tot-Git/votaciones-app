import React from 'react';

function MensajeAlert({ mensaje, tipoMensaje }) {
  if (!mensaje) return null;

  return (
    <div className={`alert alert-${tipoMensaje} mt-4`} role="alert">
      {mensaje}
    </div>
  );
}

export default MensajeAlert;
