var gameState = {
    symbolToMatch: null,//the symbol on the card that was just flipped
    cardToMatch: null,
    moves: 0,
    matches: 0,
    MAX_MATCHES: 8,
    stars: 0,
    isAttemptingMatch: false, //true when the user has just flipped over a card and now has a chance to match that card
    incrementMoves : function() {
        this.moves++;
        $('.moves').text(this.moves);
        //inc stars
    },
    setCardToMatch : function(card, symbol) {
        this.cardToMatch = card;
        this.isAttemptingMatch = true;
        this.symbolToMatch = symbol;
    },
    reset: function () {
        $('.restart').on('click', beginGame);
        this.symbolToMatch = this.cardToMatch = null;
        this.moves = this.matches = this.stars = 0;
        $('.moves').text('0');
    }
};

beginGame();

/*
 * Creates a list that holds all cards. Called when the user first loads the page or presses the 'reset' or 'play again' buttons.
 */
function beginGame(){
    gameState.reset();
    var deck = getDeckFromHTML();
    deck = shuffle(deck);
    //deck = attachEventListeners(deck);
    drawDeck(deck);
}

function attachEventListeners(deck) {
    //$(deck[0]).on('click', cardClicked);
    deck.map(card => {$(card).on('click',cardClicked)});
    //return deck;
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
    //attachEventListeners(deck);
    //$(deck[0]).on('click', cardClicked);
    for(i = 0; i < deck.length; i++) {
        $(deck[i]).on('click', cardClicked);
    }
    //$(deck).map(card => {$(card).on('click',cardClicked)});
    //add the shuffled deck
    deckNode.append(deck);
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
async function cardClicked() {
    gameState.incrementMoves();
    console.log("card clicked!" + this);
    let card = $(this);
    card.off();//must not allow double click of same card to result in a match
    card.addClass("open show");
    let symbol = getSymbol(card);

    if(gameState.isAttemptingMatch){
        //TODO: refactor here
        if(symbol === gameState.symbolToMatch){
            gameState.matches++;
            card.addClass("match");
            gameState.cardToMatch.addClass("match");

            //check win condition
            if(gameState.matches == gameState.MAX_MATCHES){
                console.log("You have won!");
            }
        }
        else{
            //TODO: extract method
            await sleep(250);
            card.on('click', cardClicked);//re-attach event listener
            gameState.cardToMatch.on('click', cardClicked);//re-attach event listener
            card.removeClass("open show");
            gameState.cardToMatch.removeClass("open show");
        }
        gameState.symbolToMatch = null;
        gameState.cardToMatch = null;
        gameState.isAttemptingMatch = false;
    }

    else{
        gameState.setCardToMatch(card, symbol);
    }

}

/*
 * Pauses execution a given number of milliseconds.
 * Taken from https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}