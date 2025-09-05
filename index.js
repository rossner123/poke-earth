import express from "express"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))

const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY

app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.get("/clima/:lat/:lon", async (req, res) => {
    const lat = req.params.lat
    const lon = req.params.lon
    try {
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric&lang=pt_br`)
        res.json(result.data)

    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
})

function tiposDoClima(clima) {
    let tipos = [];

    switch (clima) {
        case "Clear":
            tipos = ["fire", "grass"];
            break;
        case "Clouds":
            tipos = ["normal", "fairy"];
            break;
        case "Rain":
            tipos = ["water", "electric"];
            break;
        case "Drizzle":
            tipos = ["water"];
            break;
        case "Thunderstorm":
            tipos = ["electric", "dark"];
            break;
        case "Snow":
            tipos = ["ice"];
            break;
        case "Mist":
        case "Fog":
        case "Haze":
            tipos = ["ghost", "psychic"];
            break;
        case "Smoke":
        case "Ash":
            tipos = ["fire", "rock"];
            break;
        case "Dust":
        case "Sand":
            tipos = ["ground", "rock"];
            break;
        case "Squall":
            tipos = ["flying", "electric"];
            break;
        case "Tornado":
            tipos = ["flying", "dragon"];
            break;
        default:
            tipos = ["normal"];
    }

    return tipos;
}

app.get("/pokemon/:clima", async (req, res) => {
    const clima = req.params.clima
    let tipos = tiposDoClima(clima)

      const indice = Math.floor(Math.random() * tipos.length)

    try {
        const result = await axios.get(`https://pokeapi.co/api/v2/type/${tipos[indice]}`);
        const pokemons = result.data.pokemon.slice(0, 20);

        const pokemonsComImagem = await Promise.all(
            pokemons.map(async (p) => {
                const res = await axios.get(p.pokemon.url);
                return {
                    name: res.data.name,
                    image: res.data.sprites.front_default
                };
            })
        );

        res.json(pokemonsComImagem);

    } catch (error) {
        console.log(error.message)
    }
})


app.listen(3000, () => {
    console.log("rodando...")
})