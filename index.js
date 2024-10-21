const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Conectar a MySQL
const sequelize = new Sequelize(process.env.MYSQL_URI);

sequelize.authenticate()
  .then(() => console.log('Conectado a MySQL'))
  .catch(err => console.error('Error al conectar a MySQL', err));

// Definir modelo de Usuario
const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Sincronizar el modelo con la base de datos
sequelize.sync();

// Rutas CRUD

// Crear un nuevo usuario (POST)
app.post('/usuarios', async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el usuario', error });
  }
});

// Obtener todos los usuarios (GET)
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los usuarios', error });
  }
});

// Obtener un usuario por ID (GET)
app.get('/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el usuario', error });
  }
});

// Actualizar un usuario por ID (PUT)
app.put('/usuarios/:id', async (req, res) => {
  try {
    const [updated] = await Usuario.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    const updatedUsuario = await Usuario.findByPk(req.params.id);
    res.json(updatedUsuario);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el usuario', error });
  }
});

// Eliminar un usuario por ID (DELETE)
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const deleted = await Usuario.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el usuario', error });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});

