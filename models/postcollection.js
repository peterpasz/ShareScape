var db = require('../db')
var Post = db.model('postcollection', {
  title: { type: String, required: true },
  pos: { 
	lat: {type: Number, required: true},
	lon: {type: Number, required: true}
  },
  rating: { type: Number, required: true}
})
module.exports = Post