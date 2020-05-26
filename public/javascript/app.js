
//Scrape button
$(".scrape").on("click", function(){
    $ajax({
        method: "GET",
        url: "/scrape"
    }).then(function(data){
        console.log(data)

    }) 
})

//Save article
$(".save").on("click", function(){
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "PUT",
        url: "/articles/save/" + thisId
    }).then(function(data){
        console.log(data)
        res.render("/")
    })
})
  
  $(".modal-trigger").on("click", function(){
    var thisId = $(this).attr("data-id");
    $("#list").empty();
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function(data){
        console.log(data)
        $("#title").html(data.title.trim())
      for(var i =0; i < data.note.length; i++){
$("#list").append(`<li>${data.note[i].body}<button class=" red">X</button></li>`)
      }
//Delete item in array
      for (var i =0; i < someArray.length; i++)
   if (someArray[i].name === "Kristian") {
      someArray.splice(i,1);
      break;
   }
//Add item in a array

       
    })
  })
