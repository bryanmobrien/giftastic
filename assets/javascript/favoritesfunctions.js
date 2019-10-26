//create the view of the favorites page
function createFavoritesView(){
    //get the content element of the html, and set its inner html to nothing
    const contentHTML = document.getElementById("content");
    contentHTML.innerHTML = "";

    //setting the class name to favorites-content so the page will fill with gifs no mater the size
    contentHTML.className = "favorites-content";

    //if the favorites array is not empty then loop through them to create cards
    if(favoritesArr.length !== 0) {
        for(let i = 0; i<favoritesArr.length;i++){
            contentHTML.appendChild(makeFavoritesCards(favoritesArr[i]));
        }
    } else {
        //if no favorites alert them and send them back to the giphy page
        alert("No favorites found.  Try adding one and coming back to this page. \n Sending you to Giphy page! ");
        createGifPage();
    }
}

/*
    this function takes a gif object from giphy and makes an html "card" for it
*/
function makeFavoritesCards(data){
    //make a new div and set its className to "img-content-container"
    const newCardDiv = document.createElement("div");
    newCardDiv.className = "img-content-container";

    //create an img tag, set its className to "img-gif", and set the source to the gif's url
    const newImg = document.createElement("img");
    newImg.className = "img-gif";
    newImg.src = data.still;

    // Create an object for favorites
    // still is a static gif, animated is a 'gif in action'
    // all others should be self-explanatory
    let dataObj = {
        still: data.still,
        animated: data.animated,
        title: data.title,
        date: data.date,
        rating: data.rating,
        username: data.username,
        url: data.url
    }
    dataObj = JSON.stringify(dataObj);

    /*
        creating attributes and assigning them to the img element
        gif-still = is the link to the still image of the gif
        gif-animated =  is the link to the animated version of the gif
        status = is whether or not the gif is currently animated or still
    */
    newImg.setAttribute("gif-still", data.still);
    newImg.setAttribute("gif-animated", data.animated);
    newImg.setAttribute("status", "still");

    // add event listener for a click on our recently created img element
    newImg.addEventListener("click", function(){
        //gets the attribute called status and saves it to a variable called status
        const status = this.getAttribute("status");

        //checks if the status variable is equal to the string still 
        if (status === "still"){
            //if the img status attribute is still set the source to the animated gif and set the stats attribute to animated
            this.src = this.getAttribute("gif-animated");
            this.setAttribute("status", "animated")
        } else {
            //if the img status attribute is animated set the source to the still version of the gif and set the status attribute to still
            this.src = this.getAttribute("gif-still");
            this.setAttribute("status", "still")
        }
    })

    // append the new img element to the recently created div
    newCardDiv.appendChild(newImg);

    // create a new div to hold all of the text
    const newTextDiv = document.createElement("div");

    // create a variable called username that is an empty string 
    let username = "";

    // if the username that we received from the argument is not empty and if it isn't then set the username variable 
    // equal to the html below to display the username below the gif otherwise no username felid will show up on the card
    if (data.username.length !== 0) username = `<p class="img-stats">username: ${data.username}</p>`;

    // Set the html to the pre-written html below.  Worked with Coop, and he assures me that this is quicker.
    newTextDiv.innerHTML = `
    <hr>
    <p class="img-title-text">Title: ${data.title}</p>
    <hr>
    <p class="img-stats">Rating: ${data.rating}</p>
    <p class="img-stats">Upload Date: ${data.date.substring(0,10)}</p>
    <p class="img-stats"><a href="${data.url}" target="_blank">Link to gif page</a></p>${username}`;

    //create the favorites button, create attribute called card-data and add stringified object of the data to the attribute
    const newFavoritesButton = document.createElement("button");
    newFavoritesButton.setAttribute("card-data", dataObj);

    //set the buttons text content to favorite?, set the class name to buttons, set the id to favorites-button
    newFavoritesButton.textContent = "Un-Favorite?";
    newFavoritesButton.className = "buttons";
    newFavoritesButton.id = "favorites-button";


    //add an event listener to the new favorites button
    newFavoritesButton.addEventListener("click", function(){
        //get the data from the card and convert it back to an object
        let cardData = JSON.parse(this.getAttribute("card-data"));


        //creating the index variable
        let index = -1;


        //getting the index of the item from the array
        favoritesArr.filter((card,indexed) =>{
            if(card.url === cardData.url){
                index = indexed;
            }
        });

        //removing the object from the array
        favoritesArr.splice(index, 1);

        //remove the card from the display
        this.parentElement.parentElement.remove();

        
        //update the local forage data 
        setLists();
    });

    //add the new favorites button
    newTextDiv.appendChild(newFavoritesButton);

    //append the text div to the card div and return the card div to be used outside this function
    newCardDiv.appendChild(newTextDiv);
    return newCardDiv;
}