// A Player can {play a card}

function Player(name) {
	this.name=name;
	this.health=30;
	this.units=[];
	this.alive=true;
}

//Play a card
Player.prototype.play = function(field) {
	if (Hand.selected !== null) {
		
		//Remove field graphics
		Game.stage.removeChild(this.units[field.position]);
		
		//Move card.unit to field
		Animate.play(field.owner, Hand.cards[Hand.selected], field.position);
		console.log("%c" + this.name + " has played a " + Hand.cards[Hand.selected].name + "(" + field.position + ")!", "font-weight: bold");
		
		//Replace player's unit from a field to card
		this.units[field.position]= Hand.cards[Hand.selected];

		//Unselect and pass turn
		Hand.cards[Hand.selected]=null;
		setTimeout(function(){Match.passTurn();}, Animate.delay);

	}
}