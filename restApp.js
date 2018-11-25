
/*
simple nodejs application for rest api based on restify and sqlite3
*/

var restify = require('restify')
var server = restify.createServer();

/// map request body to req.body as json
server.use(restify.plugins.bodyParser({ mapParams: true }));

/// allow cross origin 
server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);

var DbServices = require('./dbServices').DbServices;
var dbServices = new DbServices();

// test server
server.get('/test',(req,res)=>{
	res.send({status:'ok'});
});

// register
server.post('/register',(req,res)=>{
	var body = req.body;

	if(body.firstName && body.lastName && body.address && body.phoneNumber && body.password){
		dbServices.register(body,function(status,reason){
			if(status){
				res.send({status:'ok'});
			}else{
				res.send({status:'error',message:reason});
			}
		});		
	}else{
		res.send({status:"error",message:"some input field are missing."});
	}
});

// login
server.post('/login',(req,res)=>{
	var body = req.body;
	if(body.userId && body.password){
		dbServices.login(body,(data,err)=>{
			if(err===null || err===undefined){
				if(data===undefined){
					res.send({status:'error',message:'invalid credentials'});	
				}else{
					
					res.send({status:'ok',data:data});
				}	
			}else{
				res.send({status:'error',message:err})
		}});
	}else{
		res.send({status:"error",message:"some input field are missing."});
	}
});


// get complains users
server.get('/complains/:userId',(req,res)=>{
	var userId =req.params.userId;
	dbServices.getComplains(userId,(rows,err)=>{
			res.send({status:'ok',data:rows});
	});
});

// get all complains admin
server.get('/complains',(req,res)=>{
	var userId = null;
	dbServices.getComplains(userId,(rows,err)=>{
			res.send({status:'ok',data:rows});
	});
});

// register complain
server.post('/complains',(req,res)=>{
	var complainRequest = req.body;
	if(complainRequest.userId && complainRequest.title && complainRequest.detail){

	dbServices.saveComplain(complainRequest,(status,error)=>{
		console.log('saveComplain',status,error)
		if(status) {
			res.send({status:'ok'});
		}
		else{
			res.send({status:'error',message:error});
		}
	});
	}else{
		res.send({status:"error",message:"some input field are missing."});
	}
});

server.listen(3005,()=>{
console.log('server: %s url: %s',server.name,server.url);
});

