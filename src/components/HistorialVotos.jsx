import React from 'react';

function HistorialVotos({ historial }) {
  if (!historial.length) {
    return <p className="mt-4">No hay historial de votos disponible.</p>;
  }

  return (
    <>
      <h2 className="mt-5">Historial de Votos</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Candidato</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((voto, index) => (
              <tr key={voto.id}>
                <td>{index + 1}</td>
                <td>{voto.candidato}</td>
                <td>{new Date(voto.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default HistorialVotos;
