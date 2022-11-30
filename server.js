// importing modules
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const PORT = 3001;
const app = express();
const db = require("./db/db.json");
let myArray = db;

// Helper method for generating unique ids
const uuid = require("./helpers/uuid");

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET Route for index.html page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
// GET Route for notes.html page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);
// GET Route for retrieving all the notes
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});
// GET route that returns any specific id
app.get("/api/notes/:id", (req, res) => {
  // Coerce the specific search term to lowercase
  const requestedId = req.params.id.toLowerCase();
  // Iterate through the id name to check if it matches `req.params.id`
  for (let i = 0; i < db.length; i++) {
    if (requestedId === db[i].id.toLowerCase()) {
      return res.json(db[i]);
    }
  }
  // Return a message if the term doesn't exist in our DB
  return res.json("No match found");
});

// POST Route for a new note
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json(`Note added successfully 🚀`);
  } else {
    res.error("Error in adding note");
  }
});

const readFromFile = util.promisify(fs.readFile);
/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

app.delete("/api/notes/:id", function (req, res) {
  console.log("req params", req.params.id);
  const itemIndex = myArray.findIndex(({ id }) => id === req.params.id);
  if (itemIndex >= 0) {
    myArray.splice(itemIndex, 1);
  }
  readAndAppend("/api/note");
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
