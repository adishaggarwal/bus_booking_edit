const Admin = require("../database/models/admin");
const Customer = require("../database/models/customer");

const jwt = require("jsonwebtoken");
const config = require("../config");
const authorize = require("../authorization-middleware");

const express = require("express");
const app = express();
const mongoose = require("../database/mongoose");
var bodyParser = require("body-parser");
app.use(bodyParser.json());

module.exports = function (app) {
  //BOOK A TICKET
  app.post("/bookticket/:seat/:id", (req, res) => {
    Admin.find({ seatno: req.params.seat, status: false, _id: req.params.id })
      .then((resp) => {
        console.log(resp);
        if (resp != "") {
          if (
            req.body.age < 101 &&
            req.body.age > 0 &&
            req.body.name.length > 2
          ) {
            new Customer({
              seatno: req.params.seat,
              _booking_id: req.params.id,
              bookstatus: "Confirm",
              name: req.body.name,
              age: req.body.age,
            })
              .save()
              .then(() => {
                Admin.updateOne(
                  { _id: req.params.id },
                  { $set: { status: true } }
                )
                  .then((bus) => res.send("Happy Journey!"))
                  .catch((error) => console.log(error));
              })
              .catch((error) => {
                res.send(error);
              });
          } else {
            res.send("Please fill in details correctly");
          }
        } else {
          res.send("Seat not available");
        }
      })
      .catch((error) => res.send(error));
  });

  //cancel ticket by customer
  app.patch("/cancelcustomer/:id/:seat", (req, res) => {
    Customer.updateOne(
      {
        _booking_id: req.params.id,
        seatno: req.params.seat,
        bookstatus: "Confirm",
      },
      { $set: { bookstatus: "Customer_cancelled" } }
    )
      .then((resp) => {
        console.log(resp);
        if (resp.nModified != 0) {
          Admin.findOneAndDelete({ _id: req.params.id })
            .then(() => {
              new Admin({ seatno: req.params.seat, status: false })
                .save()
                .then((bus) => res.send(bus))
                .catch((error) => res.send(error));
            })
            .catch((error) => console.log(error));
        } else {
          res.send("No such booking");
        }
      })
      .catch((error) => res.send(error));
  });

  //find ticket by ticket id
  app.get("/tickets/:id", (req, res) => {
    Customer.findOne({ _booking_id: req.params.id })
      .then((bus) => {
        if (bus != null) {
          res.send(bus);
        } else {
          res.send("NO such booking");
        }
      })
      .catch((error) => res.send("no such booking"));
  });

  //get all open tickets
  app.get("/opentickets/", (req, res) => {
    Admin.find({ status: false })
      .then((buses) => {
        console.log(buses);
        if (buses != "") {
          var data = [];
          for (var i = 0; i < buses.length; i++) {
            data[i] = JSON.stringify(buses[i].seatno);
          }
          res.send(data);
        } else {
          res.send("No seats available");
        }
      })
      .catch((error) => console.log(error));
  });

  //get ticket status
  app.get("/ticketstatus/:id", (req, res) => {
    Customer.findOne({ _booking_id: req.params.id })
      .then((bus) => {
        console.log(bus);
        res.send(bus.bookstatus);
      })
      .catch((error) => {
        console.log(error);
        res.send("Please fill in correct id");
      });
  });
};
