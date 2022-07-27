const express = require('express');
require('dotenv').config();
const { getReviews, getMetaData } = require('./db');

const app = express();
app.use(express.json());

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

// get /reviews/meta
// params - product_id
// response 200 ok
app.get('/reviews/meta', (req, res) => {

  getMetaData(req.query.product_id, (err, result) => {
    if (err) {
      rest.status(422).send(err);
    } else {
      console.log(result);
    }
  })
})

// post /reviews
// response 201 created

// put reviews/:review_id/helpful
// incrememet helpful
// response 204 no content

// put /reviews/:review_id/report
// change reported to true
// response 204 no content

const port = 3030;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
