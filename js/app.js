/**
 * Keeps track of all important stats related to the game such as number of moves, stars awarded, and number of matches.
 * @type {{cardToMatch: null, moves: number, startTime: Date, matches: number, MAX_MATCHES: number, stars: number, isAttemptingMatch: boolean, incrementMoves: gameState.incrementMoves, setCardToMatch: gameState.setCardToMatch, reset: gameState.reset}}
 */
let gameState = {
    cardToMatch: null,
    moves: 0,
    matches: 0,
    MAX_MATCHES: 8,
    stars: 3,
    startTime: null,
    timerID: null,
    defaultDeck: getDeckFromHTML(),
    unmatchedCards: null,
    isAttemptingMatch: false, //true when the user has just flipped over a card and now has a chance to match that card
    hasClickedFirstCard: false, //timer begins after the user clicks a card for the first time
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
        this.hasClickedFirstCard = this.isAttemptingMatch = false;
        this.cardToMatch = this.startTime = null;
        window.clearTimeout(this.timerID);
        this.moves = this.matches = 0;
        this.stars = 3;
        let starsNode = $('.stars');
        starsNode.empty();
        for(let i = 1; i <= 3; i++)
        {
            starsNode.append("<li><i class='star fa fa-star'></i></li>");
        }
        $('.moves').text('0');
    }
};

beginGame();

/**
 * Show user the time elapsed since beginning the game ever second.
 * @returns {Promise.<void>}
 */
async function showTimeElapsed() {
    while(true) {
        if(!gameState.hasClickedFirstCard){
            $('.time-display').text('0');
            return;
        }
        await sleep(1000);
        $('.time-display').text(getTimeElapsed());
    }
}

/*
 * Called when page loads or user clicks the reset button.
 */
function beginGame(){
    gameState.reset();
    gameState.unmatchedCards = shuffle(gameState.defaultDeck);
    drawDeck(gameState.unmatchedCards);
}

/**
 * User must match all cards in fewer than the threshold number of moves to finish with 1, 2, or 3 stars respectively.
 */
function updateStars() {
    const THREE_STAR_THRESHOLD = 20;
    const TWO_STAR_THRESHOLD = 45;
    let stars = $('.star');
    if(gameState.moves === THREE_STAR_THRESHOLD){
        gameState.stars = 2;
        $(stars[2]).removeClass('fa-star').addClass('fa-star-o');
    }
    else if(gameState.moves === TWO_STAR_THRESHOLD) {
        gameState.stars = 1;
        $(stars[1]).removeClass('fa-star').addClass('fa-star-o');
    }
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
    return $('.card');
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
    let deckNode = $('.deck');
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
    card.removeClass('open show');
}

/**
 * Allow user from being able to click the card to turn it over.
 * @param card
 */
function unlock(card) {
    card.on('click', cardClicked);
}

function unlockUnmatchedCards() {
    for(let i = 0; i < gameState.unmatchedCards.length; i++) {
        let card = $(gameState.unmatchedCards[i]);
        if(!card.hasClass('match')){
            unlock(card);
        }
    }
}

/**
 * After an unsuccessful match attempt, flip both cards back over and re-attach event listeners.
 * @param card
 * @returns {Promise.<void>}
 */
async function resetMismatchedCards(card) {
    await sleep(1000); //allow the user to see the symbol of the card just revealed
    flipFaceDown(card);
    flipFaceDown(gameState.cardToMatch);
}

/**
 * Get the time elapsed between now and when the user began playing.
 * @returns {number}
 */
function getTimeElapsed() {
    const endTime = new Date();
    const timeElapsed_ms = endTime - gameState.startTime;
    return Math.trunc(timeElapsed_ms/1000);//convert ms to sec
}

/**
 * Check if all cards have been matched and display win message if so.
 */
function checkWinCondition() {
    if (gameState.matches === gameState.MAX_MATCHES) {
        $('.btn-primary').on('click', beginGame);
        $('.modal-body').text(`Thank you for playing. You have completed the game in ${getTimeElapsed()} seconds with ${gameState.stars} stars`);
            $('#win-modal').modal();
    }
}
/**
 * Indicate that card has been matches and is now locked by changing its color.
 * @param card
 */
function markAsMatched(card) {
    card.addClass('match');
}
/**
 * Prevent user from being able to click the card to turn it over.
 * @param cards
 */
function lock(card) {
            card.off();
}

/**
 * Prevent user from being able to click cards to turn them over.
 * @param cards
 */
function lockCards(cards) {
        for (let card of cards) {
            card.off();
        }
}

function lockAllCards() {
    $('.card').off();
}

/**
 * Flip card face up, revealing its symbol.
 * @param card
 */
function flipFaceUp(card) {
    card.addClass('open show');
}

/**
 * Start keeping track of the time the user takes to win the game once they overturn their first card.
 */
function startTimer() {
    gameState.startTime = new Date();
    gameState.timerID = setTimeout(showTimeElapsed);
}
/*
 * Implementation of game logic whe user clicks a card.
 *
 * If a card is clicked:
 *  - display the card's symbol.
 *  - keep track of the overturned card's symbol
 *  - if the user has just overturned another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position.
 *    + if the cards do not match, hide the card's symbol.
 *    + increment the move counter and display it on the page.
 *    + if all cards have matched, display a modal with the final score.
 */
async function cardClicked() {
    let card = $(this);
    lock(card);//must not allow double click of same card to result in a match
    if(!gameState.hasClickedFirstCard){
        gameState.hasClickedFirstCard = true;
        startTimer();
    }

    gameState.incrementMoves();
    flipFaceUp(card);

    if(gameState.isAttemptingMatch){
        lockAllCards();
        gameState.isAttemptingMatch = false;

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
        unlockUnmatchedCards();
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