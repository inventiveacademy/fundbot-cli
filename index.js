#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');
const express = require('express');
var request = require('request');
var bodyParser = require("body-parser");
var prompt = require('prompt');
const app = express();


function list(val) {
    return val.split(',');
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

program
    .version('0.1.0')
    .option('-g, --get [n]', 'get applicant(s) id or all')
    .option('-i, --id <n>', 'get applicant by id ')
    .option('-d, --delete <n>', 'delete applicant')
    .option('-q, --query <n>', 'query search')
    .option('-p, --post [n]', 'post new applicant')
    .option('-u, --put [n]', 'edit applicant')
    .parse(process.argv);


if (program.post) {
    var objToSend = {}
    if ((typeof program.post) == "string") {
        var arrNames = program.post.split(" ");
        if (arrNames.length == 2) {
            objToSend = { "firstname": arrNames[0], "middlename": arrNames[1] }
            request({ url: `http://localhost:3008/applications`, method: "POST", json: objToSend }, function(error, response, body) {
                console.log("post:" + JSON.stringify(objToSend));
                console.log(body);
            });
        }
    } else {
        prompt.start();
        prompt.get(['firstname', 'middlename', 'lastname', 'email', 'contactphone', "address", "zip", "city", "state"], function(err, result) {
            objToSend = { "firstname": result.firstname, "middlename": result.middlename, "lastname": result.lastname, "email": result.email, "contactphone": result.contactphone, "address": result.address, "zip": result.zip, "city": result.city, "state": result.state }
            request({ url: `http://localhost:3008/applications`, method: "POST", json: objToSend }, function(error, response, body) {
                console.log("post:" + JSON.stringify(objToSend));
                console.log(body);
            });
        })
    }
}
if (program.put) {
    var vfirstname = ""
    var vmiddlename = ""
    var vlastname = ""
    var vemail = ""
    var vcontactphone = ""
    var vaddress = ""
    var vzip = ""
    var vcity = ""
    var vstate = ""
    request({ url: `http://localhost:3008/applications${program.id}`, method: "GET" }, function(error, response, body) {
        if (body == '"not found"') {
            console.log("not found")
            return
        } else {
            body = JSON.parse(body)

            prompt.start();
            var schema = {
                properties: {
                    firstname: {
                        description: `firstname=${vfirstname}`,
                        required: true
                    },
                    middlename: {
                        description: `middlename=${vmiddlename}`,
                        required: true
                    },
                    lastname: {
                        description: `lastname=${vlastname}`,
                        required: true
                    },
                    email: {
                        description: `email=${vemail}`,
                        required: true
                    },
                    contactphone: {
                        description: `contactphone=${vcontactphone}`,
                        required: true
                    },
                    address: {
                        description: `address=${vaddress}`,
                        required: true
                    },
                    zip: {
                        description: `zip=${vzip}`,
                        required: true
                    },
                    city: {
                        description: `city=${vcity}`,
                        required: true
                    },
                    state: {
                        description: `state=${vstate}`,
                        required: true
                    }
                }
            }
            prompt.get(schema, function(err, result) {
                //var arrNames =program.put.split(" ");
                // var objToSend = {"fname":arrNames[0],"lname":arrNames[1]}
                var objToSend = { "firstname": result.firstname, "middlename": result.middlename, "lastname": result.lastname, "email": result.email, "contactphone": result.contactphone, "address": result.address, "zip": result.zip, "city": result.city, "state": result.state }
                request({ url: `http://localhost:3008/applications/${program.id}`, method: "PUT", json: objToSend }, function(error, response, body) {
                    console.log("put: " + program.put + " " + JSON.stringify(objToSend))
                });
            });
        }
    })
}
if (program.delete) {
    request({ url: `http://localhost:3008/applications/${program.delete}`, method: "DELETE" }, function(error, response, body) {
        console.log("delete: " + JSON.stringify(body));
    })
}
if (program.get && !program.id && !program.query) {
    request({ url: "http://localhost:3008/applications", method: "GET" }, function(error, response, body) {
        console.log("get all: ");
        console.log(body);
    })
}

if (program.get && program.id) {
    console.log(`http://localhost:3008/applications/${program.id}`);
    request({ url: `http://localhost:3008/applications/${program.id}`, method: "GET" }, function(error, response, body) {
        console.log("get by id: ")
        console.log(body);
    })
}
if (program.get && !program.id && program.query) {
    console.log(`http://localhost:3008/applications-search?${program.query}`)
    request({ url: `http://localhost:3008/applications-search?${program.query}`, method: "GET" }, function(error, response, body) {

        console.log("Query search: ");
        console.log(body);
    })
}