const express = require("express")

require("dotenv").config()

const { PORT} = process.env

const app = express()

app.get("/", (req, res) => { 
    res.send("Admin connection successful")
})

app.listen(PORT, () => { 
    console.log(`Server successfully run on port ${PORT}`)
})