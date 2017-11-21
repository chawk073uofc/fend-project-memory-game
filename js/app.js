let symbolToMatch;//the symbol on the card that was just flipped
let cardToMatch
let moves = 0;
let stars;
let isAttemptingMatch = false; //true when the user has just flipped over a card and now has a chance to match that card
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

function isMatch(card, cardlToMatch) {
    let symbol = $(card).children().first().attr('class').split(' ')[1];
    console.log("in is match - card symbol = " + symbol);
    return cardlToMatch.children().first().hasClass(symbol);
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
function cardClicked() {
    moves++;
    console.log("card clicked!" + this);
    let card = $(this);
    let symbol = getSymbol(card);
    card.addClass("open show");

    //must not allow double click of same card to result in a match
    if(isAttemptingMatch){
        if(symbol === symbolToMatch){
            card.addClass("match");
            cardToMatch.addClass("match");
            card.unbind();

            //check win condition
        }
        else{
            card.on('click', cardClicked);//re-attach event listener
            cardToMatch.on('click', cardClicked);//re-attach event listener
            card.removeClass("open show");
            cardToMatch.removeClass("open show");
        }
        symbolToMatch = null;
        cardToMatch = null;
        isAttemptingMatch = false;
    }

    else{
        card.unbind();//disalow double click of same card to result in a match
        cardToMatch = card;
        symbolToMatch = symbol;
        isAttemptingMatch = true;
    }

}

function resetClicked() {

}
