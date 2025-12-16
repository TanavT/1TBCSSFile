
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import Phaser from "phaser"
import connect4_Empty_Grid from "../../assets/Connect4_Empty_Grid.png";
import red_Circle_full from "../../assets/Red_Circle_full.png";
import yellow_Circle from "../../assets/Yellow_Circle.png";
import io from 'socket.io-client';
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
/* END-USER-IMPORTS */

function SwitcherFunc () {
	const navigate = useNavigate()
	navigate('/connect')
}

export default class Connect4Main extends Phaser.Scene {
	
	constructor() {
		super("Connect4Main");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// connect4_Empty_Grid
		const connect4_Empty_Grid = this.add.image(512, 384, "Connect4_Empty_Grid");
		connect4_Empty_Grid.scaleX = 1.2;
		connect4_Empty_Grid.scaleY = 1.2;

		// rectangle_1
		const rectangle_1 = this.add.rectangle(196, 365, 128, 128);
		rectangle_1.setInteractive(new Phaser.Geom.Rectangle(0, 0, 128, 128), Phaser.Geom.Rectangle.Contains);
		rectangle_1.scaleX = 0.7592880558062651;
		rectangle_1.scaleY = -5.938735196804428;

		// rectangle
		const rectangle = this.add.rectangle(306, 367, 128, 128);
		rectangle.setInteractive(new Phaser.Geom.Rectangle(0, 0, 128, 128), Phaser.Geom.Rectangle.Contains);
		rectangle.scaleX = 0.7592880558062651;
		rectangle.scaleY = -5.938735196804428;

		// rectangle_2
		const rectangle_2 = this.add.rectangle(414, 378, 128, 128);
		rectangle_2.setInteractive(new Phaser.Geom.Rectangle(0, 0, 128, 128), Phaser.Geom.Rectangle.Contains);
		rectangle_2.scaleX = 0.7592880558062651;
		rectangle_2.scaleY = -5.938735196804428;

		// rectangle_3
		const rectangle_3 = this.add.rectangle(514, 371, 128, 128);
		rectangle_3.setInteractive(new Phaser.Geom.Rectangle(0, 0, 128, 128), Phaser.Geom.Rectangle.Contains);
		rectangle_3.scaleX = 0.7592880558062651;
		rectangle_3.scaleY = -5.938735196804428;

		// rectangle_4
		const rectangle_4 = this.add.rectangle(618, 371, 128, 128);
		rectangle_4.setInteractive(new Phaser.Geom.Rectangle(0, 0, 128, 128), Phaser.Geom.Rectangle.Contains);
		rectangle_4.scaleX = 0.7592880558062651;
		rectangle_4.scaleY = -5.938735196804428;

		// rectangle_5
		const rectangle_5 = this.add.rectangle(723, 382, 128, 128);
		rectangle_5.setInteractive(new Phaser.Geom.Rectangle(0, 0, 128, 128), Phaser.Geom.Rectangle.Contains);
		rectangle_5.scaleX = 0.7592880558062651;
		rectangle_5.scaleY = -5.938735196804428;

		// rectangle_6
		const rectangle_6 = this.add.rectangle(827, 382, 128, 128);
		rectangle_6.setInteractive(new Phaser.Geom.Rectangle(0, 0, 128, 128), Phaser.Geom.Rectangle.Contains);
		rectangle_6.scaleX = 0.7592880558062651;
		rectangle_6.scaleY = -5.938735196804428;

		// yourTimeText
		const yourTimeText = this.add.text(15, 53, "", {});
		yourTimeText.text = "Your time: 10:00\n";
		yourTimeText.setStyle({ "fontFamily": "Times", "fontSize": "40px" });
		yourTimeText.setWordWrapWidth(1);
		this.yourTimeText = yourTimeText

		// enemyTimeText
		const enemyTimeText = this.add.text(902, 53, "", {});
		enemyTimeText.text = "Enemy time: 10:00\n";
		enemyTimeText.setStyle({ "fontFamily": "Times", "fontSize": "40px" });
		enemyTimeText.setWordWrapWidth(1);
		this.enemyTimeText = enemyTimeText

		// yourColorText
		const yourColorText = this.add.text(16, 580, "", {});
		yourColorText.text = "Your Color: None\n";
		yourColorText.setStyle({ "fontFamily": "Times", "fontSize": "40px" });
		yourColorText.setWordWrapWidth(1);
		this.yourColorText = yourColorText

		// turnText
		const turnText = this.add.text(909, 619, "", {});
		turnText.text = "Turn: red\n";
		turnText.setStyle({ "fontFamily": "Times", "fontSize": "40px" });
		turnText.setWordWrapWidth(1);
		this.turnText = turnText

		this.rectangle_1 = rectangle_1;
		this.rectangle = rectangle;
		this.rectangle_2 = rectangle_2;
		this.rectangle_3 = rectangle_3;
		this.rectangle_4 = rectangle_4;
		this.rectangle_5 = rectangle_5;
		this.rectangle_6 = rectangle_6;

		this.events.emit("scene-awake");
	}

	private rectangle_1!: Phaser.GameObjects.Rectangle;
	private rectangle!: Phaser.GameObjects.Rectangle;
	private rectangle_2!: Phaser.GameObjects.Rectangle;
	private rectangle_3!: Phaser.GameObjects.Rectangle;
	private rectangle_4!: Phaser.GameObjects.Rectangle;
	private rectangle_5!: Phaser.GameObjects.Rectangle;
	private rectangle_6!: Phaser.GameObjects.Rectangle;

	/* START-USER-CODE */

	// Write your code here
	userID!:string;
	opponentUserID:string;
	matchID:string;

	socket:Socket;

	color:string;
	opponentColor:string;

	myTurn:boolean = false; //red goes first

	yourTimeText
	enemyTimeText
	yourColorText
	turnText

	gameOver:boolean = false;


	formatTime(seconds){//this timer code based on https://phaser.discourse.group/t/countdown-timer/2471/4
    // Minutes
    var minutes = Math.floor(seconds/60);
    // Seconds
    var partInSeconds = seconds%60;
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2,'0');
    // Returns formated time
    return `${minutes}:${partInSeconds}`;
	}

	me
	gametype
	opp


	init(data: { userID: string }) {
    this.userID = data.userID;
		const user = this.game.registry.get("user");//USER IN PHASER 7 FINAL: get user
		console.log("got user: " + user.username);
		this.me = user.username

		const gametype = this.game.registry.get("gametype");
		console.log("got gametype: " + gametype);
		this.gametype = gametype;

		const opp = this.game.registry.get("opp");
		console.log("got opp: " + opp);
		this.opp = opp;
	}


	preload(){
		console.log(`UserId: ${this.userID}`)
		console.log("It's preloadin time")
		this.socket = io('http://localhost:4000');

		this.socket.on('user_join', (id) => {
			console.log('A user joined their id is ' + id);
			if(this.gametype == "queue"){
				this.socket.emit("realSocketConnect", this.userID)
			} else {
				this.socket.emit("customJoinConnect", {me:this.me, opp:this.opp})
			}
			
  		});

		this.socket.on('timer', ({timeRed, timeYellow}) => {
			if(this.gameOver) return
			if(this.color == "red"){
				this.yourTimeText.text = `Your Time: ${this.formatTime(timeRed)}`
				this.enemyTimeText.text = `Enemy Time: ${this.formatTime(timeYellow)}`
			}
			else{
				this.yourTimeText.text = `Your Time: ${this.formatTime(timeYellow)}`
				this.enemyTimeText.text = `Enemy Time: ${this.formatTime(timeRed)}`
			}
			if(timeRed == 0){
				this.doGameOver("Y")
			}
			if(timeYellow == 0){
				this.doGameOver("R")
			}
  		});

		this.socket.on('color', ({id, color, opponentUserID, matchID}) => {
			if(this.userID == opponentUserID){
				window.location.replace('/connect')
			}
			if (this.socket.id == id){
				if(color == 'red'){
					this.color="red"
					this.opponentColor="yellow"
				}
				else{
					this.color="yellow"
					this.opponentColor="red"
				}
			}
			else{
				if(color == 'red'){
					this.color="yellow"
					this.opponentColor="red"
				}
				else{
					this.color="red"
					this.opponentColor="yellow"
				}
			}
			this.matchID = matchID
			this.opponentUserID = opponentUserID
			console.log("COLOR:" + this.color)
			console.log(`My id: ${this.userID}, opponent id: ${this.opponentUserID}`)
			this.myTurn = (this.color == "red")
			this.yourColorText.text = `Your color: ${this.color}`
  		})
		this.socket.on('error', ({id, message}) => {
			console.log("I am "+id+" and the message is: " + message)
		})

		this.socket.on("customOtherPlaced", (collumn) => {
			
			  this.myTurn = true;
			  this.turnText.text = `Turn: ${this.color}`
			  console.log(collumn.x);
			  let collumnNumber = Math.floor((collumn.x - 200)/100);
			  if(collumn.x === 196) collumnNumber = 0
			  if(this.countCollum[collumnNumber] < 6){
			  if(this.opponentColor == "red"){
			  	var tempThingy = this.add.image(collumn.x, 0, "Red_Circle_full");

			  tempThingy.scaleX = 0.3;
			  tempThingy.scaleY = 0.3;
			  	this.globalGameState[collumnNumber][this.countCollum[collumnNumber]] = 'R'
			  }
			  else{
			    var tempThingy = this.add.image(collumn.x, 0, "Yellow_Circle");

			  tempThingy.scaleX = 0.18;
			  tempThingy.scaleY = 0.18;
			  this.globalGameState[collumnNumber][this.countCollum[collumnNumber]] = 'Y'
			  }
			  this.circleList.push(tempThingy)
			  console.log(this.globalGameState)
			//this.turn = 1-this.turn;
              const t = this.tweens.add({
                    targets: [tempThingy],
                    y: {from: tempThingy.y, to:650 - this.countCollum[collumnNumber] * 105},
                    duration: 200,
                    easing: 'bounce',
                    yoyo: false,
                    paused: true
                })
              t.play()
			  this.countCollum[collumnNumber] = this.countCollum[collumnNumber] + 1
			  this.checkGameOver(this.globalGameState);
			  }
			}
		)
		this.socket.on("otherPlaced", (collumn) => {
			console.log("I GOT THE OPPONENTS MESSAGE")
			  this.myTurn = true;
			  this.turnText.text = `Turn: ${this.color}`
			  console.log(collumn.x);
			  let collumnNumber = Math.floor((collumn.x - 200)/100);
			  if(collumn.x === 196) collumnNumber = 0
			  if(this.countCollum[collumnNumber] < 6){
			  if(this.opponentColor == "red"){
			  	var tempThingy = this.add.image(collumn.x, 0, "Red_Circle_full");

			  tempThingy.scaleX = 0.3;
			  tempThingy.scaleY = 0.3;
			  	this.globalGameState[collumnNumber][this.countCollum[collumnNumber]] = 'R'
			  }
			  else{
			    var tempThingy = this.add.image(collumn.x, 0, "Yellow_Circle");

			  tempThingy.scaleX = 0.18;
			  tempThingy.scaleY = 0.18;
			  this.globalGameState[collumnNumber][this.countCollum[collumnNumber]] = 'Y'
			  }
			  this.circleList.push(tempThingy)
			  console.log(this.globalGameState)
			//this.turn = 1-this.turn;
              const t = this.tweens.add({
                    targets: [tempThingy],
                    y: {from: tempThingy.y, to:650 - this.countCollum[collumnNumber] * 105},
                    duration: 200,
                    easing: 'bounce',
                    yoyo: false,
                    paused: true
                })
              t.play()
			  this.countCollum[collumnNumber] = this.countCollum[collumnNumber] + 1
			  this.checkGameOver(this.globalGameState);
			  }

		})


		this.load.image(
		'Connect4_Empty_Grid',
		'/assets/Connect4_Empty_Grid.png'
		);
		this.load.image(
		'Red_Circle_full',
		'/assets/Red_Circle_full.png'
		);
		this.load.image(
		'Yellow_Circle',
		'/assets/Yellow_Circle.png'
		);

	}

	checkGameOver(gameState:string [][]):void {
		for(let [i,x] of gameState.entries()){ //side to side
			if(i < 4){
				for(let [j,y] of x.entries()){
					if(gameState[i][j] !== 'x' && gameState[i][j] === gameState[i+1][j] && gameState[i+1][j] === gameState[i+2][j] && gameState[i+2][j] === gameState[i+3][j]){
						console.log(gameState[i][j] + ' WINS!!!')
						this.doGameOver(gameState[i][j])
						return
					}
				}
			}
		}
		for(let [i,x] of gameState.entries()){ //Up and down
				for(let [j,y] of x.entries()){
					if(j < 3){
						if(gameState[i][j] !== 'x' && gameState[i][j] === gameState[i][j+1] && gameState[i][j+1] === gameState[i][j+2] && gameState[i][j+2] === gameState[i][j+3]){
							console.log(gameState[i][j] + ' WINS!!!')
							this.doGameOver(gameState[i][j])
							return
						}
					}

				}
		}

		for(let [i,x] of gameState.entries()){ //Left up to right down... or smth idk some sort of diagonal it's hard to keep track of which way its flipped
			if(i < 4){
				for(let [j,y] of x.entries()){
					if(j < 3){
					if(gameState[i][j] !== 'x' && gameState[i][j] === gameState[i+1][j+1] && gameState[i+1][j+1] === gameState[i+2][j+2] && gameState[i+2][j+2] === gameState[i+3][j+3]){
						console.log(gameState[i][j] + ' WINS!!!')
						this.doGameOver(gameState[i][j])
						return
					}
					}
				}
			}
		}

		for(let [i,x] of gameState.entries()){ //Left down to right up... or smth idk some sort of diagonal it's hard to keep track of which way its flipped
			if(i < 4){
				for(let [j,y] of x.entries()){
					if(j >= 3){
					if(gameState[i][j] !== 'x' && gameState[i][j] === gameState[i+1][j-1] && gameState[i+1][j-1] === gameState[i+2][j-2] && gameState[i+2][j-2] === gameState[i+3][j-3]){
						console.log(gameState[i][j] + ' WINS!!!')
						this.doGameOver(gameState[i][j])
						return
					}
					}
				}
			}
		}
		if(this.countCircles == 42){
			this.doGameOver("tie")
		}
		return
	}

	globalGameState = [['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x']]

	circleList = []

	turn = 0;
	countCollum = [0,0,0,0,0,0,0]

	countCircles = 0

	doGameOver(winner:string):void{
		console.log(winner + ' WINS FR!!!')
		this.gameOver = true
		let gameState //1 = this player won, 0.5 = tie, 0 = this player lost
		if(winner == "R"){
			this.winRed.visible = true
			if (this.color === "red") {
				gameState = 1
			} else {
				gameState = 0
			}
			console.log(this.userID + " at gameover")
			this.socket.emit("gameOverConnect", 
				{ 
				gameState: gameState,
				userID: this.userID, 
				opponentUserID: this.opponentUserID,
				matchID: this.matchID})
		}
		else if(winner == "Y"){
			if (this.color === "yellow") {
				gameState = 1
			} else {
				gameState = 0
			}
			this.winYellow.visible = true
			console.log(this.userID + " at gameover")
			this.socket.emit("gameOverConnect", 
				{ 
				gameState: gameState,
				userID: this.userID, 
				opponentUserID: this.opponentUserID,
				matchID: this.matchID})
		}
		else{
			gameState = 0.5
			this.tieGame.visible = true
			this.socket.emit("gameOverConnect", 
				{ 
				gameState: gameState,
				userID: this.userID, 
				opponentUserID: this.opponentUserID,
				matchID: this.matchID})
		}
		// this.globalGameState = [['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x']]
		// this.turn = 0;
		// this.countCollum = [0,0,0,0,0,0,0];
		// this.circleList.forEach((circle) => {
		// 	circle.destroy();
		// })
		// this.sceneShutdown();
	}

	async idkFunc(){

	}
	winRed
	winYellow
	tieGame

	create() {
		console.log(this.userID)
		this.editorCreate();

		const collumns = [this.rectangle, this.rectangle_1, this.rectangle_2, this.rectangle_3, this.rectangle_4, this.rectangle_5, this.rectangle_6]

        collumns.forEach((collumn) => {
            collumn.on('pointerdown', () => {
			  if(this.myTurn && this.gameOver == false){
				this.myTurn = false;
				this.turnText.text = `Turn: ${this.opponentColor}`
			  if(this.gametype == "queue"){
				this.socket.emit("placePiece", (collumn))
			  } else {
				this.socket.emit("customConnectPlacePiece", ({collumn: collumn, me:this.me, opp:this.opp}))
			  }
			  console.log(collumn.x);
			  let collumnNumber = Math.floor((collumn.x - 200)/100);
			  if(collumn.x === 196) collumnNumber = 0
			  if(this.countCollum[collumnNumber] < 6){
			  if(this.color == "red"){
			  	var tempThingy = this.add.image(collumn.x, 0, "Red_Circle_full");

			  tempThingy.scaleX = 0.3;
			  tempThingy.scaleY = 0.3;
			  	this.globalGameState[collumnNumber][this.countCollum[collumnNumber]] = 'R'
			  }
			  else{
			    var tempThingy = this.add.image(collumn.x, 0, "Yellow_Circle");

				tempThingy.scaleX = 0.18;
				tempThingy.scaleY = 0.18;
				this.globalGameState[collumnNumber][this.countCollum[collumnNumber]] = 'Y'
				}
				this.circleList.push(tempThingy)
				console.log(this.globalGameState)
				//this.turn = 1-this.turn;
				const t = this.tweens.add({
						targets: [tempThingy],
						y: {from: tempThingy.y, to:650 - this.countCollum[collumnNumber] * 105},
						duration: 200,
						easing: 'bounce',
						yoyo: false,
						paused: true
					})
				t.play()
				this.countCollum[collumnNumber] = this.countCollum[collumnNumber] + 1
				this.checkGameOver(this.globalGameState);
				}
				}
			})
        })
	

	const winRed = this.add.text(130, 320, "", {});
	winRed.visible = false;
	winRed.text = "Winner: Red";
	winRed.setStyle({ "fontSize": "100px" });
	winRed.setStroke('#000000', 6);
	this.winRed = winRed

	// winBlack
	const winYellow = this.add.text(130, 320, "", {});
	winYellow.visible = false;
	winYellow.text = "Winner: Yellow";
	winYellow.setStyle({ "fontSize": "100px" });
	winYellow.setStroke('#000000', 6);
	this.winYellow = winYellow

	// tie
	const tieGame = this.add.text(130, 320, "", {});
	tieGame.visible = false;
	tieGame.text = "Result: Tie";
	tieGame.setStyle({ "fontSize": "100px" });
	tieGame.setStroke('#000000', 6);
	this.tieGame = tieGame
	}

	}
	/* END-USER-CODE */


/* END OF COMPILED CODE */

// You can write more code here
