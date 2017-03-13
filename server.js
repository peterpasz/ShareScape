var express = require('express')
var bodyParser = require('body-parser')
var Post = require('./models/postcollection')

var app = express()
app.use(bodyParser.json())

app.use('/', express.static('public'))

app.get('/api/posts', function (req, res, next) {
  Post.find(function(err, posts) {
    if (err) { return next(err) }
    res.json(posts)
  })
})

app.post('/api/posts', function (req, res, next) {
  var post = new Post({
    title: req.body.title,
    pos: {
		lat: req.body.lat,
		lon: req.body.lon
	},
	rating: req.body.rating
  })
  post.save(function (err, post) {
    if (err) { return next(err) }
    res.json(201, post)
  })
})

app.listen(3000, function () {
  console.log('Server listening on', 3000)
})