const express = require('express');
const fs = require("fs");
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Personal Diary' });
});

/* GET Pages. */
router.get('/page/:page', async function (req, res) {
  let pageName = req.params.page;
  let parameters = {};
  let id;
  if(req.query) {
    parameters = req.query;
    id = req.query.id;
  }
  let p = rootDir + '/views/pages/' + pageName;
  // console.log("P:", p);
  let exist = fs.existsSync(p + ".ejs");
  // console.log("EXIST:", exist);
  if (exist) {
    if (p === 'unauthorized') {
      return res.status(401).render(rootDir + '/views/pages/unauthorized');
    }
    if (!parameters.hasOwnProperty('isUpdate')) parameters['isUpdate'] = false;
    if (id) parameters['isUpdate'] = true;
    // let d = {};
    res.render(p, parameters);
  } else {
    res.render('views/pages/404.ejs');
  }
});

module.exports = router;
