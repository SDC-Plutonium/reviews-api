// require('newrelic');
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { testGet,getReviews, getMetaData, createNewPost, incrementHelpful, reportReview, testMeta } = require('./db');

const app = express();
app.use(express.json());
app.use(cors(({ origin: '*', methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'] })));

// get /reviews/
// params - page default 1, count - default 5, sort, product_id
// response 200 ok
app.get('/reviews', (req, res) => {
  let page = req.query.page || 1;
  let count = req.query.count || 5;
  let sort = req.query.sort || 'relevant';
  let product_id = req.query.product_id || null;
  if (product_id === null) {
    res.status(422).send('invalid product_id provided');
  }

  let reviewParams = {product_id: product_id, page: page, sort: sort, count: count};
  if (product_id !== null) {
    getReviews(reviewParams, (err, result) => {
      if (err) {
        res.status(422).send(err);
      } else {
        // manipulate result further from here based on query params
        for(let i = 0; i < result.length; i++) {
          let tempDate = new Date(Number(result[i].date))
          result[i].date = tempDate;
          if (result[i].response === 'null') {
            result[i].response = null;
          }
          if (result[i].reported === true) {
            result.splice(i, 1);
          }
        }
        //for pagination slice by count, and some math to get a certain page based on that count
        let clientObject = {product: product_id, page: page, count: count, results: result}
        res.status(200).send(clientObject);
      }
    })
  }
})

// get /reviews/meta
// params - product_id
// response 200 ok
app.get('/reviews/meta', (req, res) => {
  getMetaData(req.query.product_id, (err, result) => {
    if (err) {
      res.status(422).send(err);
    } else {
      res.status(200).send(result);
    }
  })
})

// post /reviews
// response 201 created
app.post('/reviews', (req, res) => {
  createNewPost(req.query, (err, result) => {
    if (err) {
      res.status(422).send(err);
    } else {
      res.status(200).send(result);
    }
  })
})

// put reviews/:review_id/helpful
// incrememet helpful
// response 204 no content
app.put('/reviews/:review_id/helpful', (req, res) => {
  incrementHelpful(req.params.review_id, (err, result) => {
    if (err) {
      res.status(422).send(err);
    } else {
      res.status(200).send(result);
    }
  })
})

// put /reviews/:review_id/report
// change reported to true
// response 204 no content
app.put('/reviews/:review_id/report', (req, res) => {
  reportReview(req.params.review_id, (err, result) => {
    if (err) {
      res.status(422).send(err);
    } else {
      res.status(200).send(result);
    }
  })
})

app.get('/test', (req, res) => {

  let page = req.query.page || 1;
  let count = req.query.count || 5;
  let sort = req.query.sort || 'relevant';
  let product_id = req.query.product_id || null;
  if (product_id === null) {
    res.status(422).send('invalid product_id provided');
  }

  if (product_id !== null) {
    testGet(req.query.product_id, (err, result) => {
      if (err) {
        res.status(422).send(err);
      } else {


        for(let i = 0; i < result.length; i++) {
          let tempDate = new Date(Number(result[i].date))
          result[i].date = tempDate;
          if (result[i].response === 'null') {
            result[i].response = null;
          }
          if (result[i].reported === true) {
            result.splice(i, 1);
          }
        }

        let clientObject = {product: product_id, page: page, count: count, results: result}
        res.status(200).send(clientObject);
      }
    })
  }
})

app.get('/test/meta', (req, res) => {
  testMeta(req.query.product_id, (err, result) => {
    if (err) {
      res.status(422).send(err);
    } else {
      res.status(200).send(result);
    }
  })
})

app.get('/loaderio-f9552be34f7ac793b3639829ecff85dd', (req, res) => res.sendFile(__dirname, './loaderio-f9552be34f7ac793b3639829ecff85dd.txt'))


const port = 3030;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
