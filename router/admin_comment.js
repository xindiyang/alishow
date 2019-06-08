const express = require('express');
const router = express.Router();
router.get('/admin/comment/comments.html',(req,res)=>{
    res.render(rootPath+'/view/admin/comment/comments.html');
});
module.exports = router;