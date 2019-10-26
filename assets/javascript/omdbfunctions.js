function createOmdbHtmlPage(){
    //setting the class name back to content so the page will sit right 
    document.getElementById("content").className = "content";
    
    //get the content element of the html, and set its inner html to nothing
    const contentHTML = document.getElementById("content");
    contentHTML.innerHTML = "";

    isGiphy = false;

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
    newButton.addEventListener("click", function(){
        //getting the value from the text box and checking if it is empty and if it is popup an alert stating so!
        const value = document.getElementById("new-button-text-box").value.trim();
        if(value.length === 0) return alert("please input text that you would like to search for before pressing submit!");

        //add the value to the gifTerms array
        omdbTerms.push(value);

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
    createOmdbButtons(omdbTerms, document.getElementById("button-container"));
}

/*
    this function creates the buttons for the top of the page
*/
function createOmdbButtons(arr, toAppendHTML){
    //loop through the passed in array to create a button for each item 
    for(let i = 0; i<arr.length; i++){
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
    this function searches giphy for the passed in query term
*/
function searchOmdb(queryTerm){
    //generate the queryUrl with the apikey (global variable), query term (argument), limit (global variable), and ratings (global variable)
    const queryUrl = `https://www.omdbapi.com/?apikey=${omdbApoKey}&t=${queryTerm}&plot=${plot}`;

    //use the newly created queryUrl to fetch the requested movie from omdb
    fetch(queryUrl)

        //magic LOL - really though here we are converting the response to json via a method that i have not learned about yet 
        .then(response => {
            return response.json();
        })

        //after we converted the data to an actual object then we can work with it
        .then(responseJson => {
           console.log(responseJson);
           createMovieView(responseJson);
        })
}

//create the movie view for the page
function createMovieView(data){
    //clear the content on the page 
    document.getElementById("content-container").innerHTML = "";

    //create a new div to house everything, and set a id of "movie-div"
    const newDiv = document.createElement("div");
    newDiv.id = "movie-div";

    //set the html of the div using the string concatenation below
    newDiv.innerHTML = `
        <h1 id="movie-title">Title: ${data.Title}<hr></h1>
        <h3>Rating: ${data.Rated}</h3>
        <h3>Runtime: ${data.Runtime}</h3>
        <h3>Released: ${data.Released}</h3>
        <h3>Production Company: ${data.Production}</h3>
        <h3>BoxOffice: ${data.BoxOffice}</h3>
        <p><a id="plot-text">Plot:</a> ${data.Plot}</p>
        <img src="${data.Poster}">
    `;
    
    //add the new div to the content container on the page so it can be seen
    document.getElementById("content-container").appendChild(newDiv);
}