var express = require('express')
var bodyParser = require('body-parser')
var Post = require('./models/postcollection')
var port = process.env.PORT || 3000;

var app = express()
app.use(bodyParser.json())

app.use('/', express.static('public'))
app.use('/camera', express.static('public/camera'))

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

app.listen(port, function () {
console.log('Server listening on', port)
})