var sqlite3 = require('sqlite3')
let db = new sqlite3.Database('./sample.db');

let DbServices = function(){
	this.login =function(loginObject,callback){
		var sql='SELECT * FROM user where phoneNumber=? and password=?';
		db.get(sql,[loginObject.userId,loginObject.password],(err,row)=>{
			if(callback) callback(row,err);
		});
	}
	
	this.register = function(registrationObject,callback){

		var sql = 'INSERT INTO user (firstName,lastName,address,phoneNumber,password,email) VALUES (?,?,?,?,?,?)'
		db.run(sql,[registrationObject.firstName,registrationObject.lastName,registrationObject.address,
		registrationObject.phoneNumber,registrationObject.password,registrationObject.email],(err)=>{
			if(callback) callback(err === null,err);		
		});
	}

	this.getComplains = function(userId,callback){
		// select all records when userId = null
		var sql = 'SELECT user.userId,complain.* FROM user INNER JOIN complain '+
				   'ON user.userId = complain.userId WHERE (user.userId = ? and ? is not null) or (? is null);';

			db.all(sql,[userId,userId,userId],(err,rows)=>{
				if(callback) callback(rows,err);
	});};
	
	this.saveComplain = function(complainObject,callback){
		var sql = 'INSERT INTO complain (title,detail,userId) VALUES (?,?,?);'
		db.run(sql,[complainObject.title,complainObject.detail,complainObject.userId],(err)=>{
			if(callback) callback(err===null,err);
		}) 
	}
};
exports.DbServices = DbServices;