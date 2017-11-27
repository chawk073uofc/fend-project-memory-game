/**
 * User must match all cards in fewer than the threshold number of moves to finish with 1, 2, or 3 stars respectively.
 */
function updateStars() {
    const THREE_STAR_THRESHOLD = 20;
    const TWO_STAR_THRESHOLD = 45;
    const ONE_STAR_THRESHOLD = 75;
    let stars = $('.star');
    if(gameState.moves === THREE_STAR_THRESHOLD){
        $(stars[2]).removeClass("fa-star").addClass("fa-star-o");
    }
    else if(gameState.moves === TWO_STAR_THRESHOLD) {
        $(stars[1]).removeClass("fa-star").addClass("fa-star-o");
    }
    else if(gameState.moves === ONE_STAR_THRESHOLD) {
        $(stars[0]).removeClass("fa-star").addClass("fa-star-o");
    }
}

let gameState = {
    cardToMatch: null,
    moves: 0,
    matches: 0,
    MAX_MATCHES: 8,
    stars: 0,
    isAttemptingMatch: false, //true when the user has just flipped over a card and now has a chance to match that card
    incrementMoves : function() {
        this.moves++;
        $('.move-label').text((this.moves === 1) ? 'Move' : 'Moves');
        $('.moves').text(this.moves);
        updateStars();
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
    $("#win-modal").modal();
    let deck = getDeckFromHTML();
    gameState.reset();
    deck = shuffle(deck);
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
    let deckNode = $(".deck");
    deckNode.empty(); //clear default deck from the DOM
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
/*
 * Determine if the card has been matched (most recently revealed card has the same symbol as the second most recently revealed card).
 */
function isMatch(card) {
    return getSymbol(card) === getSymbol(gameState.cardToMatch);
}
/*
 * Hide card symbol.
 */
function flipFaceDown(card) {
    card.removeClass("open show");
}

/**
 * Re-attach event listener.
 * @param card
 */
function unlock(card) {
    card.on('click', cardClicked);
}

/**
 * After an unsuccessful match attempt, flip both cards back over and re-attach event listeners.
 * @param card
 * @returns {Promise.<void>}
 */
async function resetMismatchedCards(card) {
    await sleep(250); //allow the user to see the symbol of the card just revealed
    unlock(card);//re-attach event listener
    unlock(gameState.cardToMatch);//re-attach event listener
    flipFaceDown(card);
    flipFaceDown(gameState.cardToMatch);
}

/**
 * Check if all cards have been matched and display win message if so.
 */
function checkWinCondition() {
    if (gameState.matches === gameState.MAX_MATCHES) {
        console.log("You have won!");
    }
}
/**
 * Indicate that card has been matches and is now locked by changing its color.
 * @param card
 */
function markAsMatched(card) {
    card.addClass("match");
}

function lock(card) {
    card.off();
}

function flipFaceUp(card) {
    card.addClass("open show");
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
    let card = $(this);

    gameState.incrementMoves();
    lock(card);//must not allow double click of same card to result in a match
    flipFaceUp(card);

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