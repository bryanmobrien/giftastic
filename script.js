console.log('LEARNING SOME STUFF');

const queryURL = "https://api.giphy.com/v1/gifs/trending?api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9"

const getGifs4 = (url) => {
  return fetch(url).then((response) => {
    return response.json()
  })
}

const allTheGifsAreBelongToUs = async () => {
  const responseJson1 = await getGifs4(queryURL)
  const responseJson2 = await getGifs4(queryURL)
  const responseJson3 = await getGifs4(queryURL)
  const responseJson4 = await getGifs4(queryURL)
  const responseJson5 = await getGifs4(queryURL)
  const responseJson6 = await getGifs4(queryURL)

  console.log(responseJson1);
  console.log(responseJson2);
  console.log(responseJson3);
  console.log(responseJson4);
  console.log(responseJson5);
  console.log(responseJson6);
}
allTheGifsAreBelongToUs();

// ['a', 'b'].map(async (url) => {
//   const responseJson1 = await getGifs4(url)
//   const responseJson2 = await getGifs4(url)
// })