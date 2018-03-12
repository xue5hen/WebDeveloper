var mongoose=require('mongoose');
var usersSchema=require('../schemas/users');

module.exports=mongoose.model('user',usersSchema);