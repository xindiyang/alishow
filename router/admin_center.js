const express = require('express');
const router = express.Router();
router.get('/admin/center/password-reset.html', (req, res) => {
    res.render(rootPath + '/view/admin/center/password-reset.html');
});
router.get('/admin/center/profile.html', (req, res) => {
    res.render(rootPath + '/view/admin/center/profile.html');
});
module.exports = router;