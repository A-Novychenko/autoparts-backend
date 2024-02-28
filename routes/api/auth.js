const express = require("express")

const router = express.Router()

router.post("/login", async (req, res) => { 
    res.json({message: "success"})
})

router.post("/logout", async (req, res) => { 
    res.status(204).end()
})

module.exports = router