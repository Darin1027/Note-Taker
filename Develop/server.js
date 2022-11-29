// importing modules
const express = require("express");
const path = require("path");
const fs = require("fs");
// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);
const util = require("util");

// Helper method for generating unique ids
const PORT = 3001;
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET Route for index.html page

// GET Route for feedback page
