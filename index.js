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
if (program.put && program.id) {
    request({ url: `http://localhost:3008/applications/${program.id}`, method: "GET" }, function(error, response, body) {
        if (error) {
            console.log(error);

        } else {
            var responseBody = JSON.parse(body);
            var vfirstname = responseBody[0].firstname;
            var vmiddlename = responseBody[0].middlename;
            var vlastname = responseBody[0].lastname;
            var vemail = responseBody[0].email;
            var vcontactphone = responseBody[0].contactphone;
            var vaddress = responseBody[0].address;
            var vzip = responseBody[0].zip;
            var vcity = responseBody[0].city;
            var vstate = responseBody[0].state;

            if (body == '"not found"') {
                console.log("not found")
                return
            } else {
                body = JSON.parse(body)

                prompt.start();
                var schema = {
                    properties: {
                        firstname: {
                            description: `First Name`,
                            required: true,
                            default: vfirstname
                        },
                        middlename: {
                            description: `Middle Name`,
                            required: true,
                            default: vmiddlename
                        },
                        lastname: {
                            description: `Last Name`,
                            required: true,
                            default: vlastname
                        },
                        email: {
                            description: `E-Mail`,
                            required: true,
                            default: vemail
                        },
                        contactphone: {
                            description: `Contact Phone`,
                            required: true,
                            default: vcontactphone
                        },
                        address: {
                            description: `Address`,
                            required: true,
                            default: vaddress
                        },
                        zip: {
                            description: `Zip`,
                            required: true,
                            default: vzip
                        },
                        city: {
                            description: `City`,
                            required: true,
                            default: vcity
                        },
                        state: {
                            description: `State`,
                            required: true,
                            default: vstate
                        }
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
        if (error) {
            console.log(error);

        } else {
            console.log("delete: " + JSON.stringify(body));
        }
    })
}
if (program.id && !program.get && !program.query && !program.put) {
    console.log(`
        ERROR! FOLLOW THESE INSTRUCTIONS TO GET BY ID!
        To Get by ID:
        "node index.js -g -i idnumber"
        `)
}
if (program.get && !program.id && !program.query) {
    request({ url: "http://localhost:3008/applications", method: "GET" }, function(error, response, body) {
        if (error) {
            console.log(error);

        } else {
            console.log("get all: ");
            console.log(body);
        }
    })
}

if (program.get && program.id) {
    console.log(`http://localhost:3008/applications/${program.id}`);
    request({ url: `http://localhost:3008/applications/${program.id}`, method: "GET" }, function(error, response, body) {
        if (error) {
            console.log('ID NOT FOUND, PLEASE TRY AGAIN');

        } else {
            var responseBody = JSON.parse(body);
            var vfirstname = responseBody[0].firstname;
            var vmiddlename = responseBody[0].middlename;
            var vlastname = responseBody[0].lastname;
            var vemail = responseBody[0].email;
            var vcontactphone = responseBody[0].contactphone;
            var vaddress = responseBody[0].address;
            var vzip = responseBody[0].zip;
            var vcity = responseBody[0].city;
            var vstate = responseBody[0].state;
            var vid = responseBody[0]._id;
            var vapplicationstate = responseBody[0].applicationstate;
            var vcreated = responseBody[0].createdate;
            var vmodified = responseBody[0].modifydate;
            console.log("ID Search result: ")
            console.log(`
                Name: ${vlastname}, ${vfirstname} ${vmiddlename} 
                E-Mail: ${vemail}
                Contact Phone Number: ${vcontactphone}
                Address: ${vaddress}
                Zip: ${vzip}
                City: ${vcity}
                State: ${vstate}
                ID: ${vid}
                Application Status: ${vapplicationstate}
                Date Created: ${vcreated}
                Date Modified: ${vmodified}
                `);
        }
    })
}
if (program.get && !program.id && program.query) {
    request({ url: `http://localhost:3008/applications-search?${program.query}`, method: "GET" }, function(error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log("Query search: ");
            console.log(body);
        }
    })
}