// The Ticker can {be started}, {save a checkpoint},
// {set its framerate}, {iterate a given function}
// and {update the frame}

var Ticker = {
	framerate: 60,
	checkpoint: 0,
	start: function(){
		//Save checkpoint
		// this.checkpoint();

		//Start the ticker
		createjs.Ticker.setFPS(this.framerate);
		createjs.Ticker.on("tick", this.updateFrame);
	},
	checkpoint:function(){
		this.checkpoint=createjs.Ticker.getTicks();
	},
	setFPS: function(framerate){
		//Change framerate
		this.framerate=framerate;
		createjs.Ticker.setFPS(this.framerate);
	},
	iterate: function(seconds, functionCall) {
		framerates = this.framerate * seconds
		if ((createjs.Ticker.getTicks())  % framerates == 0)
			functionCall();
	},
	updateFrame: function(e){
		switch(Game.scene) {
			case 0:
				// console.log("ok");
				break;
			case 1:
				console.log("case 2");
				break;
		}
		Game.stage.update();
	}
};