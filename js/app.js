let symbolToMatch;//the symbol on the card that was just flipped
let cardToMatch
let moves = 0;
let matches = 0;
const MAX_MATCHES = 8;
let stars;
let isAttemptingMatch = false; //true when the user has just flipped over a card and now has a chance to match that card
beginGame();
/*
 * Creates a list that holds all cards. Called when the user first loads the page or presses the 'reset' or 'play again' buttons.
 */
function beginGame(){
    //clear stats
    var deck = getDeckFromHTML();
    deck = shuffle(deck);
    drawDeck(deck);
}
/*
 * Read in array of card elements from index.html
 */
function getDeckFromHTML(){
    return $(".card");
}
function test() {
    console.log("test test test");
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
    //deckNode.on('click', '.card', cardClicked);
}

function getSymbol(card) {
    return card.children().attr('class').substr(3);
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the ope n position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
async function cardClicked(thisCard) {
    //TODO: detach event listener
    moves++;
    console.log("card clicked!" + this);
    let card = $(thisCard);
    card.addClass("open show");
    let symbol = getSymbol(card);

    //must not allow double click of same card to result in a match
    if(isAttemptingMatch){
        if(symbol === symbolToMatch){
            matches++;
            card.addClass("match");
            cardToMatch.addClass("match");

            //check win condition
            if(matches == MAX_MATCHES){
                console.log("You have won!");
            }
        }
        else{

            card.on('click', cardClicked);//re-attach event listener
            cardToMatch.on('click', cardClicked);//re-attach event listener
            await sleep(250);
            card.removeClass("open show");
            cardToMatch.removeClass("open show");
        }
        symbolToMatch = null;
        cardToMatch = null;
        isAttemptingMatch = false;
    }

    else{
        card.off();//disalow double click of same card to result in a match
        cardToMatch = card;
        symbolToMatch = symbol;
        isAttemptingMatch = true;
    }

}

function resetClicked() {

}
/*
 * Pauses execution a given number of milliseconds.
 * Taken from https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}