const router = require('express').Router()

router.get('/logout', (req, res) => {
    req.logout();
    res.render('index')
}) 

module.exports = router