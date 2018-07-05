// Space Invaders with EaselJS by Gabor Pinter
// -------------------------------
// 0. Global variables
// I. Initialize document
// II. Set up "gameboard"
// III. Update screen (scenes)
// 		III. X.: Transparent things (available on all scenes)
// 		III. 0.: Main menu
// 		III. 1.: Animation
// 		III. 2.: Gameplay
// 		III. 3.: Game Over

// 0. Global variables
	var framerate =60; 

	var stage, scene, score, lives, spaceship, 
		enemies, bullets, meteors, stars, explosions, gameStartDate;

	var keys = {
		cLeft: false,
		cRight: false,
		cUp: false,
		cDown: false
	}

	var queue = new createjs.LoadQueue();
	queue.on('progress', onProgress);
	queue.on('complete', onComplete);
	var progressText;

// I. Initailaze document & Preload
	function init() {
		//Defining stage
		stage = new createjs.Stage("myCanvas");
		progressText = new createjs.Text("0%", "24px Arial", "#fff");
		progressText.x=stage.canvas.width/2;
		progressText.y=stage.canvas.height/2;
		stage.addChild(progressText);
		stage.update();

		//Preloader
		loadManifest();
	}

	function loadManifest(){
		queue.loadManifest([
			{
				id: 'spaceshipSprite',
				src: 'spaceship.png'
			},

			{
				id: 'alienSprite',
				src: 'alien.png',
			},

			 {
			 	id: 'meteorSprite',
			 	src: 'meteor.png'
			 }
		])
	}

	function onProgress(e) {
		var progress = Math.round(e.loaded*100);
		console.log(progress);
		progressText.text=progress+"%";
		stage.update();
	}

	function onComplete(e) {
		console.log("Everything loaded. Starting the game.");

		//Set up game
		gameSetup();	

		//Then set and launch a ticker
		createjs.Ticker.setFPS(framerate);
		createjs.Ticker.addEventListener("tick", updateFrame);
	}

// II. Set up Game
	function gameSetup() {

		stage.removeAllChildren();
		enemies = [];
		bullets = [];
		meteors = [];
		explosions = [];
		stars = [];
		score = 0;
		lives = 3;
		keys.cLeft = false;
		keys.cRight = false;
		keys.cUp = false;
		keys.cDown = false;


		//Draw stars
		startingStars=24;
		for (var i=0; i<startingStars; i++){
			
			//Create big and small stars
			star = new createjs.Shape();
			star.size=i%2+1; //can be 1 or 2
			star.graphics.f("#eee").dc(0,0,star.size);
			star.speed= 0.25* star.size; //can be 0.25 or 0.5
			star.regX=star.size/2;
			star.regY=star.size/2;
			star.x=Math.floor(Math.random()*(stage.canvas.width-star.size)+star.size/2);
			star.y=Math.floor(Math.random()*(stage.canvas.height-star.size)+star.size/2);
			stage.addChild(star);
			stars.push(star);
		}

		//Create spaceship
		spaceship = new createjs.Bitmap(queue.getResult("spaceshipSprite"));
		// spaceship= new createjs.Shape();

		spaceship.size=50;
		// spaceship.graphics.f("yellow").dr(0,0,spaceship.size, spaceship.size);
		spaceship.speed=2;
		spaceship.regX=spaceship.size/2;
		spaceship.regY=spaceship.size/2;
		spaceship.x=stage.canvas.width/2;
		spaceship.y=stage.canvas.height+spaceship.size/2;
		stage.addChild(spaceship);

		scoreText = new createjs.Text("Score: "+score, "20px Arial", "#fff");
		scoreText.baseline="alphabetic";
		scoreText.textAlign="left";
		scoreText.x=10;
		scoreText.y=10;

		livesText = new createjs.Text("Lives: "+lives, "20px Arial", "#fff");
		livesText.baseline="alphabetic";
		livesText.textAlign="right";
		livesText.x=stage.canvas.width - 10;
		livesText.y=10;
		

		title = new createjs.Text("Space Invaders - Press space to start", "24px Arial", "#fff");
		title.textAlign="center";
		title.x=stage.canvas.width/2;
		title.y=stage.canvas.height/2-30;
		stage.addChild(title);

		instructions = new createjs.Text("Use the arrow keys to move your spaceship. Press space to shoot. Don't let aliens reach the bottom of the screen. Avarage score of players: 800", "18px Arial", "#fff");
		instructions.textAlign="center";
		instructions.lineWidth=400;
		instructions.x=stage.canvas.width/2;
		instructions.y=stage.canvas.height/2+30;
		stage.addChild(instructions);

		scene=0;

	}

// III. Update screen
	function updateFrame() {

		//X.Transparent elements
		inSeconds(.5, spawnStar);
		moveArray(stars);
		fadeExplosions();

		//Scenes
		switch(scene) {
			//0.Main menu
			case 0: 
				mainMenu();
				break;

			//1.Animation
			case 1:
				revealSpaceship();
				break;
			
			//2.Gameplay
			case 2:
				inSeconds(2, spawnEnemy);
				inSeconds(3, spawnMeteor);
				moveArray(bullets);
				moveArray(enemies);
				moveArray(meteors);
				rotateArray(meteors);
				controlSpaceship();
				checkHits();
				
				
				
				break;

			//3.Game Over
			case 3:
				gameOver();
				moveArray(enemies);
				moveArray(bullets);
				moveArray(meteors);
				rotateArray(meteors);
				break;
		}

		stage.addChild(scoreText);
		stage.addChild(livesText);

		stage.update();
	}

	//X.Transparent functions
		
		//Call a given function in every given seconds
		function inSeconds(seconds, functionName) {
			if (createjs.Ticker.getTicks()/framerate % seconds == 0) {
				functionName();
			}
		}

		//Calculate movement to adjust it to the framerate
		function calcMovement(speed){
			return speed / framerate * 60;
		}

		//Spawn an enemy
		function spawnEnemy() {0
			enemy=new createjs.Bitmap(queue.getResult("alienSprite"));
			enemy.size=64;
			enemy.speed=1 + ((Math.floor((createjs.Ticker.getTicks()-gameStartDate)/60))*0.01);
			enemy.pointWorth=7;
			enemy.regX=enemy.size/2;
			enemy.regY=enemy.size/2;
			enemy.y=-enemy.size/2;
			enemy.x= Math.floor(Math.random()*(stage.canvas.width-enemy.size)+enemy.size/2);
			stage.addChild(enemy);
			enemies.push(enemy);
		}

		//Spawn a star (every 2nd is a big one)
		function spawnStar() {
			star = new createjs.Shape();
			modStars=(stars.length%2); // can be 0 or 1
			
			star.size=modStars+1; // can be 1 or 2
			star.speed=.25*star.size; // can be 0.25 or 0.5
			
			star.graphics.f('#eee').dc(0,0,star.size);
			star.regX=star.size/2;
			star.regY=star.size/2;
			star.x=Math.floor(Math.random()*(stage.canvas.width-star.size)+star.size/2);
			star.y=-star.size/2;
			stage.addChild(star);
			stars.push(star);
		}

		//Spawn a meteor
		function spawnMeteor(){
			meteor = new createjs.Bitmap(queue.getResult("meteorSprite"));
			meteor.size=220;
			meteor.speed=3;
			meteor.hp=3+Math.floor(Math.random()*3);
			meteor.pointWorth=1;
			meteor.regX=meteor.size/2;
			meteor.regY=meteor.size/2;
			meteor.x=Math.floor(Math.random()*(stage.canvas.width-meteor.size)+meteor.size/2);
			meteor.y=-meteor.size/2;
			stage.addChild(meteor);
			meteors.push(meteor);
		}

		//Move elements in array
		function moveArray(Array){
			for (var i=Array.length-1; i>=0; i--) {
				//get independent from framerate
				Array[i].y+=calcMovement(Array[i].speed);
				if ((Array[i].y>stage.canvas.height+Array[i].size/2) || 
					(Array[i].y<0-Array[i].size/2)) {

					stage.removeChild(Array[i]);
					Array.splice(i, 1);
					if (Array==enemies){
							lives--;
							livesText.text="Lives: " + lives;
							if (lives<=0 && scene==2) die();
						}

				}
			}
		}

		//Rotate elements in array
		function rotateArray(Array) {
			for (var i=0; i<Array.length; i++) {
				Array[i].rotation++;
			}
		}

		//Explode animation
		function explode(object) {
			explosion = new createjs.Shape();
			explosion.size=object.size/3;
			explosion.graphics.f("#fff").dc(0,0,explosion.size,explosion.size);
			explosion.alpha=.8;
			explosion.regX=explosion.size/2;
			explosion.regY=explosion.size/2;
			explosion.x=object.x+object.size/4;
			explosion.y=object.y+object.size/4;
			explosions.push(explosion);
			stage.addChild(explosion);
		}

		//Fade explosions
		function fadeExplosions(){
			for (var i = explosions.length-1; i>=0; i--) {
				explosions[i].alpha-=.05;
				explosions[i].scaleX+=.05;
				explosions[i].scaleY+=.05;
				if (explosions[i].alpha==0) {
					stage.removeChild(explosions[i]);
					explosions.splice(i, 1);
				}
			}
		}

		function takeDamage(x) {
			lives--;
			// blood = new createjs.Shape();
			// blood.graphics.f("red").dr(0,0,stage.canvas.width, stage.canvas.height);
			// blood.born=creatjs.Ticker.getTicks();
			// blood.x=0;
			// blood.y=0;
			// blood.alpha=0.6;
			// stage.addChild(blood);
			livesText.text=("Lives: "+lives);
			livesText.text=("Lives: "+lives);
		}

	//0.Menu functions
		function mainMenu() {
			window.onkeyup = function(e){
				if (e.keyCode==32) {
					gameStartDate=createjs.Ticker.getTicks();
					stage.removeChild(title);
					stage.removeChild(instructions);
					stage.addChild(livesText);
					stage.addChild(scoreText);
					scene=1;
				}
			}
		}


	//1.Animation functions
		function revealSpaceship() {
			spaceship.y-=calcMovement(.5);
			// spaceship.y -= .5;
			if (spaceship.y<stage.canvas.height-stage.canvas.height/8) scene=2;
		}

	//2.Gameplay functions
		function controlSpaceship() {
			//key control
			window.onkeydown = function(e){
				if (e.keyCode==37) keys.cLeft=true;
				if (e.keyCode==38) keys.cUp=true;
				if (e.keyCode==39) keys.cRight=true;
				if (e.keyCode==40) keys.cDown=true;
			}

			//binding keys
			window.onkeyup = function(e) {
				if (e.keyCode==37) keys.cLeft=false;
				if (e.keyCode==38) keys.cUp=false;
				if (e.keyCode==39) keys.cRight=false;
				if (e.keyCode==40) keys.cDown=false;
				if (e.keyCode==32) {
					bullet = new createjs.Shape();
					bullet.size=2;
					bullet.graphics.f("#F4E3C2").dc(0,0,bullet.size);
					bullet.regX=bullet.size/2;
					bullet.regY=bullet.size/2;
					bullet.x=spaceship.x;
					bullet.y=spaceship.y-spaceship.size/2;
					bullet.speed=-6;
					stage.addChild(bullet);
					bullets.push(bullet);
				}
			}
			
			realSpeed=calcMovement(spaceship.speed);
			//move spaceship
			if ((keys.cLeft) && ((spaceship.x-=realSpeed)>0)) spaceship.x -= realSpeed;
			if ((keys.cRight) && (spaceship.x+=realSpeed<=stage.canvas.width)) spaceship.x += realSpeed;
			if ((keys.cUp) && (spaceship.y-=realSpeed>=0)) spaceship.y -= realSpeed;
			if ((keys.cDown) && (spaceship.y+=realSpeed<=stage.canvas.height)) spaceship.y += realSpeed;

			//Keep in stage on X axis
			if (spaceship.x<spaceship.size/2) spaceship.x=spaceship.size/2;
			if (spaceship.x>stage.canvas.width-spaceship.size/2) spaceship.x=stage.canvas.width-spaceship.size/2;

			//Keep in stage on Y axis
			if (spaceship.y<spaceship.size/2) spaceship.y=spaceship.size/2;
			if (spaceship.y>stage.canvas.height-spaceship.size/2) spaceship.y=stage.canvas.height-spaceship.size/2;
		}

		function hitTest(elem1, elem2) {
				return (elem1.x-elem1.size/2 < elem2.x-elem2.size/2 &&
					elem1.x+elem1.size/2 > elem2.x-elem2.size/2 &&
					elem1.y-elem1.size/2 < elem2.y-elem2.size/2 &&
					elem1.y+elem1.size/2 > elem2.y-elem2.size/2);
		}

		function checkHits() {
			//Enemies hit detection
			for (var i=enemies.length-1; i>=0; i--){
				
				//Enemies and spaceship
				if (hitTest(enemies[i], spaceship)) {
					explode(enemies[i]);
					if (lives>1) {
						stage.removeChild(enemies[i]);
						enemies.splice(i,1);
						takeDamage(1);
					}
					else die();
				}
				
				//Enemies and bullets
				for (var b=bullets.length-1; b>=0; b--) {
					if (hitTest(enemies[i], bullets[b])) {
						explode(enemies[i]);
						score+=enemies[i].pointWorth;
						scoreText.text=("Score: "+score);

						stage.removeChild(enemies[i]);
						stage.removeChild(bullets[b]);
						bullets.splice(b, 1);
						enemies.splice(i, 1);
					}
				}
			}

			//Meteors hit detection
			for (var i=meteors.length-1; i>=0; i--) {
				//Meteors and spaceship
				if (hitTest(meteors[i], spaceship)) {
					explode(meteors[i]);
					if (lives>1) {
						stage.removeChild(meteors[i]);
						meteors.splice(i,1);
						lives--;
						livesText.text=("Lives: "+lives);
					}
					else die();
				}

				//Meteors and bullets
				for (var b=bullets.length-1; b>=0; b--) {
					if (hitTest(meteors[i], bullets[b])) {
						score+=meteors[i].pointWorth;
						

						stage.removeChild(bullets[b]);
						bullets.splice(b, 1);

						meteors[i].hp--;
						if (meteors[i].hp==0) {
							score += (meteors[i].pointWorth*5);

							explode(meteors[i]);
							stage.removeChild(meteors[i]);
							meteors.splice(i, 1);
							

						}
						scoreText.text=("Score: "+score);
					}
				}
			}
		}

		function die(){
			stage.removeChild(scoreText);
			stage.removeChild(livesText);
			gameOverText = new createjs.Text("You have died. Final score: "+score+". Press R to return to menu.", "24px Arial", "#fff");
			gameOverText.textAlign="center";
			gameOverText.lineWidth=350;
			gameOverText.x=stage.canvas.width/2;
			gameOverText.y=stage.canvas.height/2;
			stage.addChild(gameOverText);
			scene=3;
		}

	//3.GameOver functions
		function gameOver() {
			stage.removeChild(spaceship);
			
			window.onkeyup=function(e){
				if (e.keyCode==82) gameSetup();
			}
		}