var db = require("../models");

module.exports = function(app) {

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
// First, we grab the body of the html with axios
axios.get("https://www.sfchronicle.com/culture/travel/").then(function (response) {
  // Then, we load that into cheerio and save it to $ for a shorthand selector
  var $ = cheerio.load(response.data);

  // Now, we grab every ul within an article tag, and do the following:
  $("ul li.dynamic-river__item").each(function (i, element) {
    // Save an empty result object
    var result = {};

    // Add the text and href of every link, and save them as properties of the result object
    result.title = $(this)
      .children(".dynamic-river__header").children("a")
      .text();
      result.summary = $(this)
      .children("a")
      .text();
    result.link = "https://www.sfchronicle.com" + $(this)
    .children("a")
      .attr("href");

    // Create a new Article using the `result` object built from scraping
    db.Article.create(result)
      .then(function (dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, log it
        console.log(err);
      });
  });

  // Send a message to the client
  res.send("Scrape Complete");
});
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
// TODO: Finish the route so it grabs all of the articles
db.Article.find({})

  .then(function (dbArticle) {
    res.json(dbArticle);
  })
  .catch(function (err) {
    res.json(err)
  })
});
//Save article
app.put("/articles/save/:id", function(req, res){
  db.Article.findOneAndUpdate({_id: req.params.id}, {saved: true})
  .then(function(error, document){
      if(err){
          console.log(err);
      }else{
          res.send(document)
      }
  })
})
//Delete an article
app.put("/articles/delete/:id", function(req, res){
db.Article.findOneAndUpdate({_id: req.params.id}, {saved:false, notes: []})
.then(function(error, document){
  if(error){
      console.log(error)
  }else{
      res.send(document)
  }
})
})
// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
// TODO
// ====
// Finish the route so it finds one article using the req.params.id,
db.Article.findOne({ _id: req.params.id })
  // and run the populate method with "note",
  .populate("note")
  // then responds with the article with the note included
  .then(function (dbArticle) {
    res.json(dbArticle);
  })
  .catch(function (err) {
    res.json(err)
  })
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
// TODO
// ====
// save the new note that gets posted to the Notes collection

db.Note.create(req.body)
.then(function(dbNote){
  return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true })
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
})
  .then(function (dbArticle) {
    res.json(dbArticle);
  })
  .catch(function (err) {
    res.json(err);
  });
});

// Create a new note
app.post("/notes/save/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note({
    body: req.body.text,
    article: req.params.id
  });
  console.log(req.body)
  // And save the new note the db
  newNote.save(function(error, note) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's notes
      db.Article.findOneAndUpdate({ "_id": req.params.id }, {$push: { "notes": note } })
      // Resolve promise
      .then(function(err) {
        // Log any errors
        if (err) {
          console.log(err);
          res.send(err);
        }
        else {
          // Or send the note to the browser
          res.send(note);
        }
      });
    }
  });
});

// Delete a note
app.delete("/notes/delete/:note_id/:article_id", function(req, res) {
  // Use the note id to find and delete it
  db.Note.findOneAndRemove({ "_id": req.params.note_id }, function(err) {
    // Log any errors
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      db.Article.findOneAndUpdate({ "_id": req.params.article_id }, {$pull: {"notes": req.params.note_id}})
       // Resolve promise to execute query
        .then(function(err) {
          // Log any errors
          if (err) {
            console.log(err);
            res.send(err);
          }
          else {
            // Or send the note to the browser
            res.send("Note Deleted");
          }
        });
    }
  });
});
};
