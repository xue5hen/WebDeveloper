var mongoose=require('mongoose');
var categoriesSchema=require('../schemas/categories');

module.exports=mongoose.model('category',categoriesSchema);