
// You can write more code here

/* START OF COMPILED CODE */


import Phaser from "phaser";

/* START-USER-IMPORTS */

/* END-USER-IMPORTS */

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

	
	checkGameOver(gameState:string [][]):void {
		for(let [i,x] of gameState.entries()){ //side to side
			if(i < 4){
				for(let [j,y] of x.entries()){
					if(gameState[i][j] !== 'x' && gameState[i][j] === gameState[i+1][j] && gameState[i+1][j] === gameState[i+2][j] && gameState[i+2][j] === gameState[i+3][j]){
						console.log(gameState[i][j] + ' WINS!!!')
						this.doGameOver(gameState[i][j])
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
					}
					}
				}
			}
		}
		return
	}

	globalGameState = [['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x']]

	circleList = []
	
	turn = 0;
	countCollum = [0,0,0,0,0,0,0]

	doGameOver(winner:string):void{
		console.log(winner + ' WINS FR!!!')
		this.globalGameState = [['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x'],['x','x','x','x','x','x','x']]
		this.turn = 0;
		this.countCollum = [0,0,0,0,0,0,0];
		this.circleList.forEach((circle) => {
			circle.destroy();
		})
	}

	async idkFunc(){

	}

	create() {

		this.editorCreate();


		const collumns = [this.rectangle, this.rectangle_1, this.rectangle_2, this.rectangle_3, this.rectangle_4, this.rectangle_5, this.rectangle_6]

        collumns.forEach((collumn) => {
            collumn.on('pointerdown', () => {
			  console.log(collumn.x);
			  let collumnNumber = Math.floor((collumn.x - 200)/100);
			  if(collumn.x === 196) collumnNumber = 0
			  if(this.countCollum[collumnNumber] < 6){
			  if(this.turn === 0){
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
			  this.turn = 1-this.turn;
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
        })



	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
