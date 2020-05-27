
//Scrape button
$(".scrape").on("click", function () {
    $ajax({
        method: "GET",
        url: "/scrape"
    }).then(function (data) {
        console.log(data)

    })
})

//Save article
$(".save").on("click", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "PUT",
        url: "/articles/save/" + thisId
    }).then(function (data) {
        console.log(data)
        res.render("/")
    })
})

$(".modal-trigger").on("click", function () {
    var thisId = $(this).attr("data-id");
    $("#list").empty();
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function (data) {
        console.log(data)
        $("#title").html(data.title.trim())
        for (var i = 0; i < data.note.length; i++) {
            $("#list").append(`<li>${data.note[i].body}<button data-id="${data._id}" data-note-id="${data.note[i]._id}" id="delete" class=" red">X</button></li>`)
        }
    })
})
//Delete Article button
$(".delete").on("click", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "PUT",
        url: "/articles/delete/" + thisId
    }).then(function (data) {
        res.render("/saved")
    })
});

//Save Note button
$(".savenote").on("click", function () {
    var thisId = $(this).attr("data-id");
    
        $.ajax({
            method: "PUT",
            url: "/notes/save/" + thisId,
            data: {
                body: $("#notemsg").val()
            }
        }).then(function (data) {
               
               if (!$("#notemsg").html("")) {
                alert("please enter a note to save")
            } else {
// //Add item in a array
// for (var i = 0; i < data.note.length; i++) {
//     $("#notemsg").push(`<li>${data.note[i].body}<button data-id="${data._id}" data-note-id="${data.note[i]._id}" id="delete" class=" red">X</button></li>`)
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notemsg").attr("data-id").empty();
              $("#modal1").modal("hide");
            res.render("/saved")
            }
        });
    
});

//Delete Note button
$("#delete").on("click", function () {
    var articleId = $(this).attr("data-id");
    //Delete item in array
    var noteId = $(this).attr("data-note-id")
    $.ajax({
        method: "DELETE",
        url: "/notes/delete/" + noteId + "/" + articleId
    }).then(function (data) {
        console.log(data)
          //delete item in array
          for (var i =0; i < someArray.length; i++)
   if (someArray[i].name === "Kristian") {
      someArray.splice(i,1);
      break;
   }
        $("#modal1").modal("hide");
        res.render("/saved")
    })
});