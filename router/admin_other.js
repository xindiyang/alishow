const express = require('express');
const router = express.Router();
router.get('/admin/other/slides.html',(req,res)=>{
    res.render(rootPath+'/view/admin/other/slides.html');
});
module.exports = router;