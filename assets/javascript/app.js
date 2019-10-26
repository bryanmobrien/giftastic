// Main javascript page of the application.  
// Please note:  you may have to clear your localStorage (cookies, etc) for all 
// elements to display correctly

//make variables for apikeys for giphy and OMDB APIs
const giphyApiKey = "YCHVj1EUgEZWWhFbelsQUvGzRFDwUrvo";
const omdbApoKey = "46bf5986";

//config variables for searches
const ratings = "&rating=g&rating=pg&rating=pg-13";
const limit = 10;

//this is used for the more button on the giphy page to add more gif's to the page
let offset = 0;

// OMDB config items.  These will be the initial buttons displayed to the user
// on the OMDB page
let omdbTerms = ["Unforgiven", "High Noon", "Tombstone", "The Good, The Bad, and The Ugly", "The Wild Bunch"];
let plot = "short";

// giphy configuration items.  These will be the initial buttons displayed to the user
// on the giphy page. 
let gifTerms = ["car","truck","plane","train","motorcyle","skateboard"];
let isGiphy = true;

// creates an empty array for the user's favorites to be stored
let favoritesArr = [];

let lastQuery = "";

//get the data for the page and if not set the data for the page 
getLists();

//when the giphy nav button is pressed
document.getElementById("giphy-nav-button").addEventListener("click", function(){
    //set the classlist of all of the buttons back to default except the giphy button add navButton-clicked to the button so it appears clicked
    document.getElementById("giphy-nav-button").classList = "navButton borderRight navButton-clicked";
    document.getElementById("omdb-nav-button").classList = "navButton borderRight";
    document.getElementById("favorites-nav-button").classList = "navButton";
    //create the gif view 
    createGifPage();
})

document.getElementById("omdb-nav-button").addEventListener("click", function(){
    //Set the classlist of all of the buttons back to default except the omdb button add navButton-clicked to the button so it appears clicked
    document.getElementById("giphy-nav-button").classList = "navButton borderRight";
    document.getElementById("omdb-nav-button").classList = "navButton borderRight navButton-clicked";
    document.getElementById("favorites-nav-button").classList = "navButton";
    //create the omdb view on the page
    createOmdbHtmlPage();
})

document.getElementById("favorites-nav-button").addEventListener("click", function(){
    // Set the classlist of all of the buttons back to default except the favorites button 
    // add navButton-clicked to the button so it appears clicked
    document.getElementById("giphy-nav-button").classList = "navButton borderRight";
    document.getElementById("omdb-nav-button").classList = "navButton borderRight";
    document.getElementById("favorites-nav-button").classList = "navButton navButton-clicked";
    //create the favorites view on the page
    createFavoritesView();
})

function getLists(){
    localforage.getItem("data").then(function(value){
        omdbTerms = value.omdbTerms;
        gifTerms = value.gifTerms;
        favoritesArr = value.favoritesArr;
        console.log(value)
        //create the gif page as the default view on page load
        createGifPage();
    }).catch(function(err){
        setLists();
        //create the gif page as the default view on page load
        createGifPage();
    })
}

function setLists(){
    localforage.setItem("data", {
        omdbTerms: omdbTerms,
        gifTerms: gifTerms,
        favoritesArr: favoritesArr
    });
}