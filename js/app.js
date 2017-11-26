let gameState = {
    cardToMatch: null,
    moves: 0,
    matches: 0,
    MAX_MATCHES: 8,
    stars: 0,
    isAttemptingMatch: false, //true when the user has just flipped over a card and now has a chance to match that card
    incrementMoves : function() {
        //todo 1 move not  moves
        this.moves++;
        $('.moves').text(this.moves);
        //todo inc stars
    },
    setCardToMatch : function(card) {
        this.cardToMatch = card;
        this.isAttemptingMatch = true;
    },
    reset: function () {
        this.cardToMatch = null;
        this.moves = this.matches = this.stars = 0;
        $('.moves').text('0');
    }
};

beginGame();

/*
 * Called when page loads or user clicks the reset button.
 */
function beginGame(){
    let deck = getDeckFromHTML();
    gameState.reset();
    deck = shuffle(deck);
    //deck = attachEventListeners(deck);
    drawDeck(deck);
}

/**
 * Attach event listeners to all card elements and the reset button.
 * @param deck
 * @returns {*|jQuery}
 */
function attachEventListeners(deck) {
    $('.restart').on('click', beginGame);
    return $(deck).on('click', cardClicked);
}

/*
 * Read in array of card elements from index.html
 */
function getDeckFromHTML(){
    return $(".card");
}

/*
 *   Shuffle the card elements.
 *   Shuffle function from http://stackoverflow.com/a/2450976
 */
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
    deck = attachEventListeners(deck);
    $(deck).removeClass('open match show');
    deckNode.append(deck);
}

/**
 * Returns a given card's symbol.
 * @param card
 * @returns {string} the given card's symbol.
 */
function getSymbol(card) {
    return card.children().attr('class').substr(3);
}

function isMatch(card) {
    return getSymbol(card) === getSymbol(gameState.cardToMatch);
}

async function resetMismatchedCards(card) {
    await sleep(250); //allow the user to see the symbol of the card just revealed
    card.on('click', cardClicked);//re-attach event listener
    gameState.cardToMatch.on('click', cardClicked);//re-attach event listener
    card.removeClass("open show");
    gameState.cardToMatch.removeClass("open show");
}

function checkWinCondition() {
    if (gameState.matches === gameState.MAX_MATCHES) {
        console.log("You have won!");
    }
}

function markAsMatched(card) {
    card.addClass("match");
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
    let card = $(this);
    card.off();//must not allow double click of same card to result in a match

    card.addClass("open show");

    if(gameState.isAttemptingMatch){
        if(isMatch(card)){
            gameState.matches++;
            markAsMatched(card);
            markAsMatched(gameState.cardToMatch);
            checkWinCondition();
        }
        else{
            await resetMismatchedCards(card);
        }

        gameState.cardToMatch = null;
        gameState.isAttemptingMatch = false;
    }

    else{
        gameState.setCardToMatch(card);
    }

}

/*
 * Pauses execution a given number of milliseconds.
 * Taken from https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}