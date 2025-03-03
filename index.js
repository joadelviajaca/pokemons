const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 3000;

// Cargar los datos desde el archivo JSON
const rawData = fs.readFileSync("pokemon.json");
let pokemons = JSON.parse(rawData).pokemons;

app.use(express.json());
app.use(cors())
// Obtener todos los Pokémon
app.get("/pokemons", (req, res) => {
  res.json(pokemons);
});

// Obtener un Pokémon por ID
app.get("/pokemons/:id", (req, res) => {
  const pokemon = pokemons.find(p => p.id === parseInt(req.params.id));
  if (pokemon) {
    res.json(pokemon);
  } else {
    res.status(404).json({ message: "Pokémon no encontrado" });
  }
});

// Agregar un nuevo Pokémon
app.post("/pokemons", (req, res) => {
  const { name, type, base } = req.body;
  
  if (!name || !name.english || !type || !Array.isArray(type) || type.length === 0 || !base) {
    return res.status(400).json({ message: "Datos inválidos. Se requiere un nombre en inglés, al menos un tipo y estadísticas base." });
  }
  
  const newId = pokemons.length > 0 ? Math.max(...pokemons.map(p => p.id)) + 1 : 1;
  const newPokemon = { id: newId, name, type, base };
  pokemons.push(newPokemon);
  res.status(201).json(newPokemon);
});

// Actualizar un Pokémon por ID
app.put("/pokemons/:id", (req, res) => {
  const index = pokemons.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    pokemons[index] = { ...pokemons[index], ...req.body };
    res.json(pokemons[index]);
  } else {
    res.status(404).json({ message: "Pokémon no encontrado" });
  }
});

// Eliminar un Pokémon por ID
app.delete("/pokemons/:id", (req, res) => {
  const index = pokemons.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    pokemons.splice(index, 1);
    res.json({ message: "Pokémon eliminado" });
  } else {
    res.status(404).json({ message: "Pokémon no encontrado" });
  }
});

// Buscar Pokémon por texto
app.get("/pokemons/search/:query", (req, res) => {
  const query = req.params.query.toLowerCase();
  const results = pokemons.filter(pokemon => {
    return (
      Object.values(pokemon.name).some(name => name.toLowerCase().includes(query)) ||
      pokemon.type.some(type => type.toLowerCase().includes(query))
    );
  });
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
