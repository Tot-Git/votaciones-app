const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const db = mysql.createConnection({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Login
app.post('/login', (req, res) => {
  const { usuario, contraseña } = req.body;
  if (!usuario || !contraseña) {
    return res.status(400).send('Faltan datos');
  }

  const query = 'SELECT * FROM usuarios WHERE usuario = ?';
  db.query(query, [usuario], async (err, results) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).send('Error interno del servidor');
    }
    if (results.length === 0) {
      return res.status(401).send('Usuario no encontrado');
    }

    const user = results[0];
    const esValida = await bcrypt.compare(contraseña, user.contraseña);
    if (!esValida) {
      return res.status(401).send('Contraseña incorrecta');
    }

    // Devuelve solo los campos necesarios
    res.json({
      usuario: user.usuario,
      correo: user.correo,
      tipoUsuario: user.tipoUsuario
    });
  });
});

// Votar: insertar un nuevo voto
app.post('/votar', (req, res) => {
  const { candidatoId } = req.body;
  const query = 'INSERT INTO votos (candidato_id) VALUES (?)';
  db.query(query, [candidatoId], (err) => {
    if (err) {
      console.error('Error al registrar el voto:', err);
      return res.status(500).send('Error al registrar el voto');
    }
    res.send('Voto registrado correctamente');
  });
});

// Obtener el total de votos agrupados
app.get('/votos', (req, res) => {
  const query = `
    SELECT c.id, c.nombre AS candidato, COUNT(v.id) AS votos
    FROM candidatos c
    LEFT JOIN votos v ON c.id = v.candidato_id
    GROUP BY c.id, c.nombre
    ORDER BY c.id;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener votos:', err);
      return res.status(500).send('Error al obtener votos');
    }
    res.json(results);
  });
});

// Obtener historial completo
app.get('/historial', (req, res) => {
  const query = `
    SELECT v.id, c.nombre AS candidato, v.fecha 
    FROM votos v
    JOIN candidatos c ON v.candidato_id = c.id
    ORDER BY v.fecha DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener historial:', err);
      return res.status(500).send('Error en servidor');
    }
    res.json(results);
  });
});

// Obtener lista de candidatos
app.get('/candidatos', (req, res) => {
  db.query('SELECT * FROM candidatos', (err, results) => {
    if (err) {
      console.error('Error al obtener candidatos:', err);
      return res.status(500).send('Error al obtener candidatos');
    }
    res.json(results);
  });
});

// Agregar candidato
app.post('/candidatos', (req, res) => {
  const { nombre } = req.body;
  const query = 'INSERT INTO candidatos (nombre) VALUES (?)';
  db.query(query, [nombre], (err) => {
    if (err) {
      console.error('Error al agregar candidato:', err);
      return res.status(500).send('Error al agregar candidato');
    }
    res.send('Candidato agregado correctamente');
  });
});

// Eliminar candidato (primero borrar votos asociados, luego el candidato)
app.delete('/candidatos/:id', (req, res) => {
  const { id } = req.params;

  // 1) Borrar votos asociados a este candidato
  const borrarVotos = 'DELETE FROM votos WHERE candidato_id = ?';
  db.query(borrarVotos, [id], (err1) => {
    if (err1) {
      console.error('Error al borrar votos asociados:', err1);
      return res.status(500).send('Error al eliminar votos asociados');
    }

    // 2) Luego borrar el candidato
    const borrarCandidato = 'DELETE FROM candidatos WHERE id = ?';
    db.query(borrarCandidato, [id], (err2) => {
      if (err2) {
        console.error('Error al eliminar candidato:', err2);
        return res.status(500).send('Error al eliminar candidato');
      }
      return res.send('Candidato eliminado correctamente');
    });
  });
});

// Registrar usuario (sin lógica de administrador)
app.post('/registrar', async (req, res) => {
  const { usuario, correo, contraseña, tipoUsuario } = req.body;

  if (!usuario || !correo || !contraseña || !tipoUsuario) {
    return res.status(400).send('Datos incompletos');
  }

  try {
    // Encriptar la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const query = 'INSERT INTO usuarios (usuario, correo, contraseña, tipoUsuario) VALUES (?, ?, ?, ?)';
    db.query(query, [usuario, correo, hashedPassword, tipoUsuario], (err) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).send('Error interno del servidor');
      }
      res.send('Usuario registrado con éxito');
    });
  } catch (err) {
    console.error('Error en el registro:', err);
    res.status(500).send('Error al procesar la contraseña');
  }
});

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
