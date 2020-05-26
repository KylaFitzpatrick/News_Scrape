var db = require("../models");

module.exports = function(app) {
  // Load index page
       // Routes
app.get("/", function(req, res) {
  db.Article.find({saved:false}).then(function(data){
     

      var newData = []
      for(var i =0; i < data.length; i++){
          newData.push({
              _id: data[i]._id,
              saved: data[i].saved,
              title: data[i].title,
              summary: data[i].summary,
              link: data[i].link
          })
      }

      var hbsObject = {
          article: newData
      }
      // console.log("article!", hbsObject.article[i]._id)
      // console.log("article!", hbsObject)
        res.render("index", hbsObject) 
      
      })
  })
 app.get("/saved", function(req,res){
     db.Article.find({saved:true}).populate("notes")
     .then(function(data){
      var newData = []
      for(var i =0; i < data.length; i++){
          newData.push({
              _id: data[i]._id,
              saved: data[i].saved,
              title: data[i].title,
              summary: data[i].summary,
              link: data[i].link
          })
      }

      var hbsObject = {
          article: newData
      }
      console.log(hbsObject)
        res.render("saved", hbsObject) 
     })
 })
};
