const express = require('express')
const app = express();
const shortid = require('shortid')
const PORT = 8000
const mongoose = require('mongoose')
const { v4 } = require('uuid')


require('dotenv').config()


 const DB_US = process.env.DB_US
 const DB_PW = process.env.DB_PW

const dbURI = `mongodb+srv://${ DB_US }:${ DB_PW }@cluster0.6fwzt.mongodb.net/url?retryWrites=true&w=majority`
const urlDoc = require('./models/urlDoc')
const urlTemplate = 'localhost:8000/'



//setting view engine
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))


//Connecting to the mongoDB
//Setting up the server when connected
mongoose.connect(dbURI, {  useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(PORT, () => {
			console.log('LISTNING !')
		})
	})
	.catch(err => {
		console.log(err)
	}) 


app.get('/', (req, res) => {
	res.render('urlFrontEnd', { newLink: null, originalLink: null })
})


app.get('/generate', (req, res) => {
	const url = req.query.link
	urlDoc.findOne({ url })
		.then((documentObject) => {
			if(documentObject) {
				console.log('FOUND :- ', documentObject);
				res.render('urlFrontEnd', { newLink: documentObject.shorturl, originalLink: documentObject.url })
			}else {
				const id = shortid.generate()
				const shorturl = urlTemplate + id
				const newURL = new urlDoc({ url, shorturl })

				newURL.save()
			 	 	.then((documentObject) => {
					 	res.render('urlFrontEnd', { newLink: documentObject.shorturl, originalLink: documentObject.url })
					 	console.log(documentObject) 
			 	 	})
			 	 	.catch(err => {
			 	 		console.log(err)
			 	 	})
			}
		})
		.catch(err => {
			console.log(err)
		}) 
})


app.get('/:id', (req, res) => {
	const id = req.params.id
	const shorturl = urlTemplate + id
	urlDoc.findOne( { shorturl } )
		.then((documentObject) => {
			res.redirect(documentObject.url)
		})
		.catch(err => {
			console.log(err)
		})
})