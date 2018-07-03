// The Preloader can {preload assets}, {update on progress}
// and {pull from the result of the queue}

var Preloader = {
	queue : new createjs.LoadQueue(true),

	loadText : new createjs.Text("", "32px Arial", "#fff"),
	
	preload:function(){
		//HTML control
		var randomText=document.getElementById("randomText");
		var percentage=document.getElementById("percentage");

		this.queue.installPlugin(createjs.Sound);

		//Texts to display (could be more than one)
		var progressTexts=[
			"A long time ago in a galaxy far far away..."
		];
		randomIndex=(Math.round(Math.random()*(progressTexts.length-1)));
		randomText.innerHTML=progressTexts[randomIndex];

		//Show loading text
		Game.stage.addChild(this.loadText),
		this.queue.installPlugin(createjs.Sound),
		
		this.queue.on("progress", this.progress, this);
		this.queue.on("complete", this.complete, this);

		//Load manifest
		this.queue.installPlugin(createjs.Sound);
		this.queue.loadManifest([

			//Images
			"material/img/avatar_thumbnail.png",
			"material/img/card.png",
			"material/img/background-01.png",
			"material/img/menu-01.png",
			"material/img/menu-02.png",
			"material/img/menu-03.png",
			"material/img/menu-04.png",
			"material/img/rulesheet.png",
			"material/img/rulesheet2.png",
			"material/img/victory.png",

			//Sounds
			{id:"draw", src:"material/sound/draw.wav"},
			{id:"select", src:"material/sound/select.ogg"},
			{id:"hover", src:"material/sound/hover.ogg"},
			{id:"menu", src:"material/sound/menu.mp3"},
			{id:"victory", src:"material/sound/victory.mp3"},

			//Card images
			"material/img/cards/stormtrooper_thumbnail.png",
			"material/img/cards/rancor_thumbnail.png",
			"material/img/cards/ewok_thumbnail.png",
			"material/img/cards/atst_thumbnail.png",
			
			//Objects
			"js/Ticker.js",
			"js/Deck.js",
			"js/Hand.js",
			"js/Match.js",
			"js/Player.js",
			"js/Card.js",
			"js/Animate.js",
			"js/Abilities.js",

			//Cards
			"js/Cards/Stormtrooper.js",
			"js/Cards/Rancor.js",
			"js/Cards/Ewok.js",
			"js/Cards/ATST.js"
		])
	},

	progress:function(e){
		percentage.innerHTML=(Math.round(e.progress*100))+"%";
	},

	complete:function(e){
		document.getElementById("randomText").style.display="none";
		document.getElementById("percentage").style.display="none";
		document.getElementById("myCanvas").style.display="block";
		Game.setup()
	},

	pull: function(object){
		return this.queue.getResult(object);
	}
};
	

