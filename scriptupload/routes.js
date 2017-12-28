const util = require('util');
const fs = require('fs');

const logfile = '/opt/spigot/scriptupload/upload.log';
const scriptpath = '/opt/spigot/scriptcraft/plugins/scriptupload';

module.exports = function(app){

  app.get('/scriptupload', function(req, res){
    var scriptname = req.query.scriptname;
    var scriptbody = 'non';

    if (typeof scriptname == undefined) {
      scriptname = 'filename';
      scriptbody = 'JavaScript';
    } else {
      var scriptfile = scriptpath + '/' + scriptname;
      scriptbody = fs.readFileSync(scriptfile, 'utf8');
    }

    res.render('scriptupload', {
      msg: 'welcome!',
      scriptname: scriptname,
      scriptbody: scriptbody
    });
  });

  app.get('/scriptlist', function(req, res){
    var sl = [];

    fs.readdirSync(scriptpath).forEach(file => {
      sl.push(file);
    });

    res.render('scriptlist', {
      msg: 'list of current scripts; click on a filename to load it for editing',
      scriptlist: sl
    });
  });

  app.post('/scriptupload', function(req, res){
    var scriptname = req.body.scriptname;

    if (! scriptname.match(/\.js$/)) {
      scriptname = scriptname + '.js';
    }

    var scriptfile = scriptpath + '/' + scriptname;

    fs.writeFileSync(scriptfile, req.body.scriptbody, {flag: 'w'});

    res.render('scriptupload', {
      msg: 'upload complete!  remember to "/js refresh()"',
      scriptname: scriptname,
      scriptbody: req.body.scriptbody
    });
  });

  app.get('/*', function(req, res){
    res.status(404).render('404');
  });
};
