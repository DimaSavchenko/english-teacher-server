var express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser =  require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    Rating = require('./app/models/rating'),
    port = Number(process.env.PORT || 8000);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect('mongodb://dimaSavchenko:123@ds047468.mlab.com:47468/heroku_1jr2bppx', function(error){
    console.log('connect to mongo');
    if(error) {
        console.log(error);
    }
});

router.use(function(req, res, next) {
    console.log('use api');
    next();
});

router.get('/', function(req, res) {
    res.json({message: 'It is get request'});
});

router.route('/rating')
    .post(function(req, res) {
        req.body.forEach(function(ratingReq){
            var query = {
                word: ratingReq.word,
                partOfSpeech: ratingReq.partOfSpeech
            };

            Rating.findOne(query, function(error, doc){
                if(doc == null) {
                    var newRating = new Rating();

                    newRating.word = ratingReq.word;
                    newRating.dicNumber = ratingReq.dicNumber;
                    newRating.partOfSpeech = ratingReq.partOfSpeech;
                    newRating.rating = ratingReq.rating;
                    newRating.number = 1;

                    newRating.save(function(error) {
                        if (error) {
                            res.send(500, error);
                        }
                    });
                }else {
                    var updateRating = doc;

                    updateRating.rating = (updateRating.rating * updateRating.number + Number(ratingReq.rating))/ (updateRating.number + 1);
                    updateRating.number += 1;

                    updateRating.save(function(error) {
                        if (error) {
                            res.send(500, error);
                        }
                    });
                }
            });
        });

        res.json({message: 'ratings updated'});
    })
    .get(function(req, res) {
        Rating.find(function(err, doc) {
            if (err) {
                res.send(500, err);
            }
            res.json(doc);
        });
    })
    .delete(function (req, res) {
        Rating.remove({} , function(err) {
            if (err) {
                res.send(500, err);
            }
            res.json({message: 'deleted all document'});
        });
    });

router.route('/ratingToCSV')
    .get(function (req, res) {
       Rating.find({number: {$gt: 100}}, {'_id': 0, 'number': 0, '__v': 0}, function (err, doc) {
           if (err) {
               res.send(500, err);
           }

           var docToCSV = JSON.stringify(doc).replace(/},{/g, ';');
           docToCSV = docToCSV.replace(/\[{/, '');
           docToCSV = docToCSV.replace(/}\]/, ';');

           res.json(docToCSV);
       });
    });

app.use('/', router);

app.listen(port, function(error) {
    console.log('connect to app');
    if(error) {
        console.log(error);
    }
});

