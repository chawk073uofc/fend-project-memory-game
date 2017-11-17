beginGame();
/*
 * Creates a list that holds all cards. Called when the user first loads the page or presses the 'reset' or 'play again' buttons.
 */
function beginGame(){
    console.log("entering beginGame");
    var deck = getDeckFromHTML();
    deck = shuffle(deck);
    console.log(deck);
    drawDeck(deck);
    console.log(deck);
}
/*
 * Read in array of card elements from index.html
 */
function getDeckFromHTML(){
    return $(".card");
}
function test() {
    console.log("dkdkdkdkdk");
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*
 * Create the necessary DOM elements to represent the cards and attach event listeners.
 */
function drawDeck(deck) {

    //clear default deck from the DOM
    let deckNode = $(".deck");
    deckNode.empty();
    //add the shuffled deck
    deckNode.append(deck);
    //attach event listeners
    deckNode.on('click', '.card', cardClicked);
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function cardClicked() {
    console.log("card clicked!");
    console.log(this);
    $(this).addClass("open");
    //if face up
        //do nothing, console msg
    //else if last flipped == null
        //flip face up
    //else if other card just flipped - lastFlipped != null

        // compare cards

}

function compareFlippedCards(card1, card2) {
    //moves++
    //if(card1 != card2) {
        //flip face down(card1)
        //flip face down(card2)

}

function resetClicked() {

}

function flipFaceUp(index) {

}
function unflipFaceDown() {

}