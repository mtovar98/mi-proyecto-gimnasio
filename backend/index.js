const express = require ('express');
const sqlite3 = require ('sqlite3').verbose();
const cors = require ('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./gimnasio.db', (err) => {
    if (err) {
        console.error('Error al conectar con las base de datos: ', err);
    } else {
        console.log('Conectado a la base de datos SQLite');
    }
});

// Crear la tabla de clientes si no existe

const createTableQuery = `
CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL CHECK(nombre <> ''),
    cedula TEXT NOT NULL UNIQUE CHECK(cedula <> ''),
    contacto TEXT NOT NULL,
    fecha_pago_inicio TEXT,
    fecha_pago_final TEXT,
    valor_pago REAL,
    descripcion TEXT,
    estado TEXT,
    fecha_ultimo_pago TEXT    
)`;

db.run(createTableQuery, (err) => {
    if (err) {
        console.error('Error al crear la tabla: ', err);
    } else {
        console.log('Tabla de clientes creada o existente');
    }
});

app.get('/clientes', (req, res) => {
  const query = `SELECT * FROM clientes`;

  db.all(query, [], (err, rows) => {
      if (err) {
          console.error("Error al obtener clientes:", err);
          res.status(500).json({ error: "Error al obtener los clientes" });
      } else {
          res.json(rows);
      }
  });
});


// Ruta para obtener cliente por cedula 
app.get('/clientes/:cedula', (req, res) => {
    const cedula = req.params.cedula;
    db.get('SELECT * FROM clientes WHERE cedula = ?', [cedula], (err, row) =>{
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(row);
        }
    });
});

// Ruta para agregar un nuevo cliente

app.post('/clientes', (req, res) => {
  const { nombre, cedula, contacto, fecha_pago_inicio, fecha_pago_final, valor_pago, descripcion, estado, fecha_ultimo_pago } = req.body;

  // Validación: No permitir valores vacíos o nulos en nombre y cédula
  if (!nombre || !cedula || nombre.trim() === '' || cedula.trim() === '') {
      return res.status(400).json({ error: 'El nombre y la cédula son obligatorios' });
  }

  const insertQuery = `
      INSERT INTO clientes (nombre, cedula, contacto, fecha_pago_inicio, fecha_pago_final, valor_pago, descripcion, estado, fecha_ultimo_pago)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(insertQuery, [nombre, cedula, contacto, fecha_pago_inicio, fecha_pago_final, valor_pago, descripcion, estado, fecha_ultimo_pago], function (err) {
      if (err) {
          res.status(500).json({ error: err.message });
      } else {
          res.json({ id: this.lastID });
      }
  });
});


//Ruta para actualizar un cliente
app.put('/clientes/:cedula', (req, res) => {
    const cedula = req.params.cedula;
    const { nombre, contacto, fecha_pago_inicio, fecha_pago_final, valor_pago, descripcion, estado, fecha_ultimo_pago } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    const updateQuery = `
      UPDATE clientes
      SET nombre = ?, contacto = ?, fecha_pago_inicio = ?, fecha_pago_final = ?, valor_pago = ?, descripcion = ?, estado = ?, fecha_ultimo_pago = ?
      WHERE cedula = ?
    `;
    db.run(updateQuery, [nombre, contacto, fecha_pago_inicio, fecha_pago_final, valor_pago, descripcion, estado, fecha_ultimo_pago, cedula], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ updated: this.changes });
      }
    });
  });

  //Ruta para  eliminar un cliente
  app.delete('/clientes/:cedula', (req, res) => {
    const cedula = req.params.cedula;
    db.run('DELETE FROM clientes WHERE cedula = ?', [cedula], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ deleted: this.changes });
      }
    });
  });
  
  app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
  });