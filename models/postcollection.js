var db = require('../db')
var Post = db.model('postcollection', {
  title: { type: String, required: true },
  pos: { 
	lat: {type: Number},
	lon: {type: Number}
  },
  imglink: { type: String},
  rating: { type: Number}
})
module.exports = Post