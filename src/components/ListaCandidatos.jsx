import React from 'react';

function ListaCandidatos({ candidatos, votos, votar, cargando, eliminarCandidato }) {
  if (candidatos.length === 0) {
    return <p className="mt-4">No hay candidatos disponibles.</p>;
  }

  return (
    <div className="row">
      {candidatos.map((candidato) => (
        <div className="col-md-4" key={candidato.id}>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4>{candidato.nombre}</h4>
              <p>Votos: {votos[candidato.id] || 0}</p>
              <button
                className="btn btn-primary"
                onClick={() => votar(candidato.id)}
                disabled={cargando}
              >
                Votar por {candidato.nombre}
              </button>
              {eliminarCandidato && (
                <button
                  className="btn btn-outline-danger"
                  onClick={() => eliminarCandidato(candidato.id)}
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListaCandidatos;
