
	
module.exports = function(app) {
	
	app.get("/", function (req, res, next) {
		if(req.session.username){
			res.render('index');
			//res.sendfile('views/index.html')
		}
		else{
			res.render('index');	
			//res.sendfile('views/index.html')
		}
	});
	
	app.get("/operation", function (req, res, next) {
		if(req.session.username){
			res.render('operation');
			//res.sendfile('views/index.html')
		}
		else{
			res.render('operation');	
			//res.sendfile('views/index.html')
		}
	});
};