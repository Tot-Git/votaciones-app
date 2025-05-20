import React from 'react';

function AgregarCandidato({ nuevoCandidato, setNuevoCandidato, agregarCandidato }) {
  return (
    <form onSubmit={agregarCandidato} className="my-4">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Nombre del nuevo candidato"
          value={nuevoCandidato}
          onChange={(e) => setNuevoCandidato(e.target.value)}
          required
        />
        <button className="btn btn-outline-primary" type="submit">
          Agregar
        </button>
      </div>
    </form>
  );
}

export default AgregarCandidato;
