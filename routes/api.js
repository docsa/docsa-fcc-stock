/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb");
var request = require("request-promise-native");
var db;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

MongoClient.connect(process.env.DB, (err, data) => {
  if (err) console.log("Database error: " + err);
  db = data;
  console.log("Database connected");
});

module.exports = function(app) {
  app.route("/api/stock-prices").get(function(req, res, next) {
    let symbols = req.query.stock;
    if (!Array.isArray(symbols)) {
      symbols = [symbols];
    }
    if (symbols.length < 1 || symbols.length > 2) {
      return res.status(403).Message("accept only 1 or 2 symbols");
    }
    if (req.query.like) {
      let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      symbols.forEach(symbol => {
        let item = {
          symbol: symbol,
          ip: ip.split(",")[0]
        };

        db.collection("stocks").update(
          item,
          item,
          { upsert: true },
          (err, data) => {
            if (err) {
              return next(err);
            }
          }
        );
      });
    }
    request({
      uri: `https://repeated-alpaca.glitch.me/v1/stock/${symbols[0]}/quote`
    })
      .then(function(data) {
        let json = JSON.parse(data);
        let quote = json.latestPrice;
        let resp = {
          stockData: { stock: symbols[0].toUpperCase(), price: quote }
        };
        db.collection("stocks")
          .count({ symbol: symbols[0] })
          .then(value => {
            resp.likes = value;

            if (symbols.length === 2) {
              request({
                uri: `https://repeated-alpaca.glitch.me/v1/stock/${symbols[1]}/quote`
              }).then(data => {
                json = JSON.parse(data);
                quote = json.latestPrice;
                resp.stockData = [
                  resp.stockData,
                  { stock: symbols[1].toUpperCase(), price: quote }
                ];
                db.collection("stocks")
                  .count({ symbol: symbols[1] })
                  .then(value => {
                    resp.stockData[0].rel_likes = resp.likes - value;
                    resp.stockData[1].rel_likes = value - resp.likes;
                    delete resp.likes;
                    console.dir(resp);
                    return res.send(resp);
                  });
              });
            } else {
              console.dir(resp);
              return res.send(resp);
            }
          });
      })
      .catch(err => {
        console.log("Error : ", err.message);
      });
  });
};
