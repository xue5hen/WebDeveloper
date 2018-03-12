var mongoose=require('mongoose');
var commentsSchema=require('../schemas/comments');

module.exports=mongoose.model('comment',commentsSchema);