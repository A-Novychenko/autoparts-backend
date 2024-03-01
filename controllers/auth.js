const login = async (req, res) => { 
    
   res.json({message: "success"})
}

const logout = async (req, res) => { 
    res.status(204).end()
}

module.exports = {login, logout}