/*
In this app, a user can login by their email, and that email will be used for Session tracking. 
nce user logs out, Session will be destroyed and user will be redirected to home page
*/

var express		=	require('express');
var session		=	require('express-session');
var bodyParser  = 	require('body-parser');
var app			=	express();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

//initialize the session
//Here, ‘secret‘ is used for cookie handling etc 
//but we have to put some secret for managing Session in Express
app.use(session({
	secret: 'ssshhhhh',
	saveUninitialized: true,
	resave: true
}));

app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));



var sess;
app.get('/',function(req,res){
	//using ‘request‘ variable you can assign session to any variable
	sess=req.session;
	//if logged in, redirect to admin page; else render index page
	if(sess.email)
	{
		res.redirect('/admin');
	}
	else{
	res.render('index.html');
	}
});

//In this we are assigning email to sess.email variable.
//email comes from HTML page.
app.post('/login',function(req,res){
	sess=req.session;	
	sess.email=req.body.email;
	res.end('done');
});

//if logged in, go to admin page and render the email stored in the session;
//else, prompt user to login
app.get('/admin',function(req,res){
	sess=req.session;
	if(sess.email)	
	{
		res.write('<h1>Hello '+sess.email+'</h1><br>');
		res.end('<a href='+'/logout'+'>Logout</a>');
	}
	else
	{
		res.write('<h1>Please login first.</h1>');
		res.end('<a href='+'/'+'>Login</a>');
	}

});

//if user logs out, redirect back to home (index) page
app.get('/logout',function(req,res){
	
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}
		else
		{
			res.redirect('/');
		}
	});

});
app.listen(3000,function(){
	console.log("App started on localhost:3000");
});