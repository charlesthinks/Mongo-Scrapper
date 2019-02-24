// Grab the articles as a json
$.getJSON("/articles", data => {
    // For each one
    let dataArray = data.length;
    while (i < 5) {
        // Display the apropos information on the page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
        i++;
    }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", () => {
    // Empty the notes from the note section
    $(desc).empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(data => {
            console.log(data);

            let title = data.title;
            let link = data.link;
            let id = data._id;
            let comnt = data.comment;

            function dataStart(data) {

                let i = 0;
                while (i < data.length) {

                    // description to append to
                    let desc = $("<div class='description'>")

                    // A h3 tect that prints 'Top Stories'...
                    $(desc).append("<h3 class='ui header'>Top Stories</h3>");
                    // The title of the article
                    $(desc).append("<h2 id='title'>" + title + "</h2>");
                    // The article itself...
                    $(desc).append("<p class='articles'>" + link + "</p>");
                    // A textarea to add a new note body
                    $(desc).append("<textarea id='bodyinput' name='body'></textarea>");
                    // A button to submit a new note, with the id of the article saved to it
                    $(desc).append("<button data-id=" + id + ">Save Note</button>");

                    // If there's a note in the article
                    if (comnt) {
                        // Place the title of the note in the title input
                        $("#titleinput").val(comnt.title);
                        // Place the body of the note in the body textarea
                        $("#bodyinput").val(comnt.body);
                    };
                    i += 5;
                }
            };
            dataStart();
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", () => {
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
        .then(data => {
            // Log the response
            console.log(data);
            // Empty the notes section
            $(desc).empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});
