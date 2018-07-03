//Setup
    var readyAudio = new Audio('Ready.wav');
    var hitAudio = new Audio('hit.mp3');
    var healAudio = new Audio('blessing.ogg');
    var gameoverAudio = new Audio('gameover.mp3');
    var consoleIndex=1;
    var units = new Array();
    var score = 0;
    var round = 1;
    var dead = 0;

//Defining a unit object
    var unit = function(type) {
        
        //Basic setup (applies to every units)
            this.id=units.length;
            units.push(this);
            this.type=type;
            this.alive=true;
            this.summoningsickness=true;
            this.enoughMana=true;

        //Defining types
            switch(this.type) {
                
                //Player properties and methods
                    case "player" : 
                        this.power = 3;
                        this.hp = 10;
                        this.name = "Player";

                        this.onclickaction = function() {
                                location.reload();
                            }
                        
                         
                        
                        break;

                //Raider Hydra properties and methods
                    case "raiderHydra" : 
                        this.power=1;
                        this.hp=units.length-1;
                        this.name=this.id + ". Raider Hydra";

                        this.onclickaction = function() {
                            units[0].attack(this);
                            hitAudio.play();
                         }

                        this.takeTurn = function() {
                            if (this.summoningsickness==true) this.summoningsickness=false;
                                else this.attack(units[0]);
                        }

                         break;

                case "healerHydra" : 
                     this.power=1;
                        this.hp=units.length-1;
                        this.name=this.id + ". Healer Hydra";

                        this.onclickaction = function() {
                            units[0].attack(this);
                            hitAudio.play();
                         }

                        this.takeTurn = function() {
                             if (this.summoningsickness==true) this.summoningsickness=false;
                                else {
                                

                                left_adjacent=this.id-1;
                                right_adjacent=this.id+1;

                                if (units[left_adjacent].alive==true) this.heal(units[left_adjacent]);
                                if (this.id < units.length-1) {
                                    if (units[right_adjacent].alive==true) 
                                        this.heal(units[right_adjacent]);
                                }
                            }
                        }
                     break;

                case "bufferHydra" : 
                     this.power=1;
                        this.hp=units.length-1;
                        this.name=this.id + ". Buffer Hydra";

                        this.onclickaction = function() {
                            units[0].attack(this);
                            hitAudio.play();
                         }

                        this.takeTurn = function() {
                             if (this.summoningsickness==true) this.summoningsickness=false;
                                else {
                                left_adjacent=this.id-1;
                                right_adjacent=this.id+1;
                                
                                if (units[left_adjacent].alive==true) this.buff(units[left_adjacent]);
                                if (this.id < units.length-1) {
                                    if (units[right_adjacent].alive==true) 
                                        this.buff(units[right_adjacent]);
                                }
                            }
                        }
                     break;
            }

            this.consoleName = "<span class='consoleName'>[" + this.name + "]</span>";

        //Methods
            this.attack = function(target) {
                        target.hp -= this.power;

                        gainedStuff="";
                        if (target.type=='raiderHydra') { units[0].power += 1; gainedStuff="You gained <span class='consoleDmg'>1 power point</span>!"; }
                        if (target.type=='healerHydra') { units[0].hp += 1; gainedStuff="You gained <span class='consoleHeal'>1 health point!</span>"; }
                        if (target.type=='bufferHydra') { units[0].power += 1; units[0].hp += 1; gainedStuff="You gained <span class='consoleBuff'>1 power and 1 health point</span>!"; }

                        consoleLog(this.consoleName + " dealt <span class='consoleDmg'>" + this.power + " damage</span> to " + target.consoleName + ". " + gainedStuff);
                    }

            this.heal = function(target) {
                        target.hp += this.power;
                        consoleLog(this.consoleName + " healed " + target.consoleName + " with <span class='consoleHeal'>" + this.power + " health points</span>.");

                    }

            this.buff = function(target) {
                target.power += this.power;
                 consoleLog(this.consoleName + " buffed " + target.consoleName + " with <span class='consoleBuff'>" + this.power + " power points</span>.");
            }

            this.die = function() {
                this.alive=false;
                dead += 1;
                document.getElementById("unit" + this.id).setAttribute("class", this.type + " dead-unit");
                document.getElementById("unit" + this.id).setAttribute("onclick", "");

                consoleLog(this.consoleName +  " has fallen.")

                newhydra = "hydra" + units.length;
               
        
                var newhydra = new unit("raiderHydra");
            
                randomNumber=Math.floor((Math.random() * 2) + 1);

                if (randomNumber == 1) {
                    newhydra = "hydra" + units.length;
                    var newhydra = new unit("healerHydra");
                }
                else if (randomNumber == 2) {
                    newhydra = "hydra" + units.length;
                    var newhydra = new unit("bufferHydra");
                }

            }

            this.onclick = function() {
                this.onclickaction();
                if (this.hp <= 0) this.die();   
                takeTurns();
            }

         unitHTML=
        "<div class='" + this.type + " unit' id='unit" + this.id + "' onclick='units[" + this.id + "].onclick()'> \
            <div class='portrait'></div> \
            <span class='name'>" + this.name + "</span> \
            <span class='attributes' id='attributes"+ this.id +"'>" + this.power + "/" + this.hp + "</span> \
        </div>";

        document.getElementById("battlefield").innerHTML += unitHTML;
        consoleLog(this.consoleName + " has spawned!");
        
    }

//Functions
    function consoleLog(string) {
        document.getElementById("console").innerHTML += "<p>" + consoleIndex + ". " + string + "</p>";
        document.getElementById("console").scrollTop = document.getElementById("console").scrollHeight;
        consoleIndex += 1;
    }

    function updateDisplay() {
        for (var i=0; i<units.length; i++) {
            if (units[i].alive==true) document.getElementById("attributes" + i).innerHTML = units[i].power + "/" + units[i].hp;
                else document.getElementById("attributes" + i).innerHTML = "0/0";
        }
    }

    function takeTurns() {
        for (var i=1; i<units.length; i++) {
            score +=13;
            if (units[i].alive==true) units[i].takeTurn();
            if (units[0].hp <= 0) { 
                
                random = Math.floor((Math.random() * 15) + 1);
                if (random == 1) bullying = "Surviving -good, dying - bad.";
                if (random == 2) bullying = "Uhm... do you know Candy Crush?";
                if (random == 3) bullying = "Well...should I be honest or nice?";
                if (random == 4) bullying = "It's not your fault.";
                if (random == 5) bullying = "Yea, I know the game is wrong and buggy and makes no sense and blabla...";
                if (random == 6) bullying = "Don't worry, I am sure you are good at something!";
                if (random == 7) bullying = "Get back to Facebook and pretend that nothing happened.";
                if (random == 8) bullying = "Why?";
                if (random == 9) bullying = "Don't blame me, I am just JavaScript!";
                if (random == 10) bullying = "Testing a game is not for everyone...";
                if (random == 11) bullying = "Almost good job.";
                if (random == 12) bullying = "I think you haven't read the rules. I hope at least.";
                if (random == 13) bullying = "Nope. Not like this.";
                if (random == 14) bullying = "U mad?";
                if (random == 15) bullying = "Blame the system.";

                document.getElementById("battlefield").innerHTML =
                "<h1>"+bullying+"</h1> \
                <img src='http://i.giphy.com/6OWIl75ibpuFO.gif'> \
                <p>Your final score is " + score + ". </p> \
                <p onclick='location.reload()'><a href=''>Click here to start a new game</a></p>";
                gameoverAudio.play();
                consoleLog("<b>Oops! You have died! Better luck next time!</b>");
                return false;
            }
        }

            random = Math.floor((Math.random() * 5) + 1);
            if (random == 1) randomBless();
            if (random == 2) randomCurse();
            if (random == 3) randomWeaken();
            if (random == 4) randomStrongen();
            if (random == 5) randomNothing();

            if (units[0].hp<=0) {
                units[0].hp=1;
                consoleLog("<span class='consoleLuck'>Mercy of the Sky: You are still alive!");
            }

            if (units[0].power<=0) {
                units[0].power=1;
                consoleLog("<span class='consoleLuck'>Mercy of the Sky: You can still hurt someone!");
            }

            updateDisplay();
        

        consoleLog("<b>Round " + round + "! Your turn!</b>")
        round += 1;
        updateDisplay();
    }


    function randomBless() {
        units[0].hp += 1;
        consoleLog("<span class='consoleLuck'>Round luck: Hug of Michael! Your health is increased by 1!</span>");
    }

    function randomCurse() {
        units[0].hp -= dead;
        consoleLog("<span class='consoleLuck'>Round luck: Anger of Povilas! Your health is decreased by 1!</span>");
    }

    function randomWeaken() {
        units[0].power -= dead;
        consoleLog("<span class='consoleLuck'>Round luck: Finger of Gabor! Your power is decreased by 1!</span>");
    }

    function randomStrongen() {
        units[0].power += dead;
        consoleLog("<span class='consoleLuck'>Round luck: Kiss of Marcus! Your power is increased by 1!</span>");
    }

    function randomNothing() {
        units[0].hp -= dead;
        consoleLog("<span class='consoleLuck'>Round luck: Adam. Nothing happens.</span>");
    }


//Happens on Page load
    player = new unit("player");
    hydra1 = new unit("raiderHydra");

    consoleLog("<b>Round " + round + "! Your turn!</b>")
    round += 1;

    readyAudio.play();