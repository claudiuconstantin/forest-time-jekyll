//This file is dead, but kept for future reference

var Cardbuilder = {
	build: function(newcard) {
		newcard.cardback = 
				new createjs.Bitmap(Preloader.pull("material/img/card.png"));
		newcard.cardback.setTransform(0,0,0, 0);
		newcard.cardback.shadow = new createjs.Shadow("rgba(0,0,0,0.7)", 0, 0, 35);
		
		//Thumbnail
		newcard.thumbnail = 
				new createjs.Bitmap(Preloader.pull("material/img/cards/" + newcard.cardname + "_thumbnail.png"));
		newcard.thumbnail.setTransform(37,13, .20, .20);		
		
		//Text (tags)
		newcard.nameTag = 
				new createjs.Text(newcard.name, "bold 18px Arial", "#333");
		newcard.nameTag.textAlign="center";
		newcard.nameTag.setTransform(100,165);

		newcard.descriptionTag = 
			new createjs.Text(newcard.description, "bold 14px Arial", "#333");
		newcard.descriptionTag.textAlign="center";
		newcard.descriptionTag.setTransform(100,228);
		newcard.descriptionTag.lineWidth=160;
		newcard.descriptionTag.textBaseline="middle";

		newcard.attackTag = 
			new createjs.Text(newcard.originalAttack, "bold 18px Arial", "#fff");
		newcard.attackTag.textAlign="center";
		newcard.attackTag.setTransform(28,188);

		newcard.healthTag = 
			new createjs.Text(newcard.originalHealth, "bold 18px Arial", "#fff");
		newcard.healthTag.textAlign="center";
		newcard.healthTag.setTransform(170,188);

		//Card Container
		newcard.card = new createjs.Container();
		newcard.card.x=0;
		newcard.card.addChild(newcard.cardback, newcard.thumbnail, newcard.nameTag, newcard.descriptionTag, newcard.attackTag, newcard.healthTag);

		//Card.Unit Container 
		newcard.unit = new createjs.Container();
		newcard.unit.x=0;
		
		newcard.unit.miniCard=newcard.card;
		newcard.unitFrame = new createjs.Shape();
		newcard.unitFrame.graphics.f(Animate.unitFramecolor).de(-8,-8,113,143);
		newcard.unitFrame.shadow = new createjs.Shadow("rgba(0,0,0,0.7)", 0, 0, 35);
		newcard.avatar = 
			new createjs.Bitmap(Preloader.pull("material/img/cards/"+ newcard.cardname +"_thumbnail.png"));
		newcard.avatar.setTransform(0,0,.15,.15);
		

		newcard.metaTag =
			new createjs.Text(newcard.attack + " / " + newcard.health, "16px Arial", Animate.metacolor);
		newcard.metaTag.textAlign="center";
		newcard.metaTag.setTransform(48,108);

		newcard.unit.addChild(newcard.unitFrame, newcard.avatar, newcard.metaTag);

		newcard.unit.on("mouseover", function(e){
			newcard.miniCard.setTransform(newcard.x-50, newcard.y+120, 1, 1);
			Animate.hover(newcard);
			Game.stage.addChild(newcard.miniCard);
			
		});

		newcard.unit.on("rollout", function(){
				Game.stage.removeChild(newcard.miniCard);
				Animate.unhover(newcard);
			});
	//end of Visuals

		newcard.card.on("click", function(e){
			Hand.pick(newcard.order);
		});

		return newcard.card;
	}
}