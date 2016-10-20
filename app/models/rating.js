var mongoose= require('mongoose'),
    Schema = mongoose.Schema;

var RatingSchema = new Schema({
    word: String,
    dicNumber: Number,
    partOfSpeech: Number,
    rating: Number,
    number: Number
});


module.exports = mongoose.model('Rating', RatingSchema);