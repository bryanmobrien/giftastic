
//javascript, jQuery
// alert("Connected!!");
var xhr = $.get("https://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YCHVj1EUgEZWWhFbelsQUvGzRFDwUrvo&limit=5");
xhr.done(function(data) { console.log("success got data", data); });

document.querySelectorAll(".gif").forEach(function (img) {
    img.addEventListener("click", function (event) {

      // The javascript getAttribute method allows us to get or set the value of any attribute on our HTML element
      var state = event.target.getAttribute("data-state");
      // If the clicked image's state is still, update its src attribute to what its data-animate value is.
      // Then, set the image's data-state to animate
      // Else set src to the data-still value
      if (state === "still") {
        event.target.setAttribute("src", event.target.getAttribute("data-animate"));
        event.target.setAttribute("data-state", "animate");
      } else {
        event.target.setAttribute("src", event.target.getAttribute("data-still"));
        event.target.setAttribute("data-state", "still");
      }
    });
  });