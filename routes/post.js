const router = require('express').Router();
const auth = require('../middlewares/auth')
const postController = require('../controllers/post')


router.post('/', auth(), postController.create)

router.patch('/:post_id', auth(), postController.edit)

router.get('/', postController.viewAll)

router.get('/:post_id', postController.viewOne)

router.delete('/:post_id', auth(), postController.delete)

module.exports= router;

