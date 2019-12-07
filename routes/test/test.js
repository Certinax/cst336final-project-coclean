const express = require('express');
const router = express.Router();

function route(hbsPath, callback = null) {
	return (req, res, next) => {
		if (!callback)
			res.render(hbsPath, {title: 'API Test'});
		else {
			callback(req.body);
		}
	}
}

router.get('/', route('page/test'));

// User:
router.get('/user', route('page/test/user/getAll'));
router.get('/user/id', route('page/test/user/getSpecific'));
router.get('/user/create', route('page/test/user/create'));
router.get('/user/update', route('page/test/user/update'));
router.get('/user/delete', route('page/test/user/delete'));

// Collective:
router.get('/collective', route('page/test/collective/getAll'));
router.get('/collective/id', route('page/test/collective/getSpecific'));

module.exports = router;