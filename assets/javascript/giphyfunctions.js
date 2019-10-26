//this is a functions file because I would like to separate the functions from the on page load code and global variables


/*
    this function creates the buttons for the top of the page
*/
function createButtons(arr, toAppendHTML) {
    //loop through the passed in array to create a button for each item 
    for (let i = 0; i < arr.length; i++) {
        //create a new button, set its name to string in the passed in array with the index of i, and set the class name to buttons
        let button = document.createElement("button");
        button.textContent = arr[i];
        button.className = "buttons";

        //setting a custom attribute called query-term to the string in the array with the index of i and create a listener for said button
        button.setAttribute("query-term", arr[i]);
        createQueryButtonListener(button);

        //append the new button to the passed in html element
        toAppendHTML.appendChild(button);
    }

    //send the html element back to where ever it was called just incase we change something on it
    return toAppendHTML;
}


/*
    this function is for creating the event listeners on the passed in button based on wether the global variable isGiphy is true indicating if we are looking at giphy or something else 
*/
function createQueryButtonListener(button) {
    if (isGiphy) {
        //if isGiphy is true then create a event listener for click 
        button.addEventListener("click", function () {
            //get the attribute "query-term" and store it to a variable
            let searchTerm = this.getAttribute("query-term");

            //run the search giphy function for gif's related to the term we got above
            searchGiphy(searchTerm);
        })
    } else {
        //if isGiphy is not true search omdb
        button.addEventListener("click", function () {
            //get the attribute "query-term" and store it to a variable
            let searchTerm = this.getAttribute("query-term");

            //run the search giphy function for gif's related to the term we got above
            searchOmdb(searchTerm);
        })
    }
}


/*
    this function searches giphy for the passed in query term
*/
function searchGiphy(queryTerm, isMoreButton) {
    let queryUrl;
    if (!isMoreButton) {

        //generate the queryUrl with the apikey (global variable), query term (argument), limit (global variable), and ratings (global variable)
        queryUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${queryTerm}&limit=${limit}${ratings}`;

        //set the lastQuery url so it may be used at a later date to load more gif's
        lastQuery = queryUrl;

        //reset the offset variable to 0 so the more button will load the proper gif's 
        offset = 0;
    } else {
        //adding 10 to the offset so we will get new gif's
        offset = offset + 10;
        queryUrl = `${lastQuery}&offset=${offset}`;
    }



    //use the newly created queryUrl to fetch the requested gif's from giphy
    fetch(queryUrl)

        //magic LOL - really though here we are converting the response to json via a method that i have not learned about yet 
        .then(response => {
            return response.json();
        })

        //after we converted the data to an actual object then we can work with it
        .then(responseJson => {
            //creating a data variable so i do not have to put responseJson.data every time i want to reference it
            const data = responseJson.data;

            const contentContainer = document.getElementById("content-container");

            //clearing the content container for the new gifs to flood in if the more button has not been pressed
            if (!isMoreButton) contentContainer.innerHTML = "";

            //looping through the new data variable
            for (let i = 0; i < data.length; i++) {

                //run the makeCards function with the argument of the current object from the array we are looping through and save its return in a variable
                const card = makeCards(data[i]);

                //appending the new gif card to the content-container html element on the page
                contentContainer.appendChild(card);
            }

            const newButtonContainer = document.createElement("div");
            newButtonContainer.className = "new-button-container"
            //create the more button at the bottom of the page set its text to More, set its class to buttons, and set its id to more-button
            const newMoreButton = document.createElement("button");
            newMoreButton.textContent = "More";
            newMoreButton.className = "buttons";
            newMoreButton.id = "more-button";

            //add event listener to the new more button that runs another search on giphy for more of the same results and removes its self
            newMoreButton.addEventListener("click", function () {
                searchGiphy("", true);
                this.parentElement.remove();
            })

            //append the button to the bottom of the page
            newButtonContainer.appendChild(newMoreButton);
            contentContainer.appendChild(newButtonContainer)
        })
}


/*
    this function takes a gif object from giphy and makes a html "card" for it
*/
function makeCards(data) {
    //make a new div and set its className to "img-content-container"
    const newCardDiv = document.createElement("div");
    newCardDiv.className = "img-content-container";

    //create an img tag, set its className to "img-gif", and set the source to the gif's url
    const newImg = document.createElement("img");
    newImg.className = "img-gif";
    newImg.src = data.images.original_still.url;

    //create a object for favorites
    let dataObj = {
        still: data.images.original_still.url,
        animated: data.images.original.url,
        title: data.title,
        date: data.import_datetime,
        rating: data.rating,
        username: data.username,
        url: data.url
    }
    dataObj = JSON.stringify(dataObj);

    /*
        creating attributes and assigning them to the img element
        gif-still = is the link to the still image of the gif
        gif-animated =  is the link to the animated version of the gif
        status = is wether or not the gif is currently animated or still
    */
    newImg.setAttribute("gif-still", data.images.original_still.url);
    newImg.setAttribute("gif-animated", data.images.original.url);
    newImg.setAttribute("status", "still");

    //add an event listener for a click on our recently created img element
    newImg.addEventListener("click", function () {
        //gets the attribute called status and saves it to a variable called status
        const status = this.getAttribute("status");

        //checks if the status variable is equal to the string still 
        if (status === "still") {
            //if the img status attribute is still set the source to the animated gif and set the stats attribute to animated
            this.src = this.getAttribute("gif-animated");
            this.setAttribute("status", "animated")
        } else {
            //if the img status attribute is animated set the source to the still version of the gif and set the status attribute to still
            this.src = this.getAttribute("gif-still");
            this.setAttribute("status", "still")
        }
    })

    //append the new img element to the recently created div
    newCardDiv.appendChild(newImg);

    //create a new div to hold all of the text
    const newTextDiv = document.createElement("div");

    //crate a variable called username that is an empty string 
    let username = "";

    //if the username that we received from the argument is not empty and if it isn't then set the username variable equal to the html below to display the username below the gif otherwise no username felid will show up on the card
    if (data.username.length !== 0) username = `<p class="img-stats">username: ${data.username}</p>`;

    //set the html to the pre written html below because this is quicker :) and because this form of string concatenation is sweet!! 
    newTextDiv.innerHTML = `
    <hr>
    <p class="img-title-text">Title: ${data.title}</p>
    <hr>
    <p class="img-stats">Rating: ${data.rating}</p>
    <p class="img-stats">Upload Date: ${data.import_datetime.substring(0,10)}</p>
    <p class="img-stats"><a href="${data.url}" target="_blank">Link to gif page</a></p>${username}`;

    let isFavorite = false;


    //getting the index of the item from the array
    favoritesArr.filter((card) => {
        if (card.url === data.url) {
            isFavorite = true;
        }
    });

    if (!isFavorite) {
        //create the favorites button, create attribute called card-data and add stringified object of the data to the attribute
        const newFavoritesButton = document.createElement("button");
        newFavoritesButton.setAttribute("card-data", dataObj);

        //set the buttons text content to favorite?, set the class name to buttons, set the id to favorites-button
        newFavoritesButton.textContent = "Favorite?";
        newFavoritesButton.className = "buttons";
        newFavoritesButton.id = "favorites-button";


        //add an event listener to the new favorites button
        newFavoritesButton.addEventListener("click", function () {
            const cardData = JSON.parse(this.getAttribute("card-data"));
            favoritesArr.push(cardData);
            this.remove();

            //update the local forage data 
            setLists();
        });
    
        //add the new favorites button
        newTextDiv.appendChild(newFavoritesButton);
    }


    //append the text div to the card div and return the card div to be used outside this function
    newCardDiv.appendChild(newTextDiv);
    return newCardDiv;
    }


    /*
        this function is to create the html for the page on load / Giphy button at the top of the page
    */
    function createGifPage() {
        //setting the class name back to content so the page will sit right 
        document.getElementById("content").className = "content";

        //set the is giphy variable to true to determine wether or not we are searching giphy or omdb
        isGiphy = true;

        //create the base layout for the content of the page
        document.getElementById("content").innerHTML = `
    <div id="button-container"></div>
    <div id="content-container"></div>
    <div id="search-container">
        <h2 id="add-a-button">Add a button:</h2>
        <input type="text" class="new-button-text-box" id="new-button-text-box"><br>
    </div>`;
        //create a new button, set its text to Submit, set ist className to buttons, and set its id to new-button
        const newButton = document.createElement("button");
        newButton.innerText = "Submit";
        newButton.className = "buttons";
        newButton.id = "new-button";

        //add an event listener to the new button so we may add the textbox value to the list of buttons
        newButton.addEventListener("click", function () {
            //getting the value from the text box and checking if it is empty and if it is popup an alert stating so!
            const value = document.getElementById("new-button-text-box").value.trim();
            if (value.length === 0) return alert("please input text that you would like to search for before pressing submit!");

            //add the value to the gifTerms array
            gifTerms.push(value);

            //create a new button
            let button = document.createElement("button");
            button.textContent = value;
            button.className = "buttons";

            //setting a custom attribute called query-term to the string in the array with the index of i and create a listener for said button
            button.setAttribute("query-term", value);
            createQueryButtonListener(button);

            //append the new button to the passed in html element
            document.getElementById("button-container").appendChild(button);


            //update the local forage data 
            setLists();
        })

        //appending the new button to the search container element 
        document.getElementById("search-container").appendChild(newButton);

        //create the search buttons
        createButtons(gifTerms, document.getElementById("button-container"));
    }