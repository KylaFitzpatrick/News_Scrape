//Active nav button

    // $(".nav li").click(function(event) {
    //     event.preventDefault()
    //     alert("clicked")
    //     $(".nav li").removeClass("active");
    //     $(this).addClass("active")
    // });

//Scrape button
$(".scrape").on("click", function () {
    alert("clicked!")
    $.ajax({
        method: "GET",
        url: "/scrape" 
    }).then(function (data) {
        console.log(data)
        res.render("/")
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
            $("#list").append(`<li>${data.note[i].body}<button data-id="${data._id}" data-note-id="${data.note[i]._id}" id="delete" class="red">X</button></li>`)
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
    if (!$("#notemsg").html("")) {
        alert("please enter a note to save")
    } else {
        $.ajax({
            method: "PUT",
            url: "/notes/save/" + thisId,
            data: {
                body: $("#notemsg").val()
            }
        }).then(function (data) {
               
              
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notemsg").val("");
              $("#modal1").modal("hide");
            res.render("/saved")
            
        });
    }
});

//Delete Note button
$(document).on("click", ".red", function (event) {
   event.preventDefault()
   
    var noteId = $(this).attr("data-note-id")
    $.ajax({
        method: "DELETE",
        url: "/notes/delete/" + noteId 
    }).then(function (data) {
        console.log(data)
        $("#modal1").hide();
        res.render("/saved")
    })
});

//Clear button
$(".clear").on("click", function (){
    $.ajax({
        method: "DELETE",
        url: "/clear"
    }).then(function() {
        $("#articles").empty();
        res.render("/")
    })
})