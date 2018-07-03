Rancor.prototype = Object.create(Card.prototype);
Rancor.prototype.constructor=Rancor;

function Rancor(){

	Card.call(this);

	//Properties
	this.cardname = "rancor"; //used for paths
	this.name="Rancor";
	this.originalAttack=5;
	this.originalHealth=13;
	this.attack=this.originalAttack;
	this.health=this.originalHealth;
	this.sleep=true;
	this.description="";

	//Visuals
		//Cardback
		this.cardback = 
				new createjs.Bitmap(Preloader.pull("material/img/card.png"));
		this.cardback.setTransform(-25, 0, 0.6 , 0.6);
		this.cardback.shadow = new createjs.Shadow("rgba(0,0,0,0.7)", 0, 0, 35);
		
		//Thumbnail
		this.thumbnail = 
				new createjs.Bitmap(Preloader.pull("material/img/cards/" + this.cardname + "_thumbnail.png"));
		this.thumbnail.setTransform(10,10, .30, .32);		
		
		//Text (tags)
		this.nameTag = 
				new createjs.Text(this.name, "bold 18px Arial", "#333");
		this.nameTag.textAlign="center";
		this.nameTag.setTransform(100,161);

		this.descriptionTag = 
			new createjs.Text(this.description, "bold 14px Arial", "#333");
		this.descriptionTag.textAlign="center";
		this.descriptionTag.setTransform(100,228);
		this.descriptionTag.lineWidth=160;
		this.descriptionTag.textBaseline="middle";

		this.attackTag = 
			new createjs.Text(this.originalAttack, "bold 18px Arial", "#fff");
		this.attackTag.textAlign="center";
		this.attackTag.setTransform(17,283);

		this.healthTag = 
			new createjs.Text(this.originalHealth, "bold 18px Arial", "#fff");
		this.healthTag.textAlign="center";
		this.healthTag.setTransform(187,283);

		//Card Container
		this.card = new createjs.Container();
		this.card.x=0;
		this.card.addChild(this.cardback, this.thumbnail, this.nameTag, this.descriptionTag, this.attackTag, this.healthTag);

		//Card.Unit Container 
		this.unit = new createjs.Container();
		this.unit.x=0;
		
		this.unit.miniCard=this.card;
		this.unitFrame = new createjs.Shape();
		this.unitFrame.graphics.f(Animate.unitFramecolor).de(-8,-8,113,143);
		this.unitFrame.shadow = new createjs.Shadow("rgba(0,0,0,0.7)", 0, 0, 35);
		this.avatar = 
			new createjs.Bitmap(Preloader.pull("material/img/cards/"+ this.cardname +"_thumbnail.png"));
		this.avatar.setTransform(0,0,.16,.28);
		

		this.metaTag =
			new createjs.Text(this.attack + " / " + this.health, "16px Arial", Animate.metacolor);
		this.metaTag.textAlign="center";
		this.metaTag.setTransform(48,108);

		this.unit.addChild(this.unitFrame, this.avatar, this.metaTag);

		this.unit.on("mouseover", function(e){
			this.miniCard.setTransform(this.x-50, this.y+120, 1, 1);
			Animate.hover(this);
			Game.stage.addChild(this.miniCard);
			
		});

		this.unit.on("rollout", function(){
				Game.stage.removeChild(this.miniCard);
				Animate.unhover(this);
			});
	//end of Visuals

	this.card.on("click", function(e){
		Hand.pick(this.order);
	});
}

Rancor.prototype.ability = function() {
	if (!this.sleep) Abilities.attack(this);
		else this.sleep=false;
}