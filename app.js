const express = require('express');
const cors = require('cors'); // Ajout de CORS
const app = express();

app.use(cors()); // Utilisation de CORS

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
