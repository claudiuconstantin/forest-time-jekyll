//This file is dead, but kept for future reference

function Card() {
	// //Properties
	// this.name="New card";
	// this.attack=1;
	// this.health=1;
	// this.description="Attacks.";
	
	// //Sleeping
	// this.sleep=true;
	
	// //Visual !!hardcode

	// 	this.nameTag = 
	// 		new createjs.Text(this.name, "bold 18px Arial", "#333");
	// 	this.nameTag.textAlign="center";
	// 	this.nameTag.setTransform(100,165);

	// 	this.descriptionTag = 
	// 		new createjs.Text(this.description, "bold 14px Arial", "#333");
	// 	this.descriptionTag.textAlign="center";
	// 	this.descriptionTag.setTransform(100,228);
	// 	this.descriptionTag.lineWidth=160;
	// 	this.descriptionTag.textBaseline="middle";

	// 	this.attackTag = 
	// 		new createjs.Text(this.attack, "bold 18px Arial", "#fff");
	// 	this.attackTag.textAlign="center";
	// 	this.attackTag.setTransform(28,188);

	// 	this.healthTag = 
	// 		new createjs.Text(this.health, "bold 18px Arial", "#fff");
	// 	this.healthTag.textAlign="center";
	// 	this.healthTag.setTransform(170,188);

	// 	this.craftDate=2016;

		
	
	// //Sounds
	// this.playSound="";
	// this.attackSound="";
	// this.dieSound="";


}

Card.prototype.attack = function() {
	console.log("Attack!");
}

Card.prototype.ability = function() {
	//Do something...
	//Animate
}

Card.prototype.die = function() {
	//Animate
	//Splice from battlefield
}