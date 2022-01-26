var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser());
app.use(cors())
const MongoClient = require('mongodb').MongoClient;

let db;
MongoClient.connect('mongodb+srv://Gurpreet122p:Qwerty122p@cluster0.v6tbm.mongodb.net/CW2?retryWrites=true&w=majority', (err, client) => {
    db = client.db('CW2')

})


/*
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Gurpreet122p:<Qwerty122p>@cluster0.v6tbm.mongodb.net/CW2?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("CW2").collection("Lessons");
    // perform actions on the collection object
    console.log(collection)
    client.close();
});
*/

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    console.log(req.collection)
    return next()
})

app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}, {
        limit: 15,
        sort: [
            ['price', -1]
        ]
    }).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})
/*
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e)  {
            return next(e)
        }
        res.send(results)
    })
});
*/
    app.get("/random/:min/:max", function(req, res) { // take two parameters
        var min = parseInt(req.params.min);
        var max = parseInt(req.params.max);
        // return an error if either is not a number
        if (isNaN(min) || isNaN(max)) {
            res.status(400);
            res.json({ error: "Bad request." });
            return;
        }
        // calculate and send back the result
        var result = Math.round((Math.random() * (max - min)) + min);
            res.json({ result: result });
        });
        app.get("/", function(req, res) {
            res.send("youjustsentaGETrequest,friend");
        });
        app.post('/collection/:collectionName', (req, res, next) => {
            req.collection.insert(req.body, (e, results) => {
                if (e) {
                    return next(e)
                }
                res.send(results.ops)
            })
    })

    app.post("/", function(req, res) {
        res.send("aPOSTrequest?nice");
    });
    app.put("/", function(req, res) {
        res.send("idon’tseealotofPUTrequestsanymore");
    });
    app.delete("/", function(req, res) {
        res.send("ohmy,aDELETE??");
    });

    const ObjectID = require('mongodb').ObjectID;
    app.get('/collection/:collectionName/:id', (req, res, next) => {
        req.collection.findOne({
            _id: new ObjectID(req.params.id)
        }, (e, result) => {
            if (e) {
                return next(e)
            }
            res.send(result)
        })
    })


    app.put('/collection/:collectionName/:id', (req, res, next) => {
        req.collection.update({
            _id: new ObjectID(req.params.id)
        }, {
            $set: req.body
        }, {
            safe: true,
            multi: false
        }, (e, result) => {
           // console.log(result.matchedCount)
            if (e) {
                return next(e)
            }
            res.send((result.matchedCount === 1) ? {
                msg: 'success'
            } : {
                msg: 'error'
            })
        })
    })

    app.delete('/collection/:collectionName/:id', (req, res, next) => {
        req.collection.deleteOne({
            _id: ObjectID(req.params.id)
        }, (e, result) => {
            console.log(result)
            if (e) {
                return next(e)
            }
            res.send((result.deletedCount === 1) ? {
                msg: 'success'
            } : {
                msg: 'error'
            })
        })
    })


    const port = process.env.PORT || 3000;
    app.listen(port)

    /*
    app.listen(3000, function() {
        console.log("Random number API started on port 3000");
        });
*/