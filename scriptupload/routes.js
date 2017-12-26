const util = require('util');
const fs = require('fs');

const logfile = '/opt/spigot/scriptupload/upload.log';

module.exports = function(app){

  app.get('/scriptupload', function(req, res){
    res.render('scriptupload', {
      msg: 'welcome!',
      scriptname: 'filename',
      scriptbody: 'JavaScript'
    });
  });

  app.post('/scriptupload', function(req, res){
    var scriptfile = '/opt/spigot/scriptcraft/plugins/scriptupload';
    scriptfile = scriptfile + '/' + req.body.scriptname;

    fs.writeFileSync(scriptfile, req.body.scriptbody, {flag: 'w'});

    res.render('scriptupload', {
      msg: 'upload complete!  remember to "/js refresh()"',
      scriptname: req.body.scriptname,
      scriptbody: req.body.scriptbody
    });
  });

  app.get('/*', function(req, res){
    res.status(404).render('404');
  });
};
