var express = require('express')
var bodyParser = require('body-parser')
var Post = require('./models/postcollection')
var port = process.env.PORT || 3000;

var app = express()
app.use(bodyParser.json())

app.use('/', express.static('public'))
app.use('/camera', express.static('public/camera'))
app.use('/camera', express.static('public/mobile.html'))

//Endpoint to retrieve all posts from database
app.get('/api/posts', function (req, res, next) {
  Post.find(function(err, posts) {
    if (err) { return next(err) }
    res.json(posts)
  })
})

//Endpoint to retrieve a single post from database using id
app.get('/api/posts/:post_id', function (req, res, next) {
  Post.findById(req.params.post_id, function(err, post) {
    if (err) { return next(err) }
    res.json(post)
  })
})

//Endpoint to send new post to database
app.post('/api/posts', function (req, res, next) {
  var post = new Post({
    title: req.body.title,
    pos: {
		lat: req.body.pos.lat,
		lon: req.body.pos.lon
    },
    imglink: req.body.imglink,
    rating: req.body.rating
    })
    post.save(function (err, post) {
    if (err) { return next(err) }
    res.json(201, post)
  })
})

//Endpoint to edit post in database
app.put('/api/posts/:post_id', function (req, res, next) {
  Post.findById(req.params.post_id, function(err, post) {
    if (err) { return next(err) }
    post.rating = req.body.rating
    post.save(function(err){
      if(err) res.send(err)
      res.json({newrating:post.rating})
    })
  })
})

app.listen(port, function () {
console.log('Server listening on', port)
})