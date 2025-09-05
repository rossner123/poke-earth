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

app.listen(3000, () => {
    console.log("rodando...")
})