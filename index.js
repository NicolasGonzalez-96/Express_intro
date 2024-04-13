const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware para parsear el body de las solicitudes
app.use(bodyParser.json());

// Ruta GET para devolver la página web
app.get('/home', (req, res) => {
  // Lee el archivo HTML y lo devuelve como respuesta
  fs.readFile('index.html', (err, data) => {
    if (err) {
      res.status(500).send('Error al cargar la página');
      return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.send(data);
  });
});

// Ruta POST para agregar una canción
app.post('/canciones', (req, res) => {
  // Lee el archivo JSON
  fs.readFile('repertorio.json', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo');
      return;
    }
    let repertorio = JSON.parse(data);
    const nuevaCancion = req.body;
    // Asigna el ID consecutivo a la nueva canción
    nuevaCancion.id = repertorio.length + 1;
    repertorio.push(nuevaCancion);

    // Escribe los datos actualizados en el archivo JSON
    fs.writeFile('repertorio.json', JSON.stringify(repertorio), (err) => {
      if (err) {
        res.status(500).send('Error al escribir en el archivo');
        return;
      }
      res.status(201).send('Canción agregada exitosamente');
    });
  });
});

// Ruta GET para obtener todas las canciones
app.get('/canciones', (req, res) => {
  // Lee el archivo JSON y devuelve su contenido como respuesta
  fs.readFile('repertorio.json', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo');
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

// Ruta DELETE para eliminar una canción por su ID
app.delete('/canciones/:id', (req, res) => {
  const id = req.params.id;

  fs.readFile('repertorio.json', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo');
      return;
    }

    let repertorio = JSON.parse(data);
    const index = repertorio.findIndex(cancion => cancion.id === parseInt(id));

    if (index === -1) {
      res.status(404).send('Canción no encontrada');
      return;
    }

    repertorio.splice(index, 1);

    fs.writeFile('repertorio.json', JSON.stringify(repertorio), (err) => {
      if (err) {
        res.status(500).send('Error al escribir en el archivo');
        return;
      }
      res.status(200).send('Canción eliminada exitosamente');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});