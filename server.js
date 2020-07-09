const express = require('express');
const app = express()
const mysql = require('mysql');
const fs = require('fs');
const bodyparser = require('body-parser');
app.use(bodyparser.json());


var Totaldata = JSON.parse(fs.readFileSync('imdb.json'));

var con = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"password",
	database:"imdb",
	multipleStatement:true
})

con.connect((err)=>{
	if(err)throw err
	console.log("connected to database!");
})

// 1.end point for inserting all the data into database

app.post('/',(req,res)=>{

	Totaldata.forEach(function (item) {
		var position = item.position;
		var name = item.name;
		var year = item.year;
		var rating = item.rating;
		var url = item.url;
		con.query("insert into data(position,name,year,rating,url) values (?,?,?,?,?)",[position,name,year,rating,url],(err,rows)=>{
			console.log("ok");
		})
	})
	res.send("done!")
})

// 2.end point for getting all the data from table
app.get('/',(req,res)=>{
	con.query("select * from data",(err,rows)=>{
		if(err)throw err
		res.send(rows);
	})
})

// 3.getting specific data from table
app.get('/www.imdb.com/data',(req,res)=>{
	const position = req.query.position;
	con.query("select * from data",(err,rows)=>{
		var Arr = rows;
		Arr.forEach(function(item){
			if(item.position == position){
				res.send(item);
			}
		})
	})
})


// 4. end point for deleting

app.delete('/delete/:position',(req,res)=>{
	 var position = req.params.position;
	 con.query("delete from data where position = ?",[position],(err,rows)=>{
	 	if(err)throw err
	 	res.send("successfully deleted!");
	})
}) 

// 5.end point for updating

app.put('/:position',(req,res)=>{
	var position = req.params.position;
	var number = req.body.position;
	var name = req.body.name;
	var year = req.body.year;
	var rating = req.body.rating;
	var url = req.body.url;

	con.query("update data set position=?,name=?,year=?,rating=?,url=?",[number,name,year,rating,url],(err,rows)=>{
		if(err)throw err
		res.send("successfully updated!!!")
	})
})



app.listen(2000,()=>{
    console.log("Your port is working!");
})