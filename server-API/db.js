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
        pool.query(`select name from characteristics WHERE product_id = ${productId}`)
          .then((response) => {
            let charChart = {
              Size: 125052, Width: 125053, Comfort: 125033, Fit: 125031, Length: 125032, Quality: 125034,
            };
            let charObj = {}
            for (let char of response.rows) {
              let individualChar = char.name;
              charObj[individualChar] = {id: charChart[individualChar], value: 0}
            }
            metaDataFinal.characteristics = charObj;
          })
          .then(() => {
            pool.query(`select id from reviews WHERE product_id = ${productId}`)
              .then((results) => {
                let reviewIds = [];
                for ( let review of results.rows) {
                  reviewIds.push(review.id);
                }
                return reviewIds;
              })
              .then((reviewIds) => {
                let transformIds = reviewIds.join(',')
                pool.query(`select * from characteristics_reviews JOIN characteristics ON characteristics.id = characteristics_reviews.characteristic_id WHERE review_id IN (${transformIds})`)
                  .then((results) => {
                    let averager = {};
                    for (let item of results.rows) {
                      if (!averager[item.name]) {
                        averager[item.name] = {count: 1, value: item.value}
                      } else {
                        averager[item.name].count++;
                        averager[item.name].value = (averager[item.name].value + item.value) * 5 / 10;
                      }
                    }

                    for (let key in averager) {
                      if (metaDataFinal.characteristics[key]) {
                        metaDataFinal.characteristics[key].value = averager[key].value;
                      }
                    }
                  })
                  .then(() => {
                    callback(null, metaDataFinal);
                  })
              })
          })
      })
      .catch((err) => console.log(err))
}

let createNewPost = function (query, callback) {
  let currentDate = new Date();
  const text = 'INSERT INTO reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES(default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *'
  const values = [query.product_id, query.rating, currentDate, query.summary, query.body, query.recommend, false, query.name, query.email, 'null', 0];

  pool.query(text, values)
    .then((res) => {
      let reviewId = res.rows[0].id
      let photoArray = JSON.parse(query.photos)
      for (let photo of photoArray) {
        const qstring = 'INSERT INTO reviews_photos(id, review_id, url) VALUES(default, $1, $2) RETURNING *'
        const params = [reviewId, photo];
        pool.query(qstring, params)
      }
    })
    .then(() => {
      console.log(query);
      console.log('lets do the next thing now');
    })
    .catch(err => console.log(err))

    // character table update
    // get the characteristic id from the product id in characteristics
    // load the characteristic id relevant to the appropriate name
}

module.exports = {
  pool, getReviews, getMetaData, createNewPost
};



// const {
//   HOST1, USER, PASSWORD, DB_PORT, DB,
// } = process.env;

// user: USER,
// host: HOST1,
// database: DB,
// port: DB_PORT,


// select * from reviews JOIN reviews_photos ON reviews.id = reviews_photos.review_id WHERE product_id = ${queryParams.product_id}