// A Deck can {be shuffled}, {draw a card (return)}
// and {be reshuffled from its discard pile}
function Deck(array) {
	this.cards=array;
	this.discardPile=[];
}

Deck.prototype.shuffle = function() {
	
	var currentIndex = this.cards.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = this.cards[currentIndex];
		this.cards[currentIndex] = this.cards[randomIndex];
		this.cards[randomIndex] = temporaryValue;
	}
}

Deck.prototype.draw = function() {
	if (this.cards.length<=0) this.reshuffle();
	
	result=this.cards[0];
	this.cards.splice(0,1);
	return result;
}

Deck.prototype.reshuffle = function() {
	console.log("Reshuffle tortent!");
	for (var i=this.discardPile.length-1; i>=0; i--) {
		this.cards.push(this.discardPile[i]);
		this.discardPile.splice(i,1);
	}
	Match.deck.shuffle();
}