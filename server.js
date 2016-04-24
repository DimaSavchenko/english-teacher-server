var express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser =  require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    Rating = require('./app/models/rating'),
    port = Number(process.env.PORT || 8080);

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
        Rating.find({word: req.body.word}, function(error, doc){
            if(doc.length == 0) {
                var newRating = new Rating();
                newRating.word = req.body.word;
                newRating.rating = req.body.rating;
                newRating.number = 1;
                newRating.save(function(error) {
                    if (error) {
                        res.send(500, error);
                    }

                    res.json({message: 'added new word'});
                });
            }else {
                var updateRating = doc[0];

                updateRating.rating = (updateRating.rating * updateRating.number + Number(req.body.rating))/ (updateRating.number + 1);
                updateRating.number += 1;

                updateRating.save(function(error) {
                    if (error) {
                        res.send(500, error);
                    }

                    res.json({message: 'word updated' });
                });
            }
        });
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
        Rating.remove({} , function(error) {
            if (error) {
                res.send(500, error);
            }
            res.json({message: 'deleted all document'});
        });
    });

app.use('/', router);

app.listen(port, function(error) {
    console.log('connect to app');
    if(error) {
        console.log(error);
    }
});

