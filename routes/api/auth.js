const express = require("express")

const router = express.Router()

router.post("/login", (req, res) => { 
    res.status(200).json({message: "success"})
})

router.post("/logout", (req, res) => { 
    res.status(204).end()
})

module.exports = router