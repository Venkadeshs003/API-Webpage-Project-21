import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ----- ROUTES -----

// Home
app.get("/", (req, res) => {
  res.render("index");
});

// Weather
app.get("/weather", (req, res) => {
  res.render("weather", { weather: null, error: null });
});

app.post("/weather", async (req, res) => {
  const city = req.body.city;
  const apiKey = "f5e4dd8709f206f505204a2f2c941722"; // replace with real key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    res.render("weather", {
      weather: {
        city: data.name,
        temp: data.main.temp,
        desc: data.weather[0].description,
        icon: data.weather[0].icon,
      },
      error: null,
    });
  } catch {
    res.render("weather", { weather: null, error: "City not found" });
  }
});

// Crypto
app.get("/crypto", async (req, res) => {
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: { vs_currency: "usd", order: "market_cap_desc", per_page: 10, page: 1 }
    });
    res.render("crypto", { coins: response.data });
  } catch {
    res.render("crypto", { coins: [] });
  }
});

// Cocktails
app.get("/cocktails", (req, res) => {
  res.render("cocktails", { drinks: [] });
});

app.post("/cocktails", async (req, res) => {
  const drink = req.body.drink;
  try {
    const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`);
    res.render("cocktails", { drinks: response.data.drinks || [] });
  } catch {
    res.render("cocktails", { drinks: [] });
  }
});

// Jokes
app.get("/jokes", async (req, res) => {
  try {
    const response = await axios.get("https://v2.jokeapi.dev/joke/Any?type=single");
    res.render("jokes", { joke: response.data.joke });
  } catch {
    res.render("jokes", { joke: "No joke available 😅" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
