const express = require("express")

const app = express()

app.get("/", (req, res) => { 
    res.send("Admin connection successful")
})

app.listen(3005, () => { 
    console.log('Server successfully run on port 3005')
})