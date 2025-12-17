import Phaser from "phaser"
import io from 'socket.io-client';
import { Socket } from "socket.io-client";



type FieldArrayPiece = {
	tile: Phaser.GameObjects.Rectangle,
	piece: Phaser.GameObjects.Sprite | null,
	team: string | null,
	king: boolean,
	selectable: boolean
}

type SelectedPiece = {
		row: number;
		col: number;
		selected: false;
		piece: FieldArrayPiece | null;
	}

export default class CheckersMain extends Phaser.Scene {
	boardSize: number;
	tileSize: number;
	tileSpacing: number;
	tweenSpeed: number;
	score: number;
	canMove: boolean;
	movingTiles: number;
	selectedPiece: SelectedPiece;
	pieceSelected: boolean;
	toMove: string;
	gameRunning: boolean;
	fieldArray: FieldArrayPiece[][];

	winRed
	winBlack
	tieGame

	yourTimeText
	enemyTimeText
	yourColorText
	turnText

	

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

	myColor: string;

    constructor() {
        super({ key: 'CheckersMain' });

        this.boardSize = 8;
        this.tileSize = 59;
        this.tileSpacing = 10;
        this.tweenSpeed = 100;
        this.score = 0;
        this.canMove = false;
        this.movingTiles = 0;
        this.selectedPiece = {
            row: 0,
            col: 0,
            selected: false,
            piece: null
        };
        this.pieceSelected = false;
        this.toMove = 'black';
		this.gameRunning = true;
    }

	socket:Socket;
	color:string;
	opponentColor:string;

	userID!:string;
	opponentUserID:string;
	matchID:string;
	gametype: string;
	opp: any;
	me: any;

	callGameover(gameState: number) {
		console.log(this.userID + " at gameover")
			this.socket.emit("gameOverCheckers", { 
				gameState: gameState,
				userID: this.userID, 
				opponentUserID: this.opponentUserID,
				matchID: this.matchID})
	}

	init(data: { userID: string }) {
    	this.userID = data.userID;
		const user = this.game.registry.get("user");//USER IN PHASER 7 FINAL: get user
		console.log("got user: " + user.username);
		this.me = user.username

		const gametype = this.game.registry.get("gametype");
		console.log("got gametype: " + gametype);
		this.gametype = gametype;

		const opp = this.game.registry.get("opp");
		this.opp = opp;
	}

    preload() {
		
		this.socket = io('http://localhost:4000');
		this.socket.on('checkersTest', ({id, message}) => {
			console.log("I am " + id + " and the message is " + message);
		});

		this.socket.on('user_join', (id) => {
			console.log('A user joined their id is ' + id);
			if(this.gametype == "queue"){
				this.socket.emit("realSocketCheckers", this.userID);
			} else {
				console.log("custom match");
				console.log("opponent name: " + this.opp);
				this.socket.emit("checkersCustomConnect", {me: this.me, opp: this.opp})
			}
			
		})

		this.socket.on('checkersColor', ({id, color, opponentUserID, matchID}) => {
			console.log("I am " + id + " and my color is " + color);
			this.matchID = matchID
			this.opponentUserID = opponentUserID
			this.myColor = color;
		});
		this.socket.on('redRecieve', ({row, col}) => {
			console.log('redRecieve');
			
			
			if(this.myColor == 'red'){
				//console.log('and I am red');
				this.handleTileClick(row, col);
			}
		});
		this.socket.on('blackRecieve', ({row, col}) => {
			//console.log('blackRecieve');
			
			if(this.myColor == 'black'){
				//console.log('and I am black');
				this.handleTileClick(row, col);
			}
		})

		this.socket.on('timer', ({timeRed, timeBlack}) => {
			//console.log("timer")
			if(!this.gameRunning) return
			if(this.myColor == "red"){
				this.yourTimeText.text = `Your Time: ${this.formatTime(timeBlack)}`
				this.enemyTimeText.text = `Enemy Time: ${this.formatTime(timeRed)}`
			}
			else{
				this.yourTimeText.text = `Your Time: ${this.formatTime(timeRed)}`
				this.enemyTimeText.text = `Enemy Time: ${this.formatTime(timeBlack)}`
			}
			if(timeRed == 0){
				this.gameOver("Red")
			}
			if(timeBlack == 0){
				this.gameOver("Black")
			}
		})

        this.load.image('board', '/assets/checkersBoardSmall.png');
        this.load.image('redPiece', '/assets/redPiece.png');
        this.load.image('blackPiece', '/assets/blackPiece.png');
		this.load.image('blackKing', '/assets/blackKing.png');
		this.load.image('redKing', '/assets/redKing.png');
        //this.load.image('logo', 'assets/phaser.png');

        //  The ship sprite is CC0 from https://ansimuz.itch.io - check out his other work!
        //this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
    }

    create() {

		

		const yourTimeText = this.add.text(15, 53, "", {});
		yourTimeText.text = "Your time: 5:00\n";
		yourTimeText.setStyle({ "fontFamily": "Times", "fontSize": "40px" });
		yourTimeText.setWordWrapWidth(1);
		this.yourTimeText = yourTimeText

		// enemyTimeText
		const enemyTimeText = this.add.text(902, 53, "", {});
		enemyTimeText.text = "Enemy time: 5:00\n";
		enemyTimeText.setStyle({ "fontFamily": "Times", "fontSize": "40px" });
		enemyTimeText.setWordWrapWidth(1);
		this.enemyTimeText = enemyTimeText
        
       
        const boardWidth = this.boardSize * this.tileSize;
    	const boardHeight = boardWidth;


        const board = this.add.image(this.scale.width/2, this.scale.height/2, 'board');

		const startX = board.x - boardWidth / 2;
    	const startY = board.y - boardHeight / 2;

		const unselectButton = this.add.rectangle(850,50,100,40, 0xff0000)
		.setInteractive()
		.on("pointerdown", () => {
			this.undoSelection();
		});

		const unselectText = this.add.text(825,50,"Unselect", {color: "#fff"});

		const winRed = this.add.text(130, 320, "", {});
		winRed.visible = false;
		winRed.text = "Winner: Red";
		winRed.setStyle({ "fontSize": "100px" });
		winRed.setStroke('#000000', 6);
		this.winRed = winRed

		const winBlack = this.add.text(130, 320, "", {});
		winBlack.visible = false;
		winBlack.text = "Winner: Black";
		winBlack.setStyle({ "fontSize": "100px" });
		winBlack.setStroke('#000000', 6);
		this.winBlack = winBlack

        this.fieldArray = [];
        //this.fieldGroup = this.add.group();

        let odd = true;
        for (let row = 0; row < this.boardSize; row++){
            this.fieldArray[row] = [];
            for (let col = 0; col < this.boardSize; col++){
                //const posX = this.tileDestinationX(col);
                //const posY = this.tileDestinationY(row);
                const posX = startX + col * this.tileSize + this.tileSize/2;
                const posY = startY + row * this.tileSize + this.tileSize/2;

                let tile;
                if(odd){
                    tile = this.add.rectangle(posX,posY, this.tileSize, this.tileSize, 0xff0000);
					tile.setAlpha(0.1);
                } else {
                    tile = this.add.rectangle(posX,posY, this.tileSize, this.tileSize, 0x000000);
					tile.setAlpha(0.1);
                }
                odd = !odd;
                tile.setInteractive();

                tile.on('pointerdown', () => {
                    //console.log(`Clicked row ${row}, col ${col}.`);
					if(this.toMove == this.myColor){
						this.handleTileClick(row, col);
					}
                    
                });

                this.fieldArray[row][col] = {
                    tile: tile,
                    piece: null,
                    team: null,
                    king: false,
                    selectable: false
                }
            }
            odd = !odd;
        }

        this.setupBoard();
    }


    update() {
        //this.background.tilePositionX += 2;
    }

    setupBoard() {
        for (let row = 0; row < this.boardSize; row++){
            for(let col = 0; col < this.boardSize; col++){
                if ((row + col) %2 == 1){
                    if (row < 3) {
                        const blackPiece = this.add.sprite(this.fieldArray[row][col].tile.x, this.fieldArray[row][col].tile.y, 'blackPiece');
                        blackPiece.setScale(0.5);
                        this.fieldArray[row][col].piece = blackPiece;
                        this.fieldArray[row][col].team = 'black'
                    }

                    if(row > 4) {
                        const redPiece = this.add.sprite(this.fieldArray[row][col].tile.x, this.fieldArray[row][col].tile.y, 'redPiece');
                        redPiece.setScale(0.5);
                        this.fieldArray[row][col].piece = redPiece;
                        this.fieldArray[row][col].team = 'red'
                    }
                }


            }
        }
    }

    cleanUpBoard(){
		let redTeam = false;
		let blackTeam = false;
        let odd = true;
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
				if(this.fieldArray[row][col].team == 'red'){
					redTeam = true;
				}
				if(this.fieldArray[row][col].team == 'black'){
					blackTeam = true;
				}
                if(odd){
                    this.fieldArray[row][col].tile.fillColor = 0xff0000;
					this.fieldArray[row][col].tile.setAlpha(0.1);
                } else {
                    this.fieldArray[row][col].tile.fillColor = 0x000000;
					this.fieldArray[row][col].tile.setAlpha(0.1);
                }
				this.fieldArray[row][col].selectable = false;
                odd = !odd;
                
            }
            odd = !odd;
        }
		if(!redTeam){
			console.log('black wins');
			this.gameOver("red");
			this.gameRunning = false;
		}
		if(!blackTeam){
			console.log('red wins');
			this.gameOver("black");
			this.gameRunning = false;
		}
    }

	gameOver(team){
		let gameState:number = -1
		if (team = "black"){
			if (this.color === "red") {
				gameState = 1
			} else {
				gameState = 0
			}
			this.winRed.visible = true
		} else {
			if (this.color === "black") {
				gameState = 1
			} else {
				gameState = 0
			}
			this.winBlack.visible = true
		}
		if (gameState !== -1 ) {
			this.callGameover(gameState)
		}
	}

	undoSelection(){
		this.pieceSelected = false;
		this.cleanUpBoard();
	}

	checkJumping(){
		let result = [];
		for (let row = 0; row < this.boardSize; row++) {
			for (let col = 0; col < this.boardSize; col++) {
				let add = false;
				let tile = this.fieldArray[row][col];
				if(tile.king){
					if(tile.team == 'black'){
							//up left
						if(col > 1 && row > 1 && this.fieldArray[row-1][col-1].team=='red'){
							if (this.fieldArray[row-2][col-2].team == null){
								add = true;
							}
						}
							//down left
						if(col > 1 && row < 6 && this.fieldArray[row+1][col-1].team=='red'){
								if (this.fieldArray[row+2][col-2].team == null){
									add = true;
								}
						}
						//up right
						if(col < 6 && row > 1 && this.fieldArray[row-1][col+1].team=='red'){
							if (this.fieldArray[row-2][col+2].team == null){
								add = true;
							}
						}
						//down right
						if(col < 6 && row < 6 && this.fieldArray[row+1][col+1].team=='red'){
							if (this.fieldArray[row+2][col+2].team == null){
								add = true;
							}
						}	
					} else {
							//up left
						if(col > 1 && row > 1 && this.fieldArray[row-1][col-1].team=='red'){
							if (this.fieldArray[row-2][col-2].team == null){
								add = true;
							}
						}
							//down left
						if(col > 1 && row < 6 && this.fieldArray[row+1][col-1].team=='red'){
								if (this.fieldArray[row+2][col-2].team == null){
									add = true;
								}
						}
						//up right
						if(col < 6 && row > 1 && this.fieldArray[row-1][col+1].team=='red'){
							if (this.fieldArray[row-2][col+2].team == null){
								add = true;
							}
						}
						//down right
						if(col < 6 && row < 6 && this.fieldArray[row+1][col+1].team=='red'){
							if (this.fieldArray[row+2][col+2].team == null){
								add = true;
							}
						}
					}
				} else if (tile.team == 'black'){
					if(col > 1 && row < 6 && this.fieldArray[row+1][col-1].team=='red'){
						if (this.fieldArray[row+2][col-2].team == null){
							add = true;
						}
					}
					if(col < 6 && row < 6 && this.fieldArray[row+1][col+1].team=='red'){
						if (this.fieldArray[row+2][col+2].team == null){
							add = true;
						}
					}
				} else if (tile.team == 'red'){
					if(col > 1 && row > 1 && this.fieldArray[row-1][col-1].team=='black'){
						if (this.fieldArray[row-2][col-2].team == null){
							add = true;
						}
					}
					if(col < 6 && row > 1 && this.fieldArray[row-1][col+1].team=='black'){
						if (this.fieldArray[row-2][col+2].team == null){
							add = true;
						}
					}
				}

				if(add){
					console.log("JUMP");
					if(this.fieldArray[row][col].team == this.toMove){
						result.push([row,col]);
					}
					
				}
				
			}
		}
		return result;
	}

    handleTileClick(row, col){

		let jumping = this.checkJumping();
		if(jumping.length != 0){
			console.log("can jump");
		}

		if(!this.gameRunning){
			console.log('gameOver');
			return;
		}
		
        let theTile = this.fieldArray[row][col];
        console.log(`Clicked row ${row}, col ${col}.`);
        console.log(`Selectable: ${theTile.selectable}`)
		console.log(`Team: ${theTile.team}`);

		if(jumping.length != 0 && !this.pieceSelected){
			console.log("must jump");
			console.log(jumping[0]);
			if(jumping.some(([r,c]) => r==row && c==col)){
				console.log("JUMPED");
				let possible = false;
				if(this.toMove == 'black'){ 
					if(this.fieldArray[row][col].king){ //king
						if (col > 1 && row < 6 && this.fieldArray[row+1][col-1].team == 'red'){
							if (this.fieldArray[row+2][col-2].team == null){
								this.fieldArray[row+2][col-2].tile.fillColor = 0xffff00;
								this.fieldArray[row+2][col-2].tile.setAlpha(0.3);
								this.fieldArray[row+2][col-2].selectable = true;
								possible = true;
							}
						}
						if(col < 6 && row < 6 && this.fieldArray[row+1][col+1].team == 'red'){
							if (this.fieldArray[row+2][col+2].team == null){
								this.fieldArray[row+2][col+2].tile.fillColor = 0xffff00;
								this.fieldArray[row+2][col+2].tile.setAlpha(0.3);
								this.fieldArray[row+2][col+2].selectable = true;
								possible = true;
							}
						}
						if(col < 6 && row > 1 && this.fieldArray[row-1][col+1].team=='red'){
							if (this.fieldArray[row-2][col+2].team == null){
								this.fieldArray[row-2][col+2].tile.fillColor = 0xffff00;
								this.fieldArray[row-2][col+2].tile.setAlpha(0.3);
								this.fieldArray[row-2][col+2].selectable = true;
								possible = true;
							}
						}
						if(col > 1 && row > 1 && this.fieldArray[row-1][col-1].team=='red'){
							if (this.fieldArray[row-2][col-2].team == null){
								this.fieldArray[row-2][col-2].tile.fillColor = 0xffff00;
								this.fieldArray[row-2][col-2].tile.setAlpha(0.3);
								this.fieldArray[row-2][col-2].selectable = true;
								possible = true;
							}
						}
					} else { //normal piece
						if (col > 1 && row < 6 && this.fieldArray[row+1][col-1].team == 'red'){
							if (this.fieldArray[row+2][col-2].team == null){
								this.fieldArray[row+2][col-2].tile.fillColor = 0xffff00;
								this.fieldArray[row+2][col-2].tile.setAlpha(0.3);
								this.fieldArray[row+2][col-2].selectable = true;
								possible = true;
							}
						}
						if(col < 6 && row < 6 && this.fieldArray[row+1][col+1].team == 'red'){
							if (this.fieldArray[row+2][col+2].team == null){
								this.fieldArray[row+2][col+2].tile.fillColor = 0xffff00;
								this.fieldArray[row+2][col+2].tile.setAlpha(0.3);
								this.fieldArray[row+2][col+2].selectable = true;
								possible = true;
							}
						}
					}
				} else { //red
					if(this.fieldArray[row][col].king){ //king
						if (col > 1 && row < 6 && this.fieldArray[row+1][col-1].team == 'black'){
							if (this.fieldArray[row+2][col-2].team == null){
								this.fieldArray[row+2][col-2].tile.fillColor = 0xffff00;
								this.fieldArray[row+2][col-2].tile.setAlpha(0.3);
								this.fieldArray[row+2][col-2].selectable = true;
								possible = true;
							}
						}
						if(col < 6 && row < 6 && this.fieldArray[row+1][col+1].team == 'black'){
							if (this.fieldArray[row+2][col+2].team == null){
								this.fieldArray[row+2][col+2].tile.fillColor = 0xffff00;
								this.fieldArray[row+2][col+2].tile.setAlpha(0.3);
								this.fieldArray[row+2][col+2].selectable = true;
								possible = true;
							}
						}
						if(col < 6 && row > 1 && this.fieldArray[row-1][col+1].team=='black'){
							if (this.fieldArray[row-2][col+2].team == null){
								this.fieldArray[row-2][col+2].tile.fillColor = 0xffff00;
								this.fieldArray[row-2][col+2].tile.setAlpha(0.3);
								this.fieldArray[row-2][col+2].selectable = true;
								possible = true;
							}
						}
						if(col > 1 && row > 1 && this.fieldArray[row-1][col-1].team=='black'){
							if (this.fieldArray[row-2][col-2].team == null){
								this.fieldArray[row-2][col-2].tile.fillColor = 0xffff00;
								this.fieldArray[row-2][col-2].tile.setAlpha(0.3);
								this.fieldArray[row-2][col-2].selectable = true;
								possible = true;
							}
						}
					} else { //normal piece
						console.log("test");
						if (col > 1 && row > 1 && this.fieldArray[row-1][col-1].team == 'black'){
							console.log("test2");
							if (this.fieldArray[row-2][col-2].team == null){
								console.log("test3");
								this.fieldArray[row-2][col-2].tile.fillColor = 0xffff00;
								this.fieldArray[row-2][col-2].tile.setAlpha(0.3);
								this.fieldArray[row-2][col-2].selectable = true;
								possible = true;
							}
						}
						if(col < 6 && row > 1 && this.fieldArray[row-1][col+1].team == 'black'){
							console.log("test2");
							if (this.fieldArray[row-2][col+2].team == null){
								console.log("test3");
								this.fieldArray[row-2][col+2].tile.fillColor = 0xffff00;
								this.fieldArray[row-2][col+2].tile.setAlpha(0.3);
								this.fieldArray[row-2][col+2].selectable = true;
								possible = true;
							}
						}
					}
				}

				if(possible){
					this.selectedPiece = {
						row: row,
						col: col,
						piece: theTile
					};
					this.pieceSelected = true;
				}	
			}
		} else if(!this.pieceSelected){ //first click
            //console.log(`no selected piece to start`);
            if(theTile.team == null){
                //console.log("empty piece. can't select");
                return;
            }

            if(this.toMove == 'black'){ //black's turn
                if(theTile.team == 'black'){
                    let possible = false;

                    if(theTile.king == false){
                        if(col > 0){ //show available move spaces
                            if(this.fieldArray[row+1][col-1].team == null){
                                this.fieldArray[row+1][col-1].tile.fillColor = 0xffff00;
								this.fieldArray[row+1][col-1].tile.setAlpha(0.3);
                                this.fieldArray[row+1][col-1].selectable = true;
								possible = true;
                            } else if (col > 1 && row < 6 && this.fieldArray[row+1][col-1].team == 'red'){
								if (this.fieldArray[row+2][col-2].team == null){
									this.fieldArray[row+2][col-2].tile.fillColor = 0xffff00;
									this.fieldArray[row+2][col-2].tile.setAlpha(0.3);
									this.fieldArray[row+2][col-2].selectable = true;
									possible = true;
								}
							}
							
                            
                        }
                        if(col < 7) {
                            if(this.fieldArray[row+1][col+1].team == null){
                                this.fieldArray[row+1][col+1].tile.fillColor = 0xffff00;
								this.fieldArray[row+1][col+1].tile.setAlpha(0.3);
                                this.fieldArray[row+1][col+1].selectable = true;
								possible = true;
                            } else if(col < 6 && row < 6 && this.fieldArray[row+1][col+1].team == 'red'){
								if (this.fieldArray[row+2][col+2].team == null){
									this.fieldArray[row+2][col+2].tile.fillColor = 0xffff00;
									this.fieldArray[row+2][col+2].tile.setAlpha(0.3);
									this.fieldArray[row+2][col+2].selectable = true;
									possible = true;
								}
							}

							if(!possible){
								console.log("no possible moves");
							}
							
                            //console.log(this.fieldArray[4][3].selectable);
                            //console.log(this.fieldArray[row+1][col+1].tile.selectable)
                        }

						if(possible){
							this.selectedPiece = {
								row: row,
								col: col,
								piece: theTile
							};
							this.pieceSelected = true;
						}
                        
                    } else { //king
						if(col > 0){
							if(row > 0){ //up left
								if(this.fieldArray[row-1][col-1].team==null){
									this.fieldArray[row-1][col-1].tile.fillColor = 0xffff00;
									this.fieldArray[row-1][col-1].tile.setAlpha(0.3);
									this.fieldArray[row-1][col-1].selectable = true;
									possible = true;
								} else {
									if(col > 1 && row > 1 && this.fieldArray[row-1][col-1].team=='red'){
										if (this.fieldArray[row-2][col-2].team == null){
											this.fieldArray[row-2][col-2].tile.fillColor = 0xffff00;
											this.fieldArray[row-2][col-2].tile.setAlpha(0.3);
											this.fieldArray[row-2][col-2].selectable = true;
											possible = true;
										}
									}
								}
							}
							if(row < 7){ //down left
								if(this.fieldArray[row+1][col-1].team==null){
									this.fieldArray[row+1][col-1].tile.fillColor = 0xffff00;
									this.fieldArray[row+1][col-1].tile.setAlpha(0.3);
									this.fieldArray[row+1][col-1].selectable = true;
									possible = true;
								} else {
									if(col > 1 && row < 6 && this.fieldArray[row+1][col-1].team=='red'){
											if (this.fieldArray[row+2][col-2].team == null){
												this.fieldArray[row+2][col-2].tile.fillColor = 0xffff00;
												this.fieldArray[row+2][col-2].tile.setAlpha(0.3);
												this.fieldArray[row+2][col-2].selectable = true;
												possible = true;
											}
									}
								}
							}
						}
						if(col < 7){
							if(row > 0){ //up right
								if(this.fieldArray[row-1][col+1].team==null){
									this.fieldArray[row-1][col+1].tile.fillColor = 0xffff00;
									this.fieldArray[row-1][col+1].tile.setAlpha(0.3);
									this.fieldArray[row-1][col+1].selectable = true;
									possible = true;
								} else {
									if(col < 6 && row > 1 && this.fieldArray[row-1][col+1].team=='red'){
										if (this.fieldArray[row-2][col+2].team == null){
											this.fieldArray[row-2][col+2].tile.fillColor = 0xffff00;
											this.fieldArray[row-2][col+2].tile.setAlpha(0.3);
											this.fieldArray[row-2][col+2].selectable = true;
											possible = true;
										}
									}
								}
							}
							if(row < 7){ //down right
								if(this.fieldArray[row+1][col+1].team==null){
									this.fieldArray[row+1][col+1].tile.fillColor = 0xffff00;
									this.fieldArray[row+1][col+1].tile.setAlpha(0.3);
									this.fieldArray[row+1][col+1].selectable = true;
									possible = true;
								} else {
									if(col < 6 && row < 6 && this.fieldArray[row+1][col+1].team=='red'){
										if (this.fieldArray[row+2][col+2].team == null){
											this.fieldArray[row+2][col+2].tile.fillColor = 0xffff00;
											this.fieldArray[row+2][col+2].tile.setAlpha(0.3);
											this.fieldArray[row+2][col+2].selectable = true;
											possible = true;
										}
									}
								}
							}

						}
						if(possible){
							this.selectedPiece = {
                            row: row,
                            col: col,
                            piece: theTile
                        };
                        this.pieceSelected = true;
						}
					}
                }
            } else { //red's turn
                if(theTile.team == 'red'){
					let possible = false;
                    this.selectedPiece = {
                        row: row,
                        col: col,
                        piece: theTile
                    };

                    if(theTile.king == false){
                        if(col > 0){
                            //console.log(this.fieldArray[row-1][col-1].team);
                            if(this.fieldArray[row-1][col-1].team == null){
                                this.fieldArray[row-1][col-1].tile.fillColor = 0xffff00;
								this.fieldArray[row-1][col-1].tile.setAlpha(0.3);
                                this.fieldArray[row-1][col-1].selectable = true;
								possible = true;
                            } else if (col > 1 &&row > 1 && this.fieldArray[row-1][col-1].team == 'black'){
								if (this.fieldArray[row-2][col-2].team == null){
									this.fieldArray[row-2][col-2].tile.fillColor = 0xffff00;
									this.fieldArray[row-2][col-2].tile.setAlpha(0.3);
									this.fieldArray[row-2][col-2].selectable = true;
									possible = true;
								}
							}
							
                            
                        }
                        if(col < 7) {
                            if(this.fieldArray[row-1][col+1].team == null){
                                this.fieldArray[row-1][col+1].tile.fillColor = 0xffff00;
								this.fieldArray[row-1][col+1].tile.setAlpha(0.3);
                                this.fieldArray[row-1][col+1].selectable = true;
								possible = true;
                            } else if(col < 6 && row > 1 && this.fieldArray[row-1][col+1].team == 'black'){
								if (this.fieldArray[row-2][col+2].team == null){
									this.fieldArray[row-2][col+2].tile.fillColor = 0xffff00;
									this.fieldArray[row-2][col+1].tile.setAlpha(0.3);
									this.fieldArray[row-2][col+2].selectable = true;
									possible = true;
								}
							}
							
                        }

						if(possible){
							this.selectedPiece = {
								row: row,
								col: col,
								piece: theTile
							};
							this.pieceSelected = true;
						}
                        
                        
                    } else { //king
						//console.log("red king move");
						if(col > 0){
							if(row > 0){ //up left
								if(this.fieldArray[row-1][col-1].team==null){
									this.fieldArray[row-1][col-1].tile.fillColor = 0xffff00;
									this.fieldArray[row-1][col-1].tile.setAlpha(0.3);
									this.fieldArray[row-1][col-1].selectable = true;
									possible = true;
								} else {
									if(col > 1 && row > 1 && this.fieldArray[row-1][col-1].team=='black'){
										if (this.fieldArray[row-2][col-2].team == null){
											this.fieldArray[row-2][col-2].tile.fillColor = 0xffff00;
											this.fieldArray[row-2][col-2].tile.setAlpha(0.3);
											this.fieldArray[row-2][col-2].selectable = true;
											possible = true;
										}
									}
								}
							}
							if(row < 7){ //down left
								if(this.fieldArray[row+1][col-1].team==null){
									this.fieldArray[row+1][col-1].tile.fillColor = 0xffff00;
									this.fieldArray[row+1][col-1].tile.setAlpha(0.3);
									this.fieldArray[row+1][col-1].selectable = true;
									possible = true;
								} else {
									if(col > 1 && row < 6 && this.fieldArray[row+1][col-1].team=='black'){
											if (this.fieldArray[row+2][col-2].team == null){
												this.fieldArray[row+2][col-2].tile.fillColor = 0xffff00;
												this.fieldArray[row+2][col-2].tile.setAlpha(0.3);
												this.fieldArray[row+2][col-2].selectable = true;
												possible = true;
											}
									}
								}
							}
						}
						if(col < 7){
							if(row > 0){ //up right
								if(this.fieldArray[row-1][col+1].team==null){
									this.fieldArray[row-1][col+1].tile.fillColor = 0xffff00;
									this.fieldArray[row-1][col+1].tile.setAlpha(0.3);
									this.fieldArray[row-1][col+1].selectable = true;
									possible = true;
								} else {
									if(col < 6 && row > 1 && this.fieldArray[row-1][col+1].team=='black'){
										if (this.fieldArray[row-2][col+2].team == null){
											this.fieldArray[row-2][col+2].tile.fillColor = 0xffff00;
											this.fieldArray[row-2][col+2].tile.setAlpha(0.3);
											this.fieldArray[row-2][col+2].selectable = true;
											possible = true;
										}
									}
								}
							}
							if(row < 7){ //down right
								if(this.fieldArray[row+1][col+1].team==null){
									this.fieldArray[row+1][col+1].tile.fillColor = 0xffff00;
									this.fieldArray[row+1][col+1].tile.setAlpha(0.3);
									this.fieldArray[row+1][col+1].selectable = true;
									possible = true;
								} else {
									if(col < 6 && row < 6 && this.fieldArray[row+1][col+1].team=='black'){
										if (this.fieldArray[row+2][col+2].team == null){
											this.fieldArray[row+2][col+2].tile.fillColor = 0xffff00;
											this.fieldArray[row+2][col+2].tile.setAlpha(0.3);
											this.fieldArray[row+2][col+2].selectable = true;
											possible = true;
										}
									}
								}
							}

						}
						if(possible){
							this.selectedPiece = {
                            row: row,
                            col: col,
                            piece: theTile
                        };
                        this.pieceSelected = true;
						}
					}
                }
            }        
        } else {//2nd click
            console.log(`pre-Selected piece: Row:${this.selectedPiece.row}, Col:${this.selectedPiece.col}, team:${this.selectedPiece.piece.team}`)
            if(theTile.piece!=null){
                console.log("occupied tile");
                return;
            }
			

            if(this.toMove == 'red'){ //red's move
				
                if(this.selectedPiece.piece.team == 'red'){
                    //console.log("red selected");
                    //if(this.selectedPiece.piece.king == false){
                        
                        if(theTile.selectable != true){
                            return;
                        }
                        //console.log("valid tile selected");
                        //console.log(this.selectedPiece.piece.team);
                        //theTile.piece = this.selectedPiece.piece.piece;

                        //animate our piece movement
                        this.tweens.add({
                            targets: this.selectedPiece.piece.piece,
                            x: this.fieldArray[row][col].tile.x,
                            y: this.fieldArray[row][col].tile.y,
                            duration: 300,
                            ease: 'Power2'
                        });

						if(this.myColor == "red"){
							if(this.gametype == "custom"){
								this.socket.emit("checkersCustomRedMove", {row:this.selectedPiece.row, col: this.selectedPiece.col, me: this.me, opp: this.opp});
								this.socket.emit("checkersCustomRedMove", {row: row, col: col, me: this.me, opp:this.opp});
							} else {
								this.socket.emit("redMove", {row:this.selectedPiece.row, col: this.selectedPiece.col});
								this.socket.emit("redMove", {row: row, col: col});
							}
						}
						
                        
                        //update new tile
                        this.fieldArray[row][col].piece = this.selectedPiece.piece.piece;
                        this.fieldArray[row][col].team = this.selectedPiece.piece.team;
                        this.fieldArray[row][col].king = this.selectedPiece.piece.king;
						this.fieldArray[row][col].selectable = true;
						//check if king
						if(row == 0){
							//console.log("kinged");
							this.fieldArray[row][col].king = true;
							this.fieldArray[row][col].piece.setTexture('redKing');
						}

                        //update old tile
                        this.fieldArray[this.selectedPiece.row][this.selectedPiece.col].piece = null;
                        this.fieldArray[this.selectedPiece.row][this.selectedPiece.col].team = null;
                        this.fieldArray[this.selectedPiece.row][this.selectedPiece.col].king = false;
						this.fieldArray[this.selectedPiece.row][this.selectedPiece.col].selectable = false;

						let diff = Math.abs(row - this.selectedPiece.row);
						//console.log(diff);

						let jumped = false;

						if(diff == 2){//piece removed. need to clear
							if(row < this.selectedPiece.row){
								if(col < this.selectedPiece.col){
									//console.log("piece above and left");
									this.fieldArray[row+1][col+1].piece.destroy();
									this.fieldArray[row+1][col+1].piece = null;
									this.fieldArray[row+1][col+1].team = null;
									this.fieldArray[row+1][col+1].king = null;
									jumped = true
								} else {
									//console.log("piece above and right");
									this.fieldArray[row+1][col-1].piece.destroy();
									this.fieldArray[row+1][col-1].piece = null;
									this.fieldArray[row+1][col-1].team = null;
									this.fieldArray[row+1][col-1].king = null;
									jumped = true
								}
							} else {
								if(col < this.selectedPiece.col){
									//console.log("piece below and left");
									this.fieldArray[row-1][col+1].piece.destroy();
									this.fieldArray[row-1][col+1].piece = null;
									this.fieldArray[row-1][col+1].team = null;
									this.fieldArray[row-1][col+1].king = null;
									jumped = true
								} else {
									//console.log("piece below and right");
									this.fieldArray[row-1][col-1].piece.destroy();
									this.fieldArray[row-1][col-1].piece = null;
									this.fieldArray[row-1][col-1].team = null;
									this.fieldArray[row-1][col-1].king = null;
									jumped = true
								}
							}
						}

                        this.cleanUpBoard();
						if(jumped){
							let jumping = this.checkJumping();
							if(jumping.length != 0){
								console.log("can jump");
							} else {
								this.toMove = 'black'
							}
						} else {
							this.toMove = 'black';
						}
                        
                        this.pieceSelected = false;
                    //}      
                }
            } else {//black's move
                if(this.selectedPiece.piece.team == 'black'){
                    
                    //if(this.selectedPiece.piece.king == false){
                        
                        if(theTile.selectable != true){
                            return;
                        }
                        console.log("valid tile selected");
                        //console.log(this.selectedPiece.piece.team);
                        //theTile.piece = this.selectedPiece.piece.piece;

                        //animate our piece movement
                        this.tweens.add({
                            targets: this.selectedPiece.piece.piece,
                            x: this.fieldArray[row][col].tile.x,
                            y: this.fieldArray[row][col].tile.y,
                            duration: 300,
                            ease: 'Power2'
                        });

						if(this.myColor == "black"){
							if(this.gametype == "custom"){
								this.socket.emit("checkersCustomBlackMove", {row:this.selectedPiece.row, col: this.selectedPiece.col, me: this.me, opp: this.opp});
								this.socket.emit("checkersCustomBlackMove", {row: row, col: col, me: this.me, opp:this.opp});
							} else {
								this.socket.emit("blackMove", {row:this.selectedPiece.row, col: this.selectedPiece.col});
								this.socket.emit("blackMove", {row: row, col: col});
							}
						}
						
                        
                        //update new tile
                        this.fieldArray[row][col].piece = this.selectedPiece.piece.piece;
                        this.fieldArray[row][col].team = this.selectedPiece.piece.team;
                        this.fieldArray[row][col].king = this.selectedPiece.piece.king;
						//check if king
						if(row == 7){
							//console.log('kinged');
							this.fieldArray[row][col].king = true;
							this.fieldArray[row][col].piece.setTexture('blackKing');
						}

                        //update old tile
                        this.fieldArray[this.selectedPiece.row][this.selectedPiece.col].piece = null;
                        this.fieldArray[this.selectedPiece.row][this.selectedPiece.col].team = null;
                        this.fieldArray[this.selectedPiece.row][this.selectedPiece.col].king = false;

						let diff = Math.abs(row - this.selectedPiece.row);
						//console.log(diff);
						let jumped = false;

						if(diff == 2){//piece removed. need to clear
							if(row < this.selectedPiece.row){
								if(col < this.selectedPiece.col){
									//console.log("piece above and left");
									this.fieldArray[row+1][col+1].piece.destroy();
									this.fieldArray[row+1][col+1].piece = null;
									this.fieldArray[row+1][col+1].team = null;
									this.fieldArray[row+1][col+1].king = null;
									jumped = true
								} else {
									//console.log("piece above and right");
									this.fieldArray[row+1][col-1].piece.destroy();
									this.fieldArray[row+1][col-1].piece = null;
									this.fieldArray[row+1][col-1].team = null;
									this.fieldArray[row+1][col-1].king = null;
									jumped = true
								}
							} else {
								if(col < this.selectedPiece.col){
									//console.log("piece below and left");
									this.fieldArray[row-1][col+1].piece.destroy();
									this.fieldArray[row-1][col+1].piece = null;
									this.fieldArray[row-1][col+1].team = null;
									this.fieldArray[row-1][col+1].king = null;
									jumped = true
								} else {
									//console.log("piece below and right");
									this.fieldArray[row-1][col-1].piece.destroy();
									this.fieldArray[row-1][col-1].piece = null;
									this.fieldArray[row-1][col-1].team = null;
									this.fieldArray[row-1][col-1].king = null;
									jumped = true
								}
							}
						}

                        this.cleanUpBoard();

						if(jumped){
							let jumping = this.checkJumping();
							if(jumping.length != 0){
								console.log("can jump");
							} else {
								this.toMove = 'red';
							}
						} else {
							this.toMove = 'red';
						}
                        //this.toMove = 'red';
                        this.pieceSelected = false;
                        //console.log(theTile.team);

                    //}  
                }
            }
        } 
    }
}
