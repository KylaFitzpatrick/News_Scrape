// Grab the articles as a json

$.getJSON("/articles", function renderArticles(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the articles information on the page
    // 
    $("#articles").append("<div data-id='" + data[i]._id + "'class='row'> <div class='col s12'> <div class='card black darken-1'> <div class='card-content white-text'> <span class='card-title'>" + data[i].title + "</span>" + data[i].summary + "<br />" + "https://www.sfchronicle.com" + data[i].link + "</div> <div class='card-action'> <a class='waves-effect waves-light btn save'>Save Article</a></div> </div> </div> </div>")
    }
  });

  
  
  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  
  /* global bootbox */
$(document).ready(function() {
    // Setting a reference to the article-container div where all the dynamic content will go
    // Adding event listeners to any dynamically generated "save article"
    // and "scrape new article" buttons
    var articleContainer = $("#articles");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".btn.scrape", handleArticleScrape);
    $(document).on("click", ".btn.clear", handleArticleClear);
  
    function initPage() {
      // Run an AJAX request for any unsaved headlines
      $.get("/articles?saved=false").then(function(data) {
        articleContainer.empty();
        // If we have headlines, render them to the page
        if (data && data.length) {
          renderArticles(data);
        } else {
          // Otherwise render a message explaining we have no articles
          renderEmpty();
        }
      });
    }
    
   
  
    function renderEmpty() {
      // This function renders some HTML to the page explaining we don't have any articles to view
      // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
      var emptyAlert = $(
        [
          "<div class='alert alert-warning text-center'>",
          "<h4>Oops! There are no new articles.</h4>",
          "</div>",
          "<div class='card'>",
          "<div class='card-header text-center'>",
          "<h3>What do you want to do?</h3>",
          "</div>",
          "<div class='card-body text-center'>",
          "<h4><a class='scrape'>Scrape new articles</a></h4>",
          "<h4><a href='/saved'>Go to saved articles</a></h4>",
          "</div>",
          "</div>"
        ].join("")
      );
      // Appending this data to the page
      articleContainer.append(emptyAlert);
    }
  
    function handleArticleSave() {
      // This function is triggered when the user wants to save an article
      // When we rendered the article initially, we attached a javascript object containing the headline id
      // to the element using the .data method. Here we retrieve that.
      var articleToSave = $(this)
        .parents(".row")
        .data();
  
      // Remove card from page
      $(this)
        .parents(".row")
        .remove();
  
      articleToSave.saved = true;
      console.log(articleToSave)
      // Using a patch method to be semantic since this is an update to an existing record in our collection
      $.ajax({
        method: "PUT",
        url: "/api/articles/" + articleToSave.id,
        data: articleToSave
      }).then(function(data) {
        // If the data was saved successfully
        if (data.saved) {
          // Run the initPage function again. This will reload the entire list of articles
          initPage();
        }
      });
    }
  
    function handleArticleScrape() {
      // This function handles the user clicking any "scrape new article" buttons
      $.get("/api/fetch").then(function(data) {
        // If we are able to successfully scrape the SFChronicle and compare the articles to those
        // already in our collection, re render the articles on the page
        // and let the user know how many unique articles we were able to save
        initPage();
        bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
      });
    }
  
    function handleArticleClear() {
      $.get("api/clear").then(function() {
        articleContainer.empty();
        initPage();
      });
    }
  });