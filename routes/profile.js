const router = require('express').Router();
const auth = require('../middlewares/auth')
const profileControllers = require('../controllers/profile')
router.get('/:user_id', profileControllers.view)

router.patch('/', auth(), profileControllers.edit)

router.delete('/:user_id', profileControllers.delete)

module.exports= router;