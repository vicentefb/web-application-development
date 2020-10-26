const express = require('express');
const mysql = require('mysql');

const PORT = process.env.PORT || 8081;

const bodyParser = require('body-parser');

const path = require('path');

const app = express();

app.set('view engine', 'ejs'); 

app.use(express.static('public'));

var router = express.Router();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res)=>{
	console.log('inicio')
	res.render('index');
})


app.get('/education', (req, res)=>{
	console.log('education');
	const sql = 'SELECT * FROM educacion'

	// La consulta se manda a traves de este query
	connection.query(sql, function(err, resultado){
		if(err) throw err;
		if(resultado.length === 0){
			res.send('Sin listado');
		}
		res.render('education', {data :resultado});
	})
})

app.get('/profesional', (req, res)=>{
	console.log('profesional');
	const sql = 'SELECT * FROM profesional'

	// La consulta se manda a traves de este query
	connection.query(sql, function(err, resultado){
		if(err) throw err;
		if(resultado.length === 0){
			res.send('Sin listado');
		}
		res.render('profesional', {data :resultado});
	})
})

app.get('/expadicional', (req, res)=>{
	console.log('expadicional');
	const sql = 'SELECT * FROM expadicional'

	// La consulta se manda a traves de este query
	connection.query(sql, function(err, resultado){
		if(err) throw err;
		if(resultado.length === 0){
			res.send('Sin info');
		}
		res.render('expadicional', {data :resultado});
	})
})


// connection to MYSQL

const connection = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: '',
	database: 'curricula'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connectado a BD!");
});


app.listen(PORT, ()=> console.log(`Server running on port${PORT}`))