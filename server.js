// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
let axios = require("axios");
let cheerio = require("cheerio");
let express = require("express");
let exphbs = require("express-handlebars");
let mongoose = require("mongoose");
var logger = require("morgan");

// Initialize Express
let app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));

// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);

app.set("view engine", "handlebars");

// Require all models
var db = require("./models");

// Database configuration
var databaseUrl = "techDiet";
var collections = ["updates"];
// Connect to the Mongo DB
mongoose.connect(databaseUrl, collections, { useNewUrlParser: true });

// Main route (simple Hello World Message)
app.get("/", (req, res) => {
    res.render("index");
});

// TODO: make two more routes

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)
app.get("/scrape", (req, res) => {
    axios.get("https://www.theverge.com").then(response => {

        // An empty array to save the data that we'll scrape
        let results = [];
        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        let $ = cheerio.load(response.data);

        // Select each element in the HTML body from which you want information.
        // NOTE: Cheerio selectors function similarly to jQuery's selectors,
        // but be sure to visit the package's npm page to see how it works
        $("div.c-compact-river__entry").each((i, element) => {

            let title = $(element).find(".c-entry-box--compact").find("h2").find("a").text();
            let author = $(element).find(".c-entry-box--compact").find(".c-byline").find(".c-byline__item").find("a").text().trim();
            let link = $(element).find(".c-entry-box--compact").find("h2").find("a").attr("href");
            let authorLink = $(element).find(".c-entry-box--compact").find(".c-byline").find(".c-byline__item").find("a").attr("href");
            let date = $(element).find(".c-entry-box--compact").find(".c-byline").find(".c-byline__item").find("time").text().trim();
            // Save these results in an object that we'll push into the results array we defined earlier
            results.push({
                title: title,
                author: author,
                link: link,
                authorLink: authorLink,
                date: date
            });
            // Create a new Article using the `result` object built from scraping
            db.Article.create(results)
                .then(dbArticle => {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
            });
        });
    });
});

// UPDATES PAGE
// Grab every document in the Articles collection
app.get("/updates", (req, res) => {
    db.Article.find({})
        .then(dbArticles => {
            // If we were able to successfully find Articles, send them back to the client
            console.log(dbArticle)
            res.json(dbArticle);
        })
        .catch(err => {
            // If an error occurred, send it to the client
            console.log(res.json(err));
        });
});


// SAVES PAGE
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?
app.get("/saves", (req, res) => {
    // An empty array to save the data that we'll scrape
    let results = [];

    axios.get("https://www.theverge.com/tech").then(response => {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        let $ = cheerio.load(response.data);

        // Select each element in the HTML body from which you want information.
        // NOTE: Cheerio selectors function similarly to jQuery's selectors,
        // but be sure to visit the package's npm page to see how it works
        $("div.c-compact-river__entry").each((i, element) => {

            let title = $(element).find(".c-entry-box--compact").find("h2").find("a").text();
            let author = $(element).find(".c-entry-box--compact").find(".c-byline").find(".c-byline__item").find("a").text().trim();
            let link = $(element).find(".c-entry-box--compact").find("h2").find("a").attr("href");
            let authorLink = $(element).find(".c-entry-box--compact").find(".c-byline").find(".c-byline__item").find("a").attr("href");
            let date = $(element).find(".c-entry-box--compact").find(".c-byline").find(".c-byline__item").find("time").text().trim();
            // Save these results in an object that we'll push into the results array we defined earlier
            results.push({
                title: title,
                author: author,
                link: link,
                authorLink: authorLink,
                date: date
            });
            // Create a new Article using the `result` object built from scraping
            db.Article.create(results)
                .then(dbArticle => {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });

        // Grab every document in the Articles collection
        db.Article.find({})
            .then(dbArticle => {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(err => {
                // If an error occurred, send it to the client
                res.json(err);
            });
        console.log(results)
        res.redirect("/saves");
    });
});

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, () => console.log("App running on port 3000!"));