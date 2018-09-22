// Grab the articles as a json
$.getJSON("/articles", function(data) {
  
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      let artDiv = $('<div>').addClass('card-title text-center bg-primary');
      let btnDiv = $("<button type='button' class='btn btn-dark mb-2' id='addNote' data-id=" + data[i]._id + ">Article Notes</button>")
      let cardBody = $('<div>').addClass('card-footer bg-dark mb-2')
      let imgDiv = $('<div>').addClass('card-img-top');
      imgDiv.append(data[i].image)
      artDiv.append("<p data-id='" + data[i]._id + "'>" + data[i].title + "</p>");
      cardBody.append("<a href='http://www.sportingnews.com" + data[i].link + "'> Read this Story Here </a>");
      artDiv.append(btnDiv).append(cardBody)
      $("#articles").append(artDiv);
    }
  });
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", "#addNote", function(data) {
    console.log(data);
    
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    console.log(this);
    
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        // console.log(data);
        let noteDiv = $('<div>').addClass("card text-center");
        // The title of the article
        $(noteDiv).append("<h5>" + data.title + "</h5>");
        // An input to enter a new title
        $(noteDiv).append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $(noteDiv).append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $(noteDiv).append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        $('#notes').append(noteDiv);
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