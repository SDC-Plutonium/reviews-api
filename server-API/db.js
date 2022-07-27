/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
const { Pool, Client } = require('pg');
require('dotenv').config;

const connectionString = 'postgres://myuser@localhost/sdc';

const pool = new Pool({
  connectionString,
});

pool.connect()
  .then(() => console.log('possssgres connected'))
  .catch((err) => console.log(err, 'posgres error'));

let getReviews = function (queryParams, callback) {
  console.log('in db layer', queryParams);
  pool.query(`select * from reviews WHERE product_id = ${queryParams.product_id}`)
      .then((res) => {
        let reviewResponse = res.rows;
        return reviewResponse
      })
      .then((reviewResponse) => {
        let i = 0;
        for (let review of reviewResponse) {
          pool.query(`select * from reviews_photos WHERE review_id = ${review.id}`)
            .then((res) => {
              review.pictures = res.rows
              i++
              if (i >= reviewResponse.length) {
                return reviewResponse
              }
            })
            .then((finalResult) => {
              if (finalResult !== undefined) {
                callback(null, finalResult)
              }
            })
            .catch((err) => console.log(err))
        }
      })
      .catch((err) => console.log(err));
}

let getMetaData = function (productId, callback) {
  console.log('in db', productId)
  let metaDataFinal = {characteristics: {}, ratings: {}, recommended: {}}

  pool.query(`select recommend, rating from reviews WHERE product_id = ${productId}`)
      .then((res) => {
        let recValues = {false: 0, true: 0};
        let ratingValues = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for (let item of res.rows) {
          recValues[item.recommend]++
          ratingValues[item.rating]++
        }
        metaDataFinal.recommended = recValues;
        metaDataFinal.ratings = ratingValues;
        return recValues
      })
      .then((recValues) => {
        console.log(metaDataFinal);
      })
}

module.exports = {
  pool, getReviews, getMetaData
};

// const {
//   HOST1, USER, PASSWORD, DB_PORT, DB,
// } = process.env;

// user: USER,
// host: HOST1,
// database: DB,
// port: DB_PORT,


// select * from reviews JOIN reviews_photos ON reviews.id = reviews_photos.review_id WHERE product_id = ${queryParams.product_id}