const express = require('express')
const https = require('https')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

dotenv.config()

const port = process.env.PORT || 3000
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
        try {
            if (!req.body.location && !req.query.location) {
                return res.status(400).send({ "msg": "Location not entered!" })
            }
            let location
            if(req.body.location){
                location = req.body.location
            }else{
                location = req.query.location
            }
            const api_key = process.env.API_KEY
            const api = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&APPID=" + api_key

            https.get(api, (response) => {
                if(response.statusCode != 200){
                    return res.status(404).send({"msg": "City not found!"})
                }
                response.on('data', (data)=>{
                    const data_json = JSON.parse(data)
                    const weather_data = data_json.weather[0]
                    const temp_data = data_json.main
                    return res.status(200).send({climate: weather_data.main, descriptioin: weather_data.description, temperature: temp_data.temp, feels_like: temp_data.feels_like, place: data_json.name, country: data_json.sys.country})
                })
            })
        } catch (e) {
            console.log("error:", e)
            return res.status(400).send({ "msg": "error encountered!" })
        }
    })

app.listen(port, ()=>{
    console.log("Server on port " + port)
})
