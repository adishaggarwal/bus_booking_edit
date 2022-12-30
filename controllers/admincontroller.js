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
  //post a ticket
  app.post("/tickets", authorize("admin:access"), (req, res) => {
    new Admin({ seatno: req.body.seatno, status: req.body.status })
      .save()
      .then((bus) => res.send(bus))
      .catch((error) => res.send(error));
  });

  //get all tickets
  app.get("/tickets", authorize("admin:access"), (req, res) => {
    Admin.find({})
      .then((buses) => res.send(buses))
      .catch((error) => console.log(error));
  });

  //cancel ticket by admin
  app.patch("/canceladmin/:id/:seat", authorize("admin:access"), (req, res) => {
    Customer.updateOne(
      { _booking_id: req.params.id, seatno: req.params.seat },
      { $set: { bookstatus: "Admin_cancelled" } }
    )
      .then((resp) => {
        if (resp.nModified != 0) {
          /*
            Admin.updateOne({_id:req.params.id},{$set:{status:false}})
    .then((bus) =>res.send(bus))
    .catch((error)=>console.log(error));*/

          Admin.findOneAndDelete({ _id: req.params.id })
            .then(
              new Admin({ seatno: req.params.seat, status: false })
                .save()
                .then((bus) =>
                  res.send(`Ticket for seat ${req.params.seat} cancelled!`)
                )
                .catch((error) => res.send(error))
            )
            .catch((error) => console.log(error));
        } else {
          res.send("No such booking");
        }
      })
      .catch((error) => res.send(error));
  });

  //get all closed tickets
  app.get("/closedtickets/", authorize("admin:access"), (req, res) => {
    Customer.find({ bookstatus: "Confirm" })
      .then((buses) => {
        console.log(buses);
        if (buses != "") {
          res.send(buses);
        } else {
          res.send("All seats available");
        }
      })
      .catch((error) => console.log(error));
  });

  //update user data
  app.patch("/ticketupdate/:id", authorize("admin:access"), (req, res) => {
    if (req.body.name.length > 2 && req.body.age > 0 && req.body.age < 101) {
      Customer.updateOne(
        { _booking_id: req.params.id, bookstatus: "Confirm" },
        { $set: { name: req.body.name, age: req.body.age } }
      )
        .then((bus) => {
          console.log(bus);
          if (bus.nModified != 0) {
            res.send("Ticket updated!");
          } else {
            res.send("No tickets updated!");
          }
        })
        .catch((error) => res.send("please enter valid information!"));
    } else {
      res.send("Please fill information correctly");
    }
  });

  //reset all tickets
  app.delete("/ticketsreset/", authorize("admin:access"), (req, res) => {
    Customer.updateMany(
      { bookstatus: "Confirm" },
      { $set: { bookstatus: "Admin_cancelled" } }
    )
      .then((buses) => {
        let num = buses.nModified;
        res.send(`${num} tickets cancelled by admin! `);
      })
      .catch((error) => res.send(error));

    Customer.remove();
    Admin.remove()
      .then(() => {
        for (var i = 1; i <= 40; i++) {
          var x = i;
          new Admin({ seatno: x, status: false }).save();
          // .then((bus) => res.send(bus))
          // .catch((error) => res.send(error));
        }
      })
      .catch((error) => res.send(error));
  });
};
