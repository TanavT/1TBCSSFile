
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import Phaser from "phaser";
import {Chess} from "chess.js";
import io from 'socket.io-client';
import { Socket } from "socket.io-client";
/* END-USER-IMPORTS */

export default class ChessGame extends Phaser.Scene {

	constructor() {
		super("ChessGame");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	socket:Socket;

	color:string;
	opponentColor:string;

	myTurn:boolean = false; //red goes first

	gameOver:boolean = false;

	gametype
	user

	init() {
		const user = this.game.registry.get("user");//USER IN PHASER 7 FINAL: get user
		if(user)
			console.log("got user: " + user.username);
		this.user = user

		const gametype = this.game.registry.get("gametype");
		console.log("got gametype: " + gametype);
		this.gametype = gametype;
	}

	preload(){
		this.cameras.main.setZoom(0.57); 
		this.cameras.main.centerOn(520,380)
		this.socket = io(`${import.meta.env.VITE_BACKEND_SERVER}`);

		this.socket.on('user_join', (id) => {
			//console.log('A user joined their id is ' + id);
			this.socket.emit("realSocketChessMania", this.user)
  		});

		this.socket.on('timer', ({timeFirst, timeSecond}) => {
			if(this.color == "white"){
				this.yourTimeText.text = `Your Time: ${this.formatTime(timeFirst)}`
				this.enemyTimeText.text = `Enemy Time: ${this.formatTime(timeSecond)}`
			}
			else{
				this.yourTimeText.text = `Your Time: ${this.formatTime(timeSecond)}`
				this.enemyTimeText.text = `Enemy Time: ${this.formatTime(timeFirst)}`
			}
			if(timeFirst == 0 && this.gameOver == false){
				this.socket.emit("gameDone", {game: "chess", winner: "black"});
				this.gameOver = true
				this.winBlack.visible = true
			}
			if(timeSecond == 0 && this.gameOver == false){
				this.socket.emit("gameDone", {game: "chess", winner: "white"});
				this.gameOver = true
				this.winWhite.visible = true
			}
  		});
		
		this.socket.on('color', ({id, color}) => {
			if (this.socket.id == id){
				if(color == 'white'){
					this.color="white"
					this.opponentColor="black"
				}
				else{
					this.color="black"
					this.opponentColor="white"
				}
			}
			else{
				if(color == 'white'){
					this.color="black"
					this.opponentColor="white"
				}
				else{
					this.color="white"
					this.opponentColor="black"
				}
			}
			//console.log("COLOR:" + this.color)
			this.myTurn = (this.color == "white")
			let temp = "First"
			if(this.color == "black") temp = "Second"
			this.yourColorText.text = `You Go: ${temp}`
			let temp2 = "Turn: Yours"
			if(this.color == "black") temp2 = "Turn: Opponent's"
			this.turnText.text = temp2
  		})

		this.socket.on('error', ({id, message}) => {
			//console.log("I am "+id+" and the message is: " + message)
		})

		this.socket.on("yourTurn", (data) => {
			this.myTurn = true
			this.turnText.text = "Turn: Yours"
			//console.log("MY TURN CHESS")
		} )

		this.socket.on("allOver", (whoWon) => {
			console.log("ITS ALL OVER FOLKS" + whoWon)
			this.gameOver = true
			this.blackRectangle.visible = true
			this.yourTimeText.visible = false
			this.enemyTimeText.visible = false
			if(whoWon == "first" && this.color == "white"){
				this.youWin.visible = true
			}
			else if(whoWon == "first" && this.color == "black"){
				this.opponentWins.visible = true
			}
			else if(whoWon == "second" && this.color == "black"){
				this.youWin.visible = true
			}
			else if(whoWon == "second" && this.color == "white"){
				this.opponentWins.visible = true
			}
			else if (whoWon == "tie"){
				this.yallTie.visible = true
			}

		})

		this.socket.on("otherPlaced", ({promote, promoteLetter, promoteTexture, startSquareStr, destinationSquareStr, castleStr}) => {
			let startSquareInt = this.squareToNumberConverter(startSquareStr)
			let destSquareInt = this.squareToNumberConverter(destinationSquareStr)
			//console.log("int int int" + startSquareInt)
			//console.log(destSquareInt)
			//console.log(startSquareStr)
			//console.log(destinationSquareStr)
			var ttt = this.tweens.add({
			targets: [this.piecesOnSquares[startSquareInt]],
			y: {from: this.piecesOnSquares[startSquareInt].y, to: this.squares[destSquareInt].y},
			x: {from: this.piecesOnSquares[startSquareInt].x, to: this.squares[destSquareInt].x},
			duration: 200,
			easing: 'bounce',
			yoyo: false,
			paused: true
			})

			if(promote){
				//console.log("promote promote promote")
				this.chess.move({from: startSquareStr, to: destinationSquareStr, promotion: promoteLetter})
				this.piecesOnSquares[startSquareInt].setTexture(promoteTexture)
			}
			else
				this.chess.move({from: startSquareStr, to: destinationSquareStr})

			if(castleStr.length !== 0){
				if(chess.turn() == 'b'){
							if(thisNumber == 62){//king side black
								var tttt = this.tweens.add({
								targets: [this.piecesOnSquares[63]],
								y: {from: this.piecesOnSquares[63].y, to: this.squares[61].y},
								x: {from: this.piecesOnSquares[63].x, to: this.squares[61].x},
								duration: 200,
								easing: 'bounce',
								yoyo: false,
								paused: true
								})
							}
							else{
								var tttt = this.tweens.add({
								targets: [this.piecesOnSquares[56]],
								y: {from: this.piecesOnSquares[56].y, to: this.squares[59].y},
								x: {from: this.piecesOnSquares[56].x, to: this.squares[59].x},
								duration: 200,
								easing: 'bounce',
								yoyo: false,
								paused: true
								})
							}
						}


						else{
							if(thisNumber == 6){//king side white
								var tttt = this.tweens.add({
								targets: [this.piecesOnSquares[7]],
								y: {from: this.piecesOnSquares[7].y, to: this.squares[5].y},
								x: {from: this.piecesOnSquares[7].x, to: this.squares[5].x},
								duration: 200,
								easing: 'bounce',
								yoyo: false,
								paused: true
								})
							}
							else{
								var tttt = this.tweens.add({
								targets: [this.piecesOnSquares[0]],
								y: {from: this.piecesOnSquares[0].y, to: this.squares[3].y},
								x: {from: this.piecesOnSquares[0].x, to: this.squares[3].x},
								duration: 200,
								easing: 'bounce',
								yoyo: false,
								paused: true
								})
							}
						}




				tttt.play()
			}

			let temp = this.chess.get(destinationSquareStr)
			let typePiece;
			if(temp !== undefined) typePiece = temp.type.toUpperCase()


			if(this.piecesOnSquares[destSquareInt] !== null) {
							this.piecesOnSquares[destSquareInt].destroy()
					}
			else if(typePiece == 'P' && this.numberToSquareConverter(destSquareInt)[0] !== destinationSquareStr[0])
				{
					if(chess.turn() == 'b')
						this.piecesOnSquares[destSquareInt-8].destroy()
					else
						this.piecesOnSquares[destSquareInt+8].destroy()
				}
			this.piecesOnSquares[destSquareInt] = this.piecesOnSquares[startSquareInt];
			this.piecesOnSquares[startSquareInt] = null
			ttt.play()
			//this.myTurn = true
			


			if(this.chess.isGameOver()){
				this.gameOver = true
				//rectangle_1.visible = true
				if(this.chess.isCheckmate()){
					if(this.chess.turn() == 'b'){
						this.winWhite.visible = true
						this.socket.emit("gameDone", {game: "chess", winner: "white"});
					}
					else {this.winBlack.visible = true
					this.socket.emit("gameDone", {game: "chess", winner: "black"});
					}
				}
				else{
					this.socket.emit("gameDone", {game: "chess", winner: "tie"});
				}
				if(this.chess.isStalemate()){
					this.stalemate.visible = true
				}
				if(this.chess.isInsufficientMaterial()) this.insufficient.visible = true
				if(this.chess.isDrawByFiftyMoves()) this._50move.visible = true
				if(this.chess.isThreefoldRepetition()) this.repetition.visible = true
			}


		})

		this.load.image(
		'blackKingChess',
		'assets/blackKingChess.png'
		);
	}

	editorCreate(): void {

		// chessboard
		const chessboard = this.add.image(512, 384, "chessboard");
		chessboard.scaleX = 2.6;
		chessboard.scaleY = 2.6;
		chessboard.angle = 90;
		chessboard.setCrop(10,0, 270, 300)

		// location_dot_grey_svg_0
		const location_dot_grey_svg_0 = this.add.image(215, 681, "Location_dot_grey.svg");
		location_dot_grey_svg_0.scaleX = 0.03;
		location_dot_grey_svg_0.scaleY = 0.03;

		// location_dot_grey_svg_1
		const location_dot_grey_svg_1 = this.add.image(300, 681, "Location_dot_grey.svg");
		location_dot_grey_svg_1.scaleX = 0.03;
		location_dot_grey_svg_1.scaleY = 0.03;

		// location_dot_grey_svg_2
		const location_dot_grey_svg_2 = this.add.image(386, 681, "Location_dot_grey.svg");
		location_dot_grey_svg_2.scaleX = 0.03;
		location_dot_grey_svg_2.scaleY = 0.03;

		// location_dot_grey_svg_3
		const location_dot_grey_svg_3 = this.add.image(471.0994236485258, 681.3830085006905, "Location_dot_grey.svg");
		location_dot_grey_svg_3.scaleX = 0.03;
		location_dot_grey_svg_3.scaleY = 0.03;

		// location_dot_grey_svg_4
		const location_dot_grey_svg_4 = this.add.image(559, 681, "Location_dot_grey.svg");
		location_dot_grey_svg_4.scaleX = 0.03;
		location_dot_grey_svg_4.scaleY = 0.03;

		// location_dot_grey_svg_5
		const location_dot_grey_svg_5 = this.add.image(643, 681, "Location_dot_grey.svg");
		location_dot_grey_svg_5.scaleX = 0.03;
		location_dot_grey_svg_5.scaleY = 0.03;

		// location_dot_grey_svg_6
		const location_dot_grey_svg_6 = this.add.image(729, 681, "Location_dot_grey.svg");
		location_dot_grey_svg_6.scaleX = 0.03;
		location_dot_grey_svg_6.scaleY = 0.03;

		// location_dot_grey_svg_7
		const location_dot_grey_svg_7 = this.add.image(814.5727809508551, 680.811723867497, "Location_dot_grey.svg");
		location_dot_grey_svg_7.scaleX = 0.03;
		location_dot_grey_svg_7.scaleY = 0.03;
		location_dot_grey_svg_7.alpha = 0.5;
		location_dot_grey_svg_7.alphaTopLeft = 0.5;
		location_dot_grey_svg_7.alphaTopRight = 0.5;
		location_dot_grey_svg_7.alphaBottomLeft = 0.5;
		location_dot_grey_svg_7.alphaBottomRight = 0.5;

		// location_dot_grey_svg_8
		const location_dot_grey_svg_8 = this.add.image(214.10698645544562, 594.7761008054026, "Location_dot_grey.svg");
		location_dot_grey_svg_8.scaleX = 0.03;
		location_dot_grey_svg_8.scaleY = 0.03;

		// location_dot_grey_svg_9
		const location_dot_grey_svg_9 = this.add.image(299.1069864554456, 594.7761008054026, "Location_dot_grey.svg");
		location_dot_grey_svg_9.scaleX = 0.03;
		location_dot_grey_svg_9.scaleY = 0.03;

		// location_dot_grey_svg_10
		const location_dot_grey_svg_10 = this.add.image(385.1069864554456, 594.7761008054026, "Location_dot_grey.svg");
		location_dot_grey_svg_10.scaleX = 0.03;
		location_dot_grey_svg_10.scaleY = 0.03;

		// location_dot_grey_svg_11
		const location_dot_grey_svg_11 = this.add.image(470.2064127249769, 595.1590964108714, "Location_dot_grey.svg");
		location_dot_grey_svg_11.scaleX = 0.03;
		location_dot_grey_svg_11.scaleY = 0.03;

		// location_dot_grey_svg_12
		const location_dot_grey_svg_12 = this.add.image(558.1069864554456, 594.7761008054026, "Location_dot_grey.svg");
		location_dot_grey_svg_12.scaleX = 0.03;
		location_dot_grey_svg_12.scaleY = 0.03;

		// location_dot_grey_svg_13
		const location_dot_grey_svg_13 = this.add.image(642.1069864554456, 594.7761008054026, "Location_dot_grey.svg");
		location_dot_grey_svg_13.scaleX = 0.03;
		location_dot_grey_svg_13.scaleY = 0.03;

		// location_dot_grey_svg_14
		const location_dot_grey_svg_14 = this.add.image(728.1069864554456, 594.7761008054026, "Location_dot_grey.svg");
		location_dot_grey_svg_14.scaleX = 0.03;
		location_dot_grey_svg_14.scaleY = 0.03;

		// location_dot_grey_svg_15
		const location_dot_grey_svg_15 = this.add.image(813.6797403616956, 594.5878073483714, "Location_dot_grey.svg");
		location_dot_grey_svg_15.scaleX = 0.03;
		location_dot_grey_svg_15.scaleY = 0.03;

		// location_dot_grey_svg_16
		const location_dot_grey_svg_16 = this.add.image(216, 509, "Location_dot_grey.svg");
		location_dot_grey_svg_16.scaleX = 0.03;
		location_dot_grey_svg_16.scaleY = 0.03;

		// location_dot_grey_svg_17
		const location_dot_grey_svg_17 = this.add.image(301, 509, "Location_dot_grey.svg");
		location_dot_grey_svg_17.scaleX = 0.03;
		location_dot_grey_svg_17.scaleY = 0.03;

		// location_dot_grey_svg_18
		const location_dot_grey_svg_18 = this.add.image(387, 509, "Location_dot_grey.svg");
		location_dot_grey_svg_18.scaleX = 0.03;
		location_dot_grey_svg_18.scaleY = 0.03;

		// location_dot_grey_svg_19
		const location_dot_grey_svg_19 = this.add.image(472, 510, "Location_dot_grey.svg");
		location_dot_grey_svg_19.scaleX = 0.03;
		location_dot_grey_svg_19.scaleY = 0.03;

		// location_dot_grey_svg_20
		const location_dot_grey_svg_20 = this.add.image(560, 509, "Location_dot_grey.svg");
		location_dot_grey_svg_20.scaleX = 0.03;
		location_dot_grey_svg_20.scaleY = 0.03;

		// location_dot_grey_svg_21
		const location_dot_grey_svg_21 = this.add.image(644, 509, "Location_dot_grey.svg");
		location_dot_grey_svg_21.scaleX = 0.03;
		location_dot_grey_svg_21.scaleY = 0.03;

		// location_dot_grey_svg_22
		const location_dot_grey_svg_22 = this.add.image(730, 509, "Location_dot_grey.svg");
		location_dot_grey_svg_22.scaleX = 0.03;
		location_dot_grey_svg_22.scaleY = 0.03;

		// location_dot_grey_svg_23
		const location_dot_grey_svg_23 = this.add.image(815, 509, "Location_dot_grey.svg");
		location_dot_grey_svg_23.scaleX = 0.03;
		location_dot_grey_svg_23.scaleY = 0.03;

		// location_dot_grey_svg_24
		const location_dot_grey_svg_24 = this.add.image(214, 423, "Location_dot_grey.svg");
		location_dot_grey_svg_24.scaleX = 0.03;
		location_dot_grey_svg_24.scaleY = 0.03;

		// location_dot_grey_svg_25
		const location_dot_grey_svg_25 = this.add.image(299, 423, "Location_dot_grey.svg");
		location_dot_grey_svg_25.scaleX = 0.03;
		location_dot_grey_svg_25.scaleY = 0.03;

		// location_dot_grey_svg_26
		const location_dot_grey_svg_26 = this.add.image(385, 423, "Location_dot_grey.svg");
		location_dot_grey_svg_26.scaleX = 0.03;
		location_dot_grey_svg_26.scaleY = 0.03;

		// location_dot_grey_svg_27
		const location_dot_grey_svg_27 = this.add.image(470, 424, "Location_dot_grey.svg");
		location_dot_grey_svg_27.scaleX = 0.03;
		location_dot_grey_svg_27.scaleY = 0.03;

		// location_dot_grey_svg_28
		const location_dot_grey_svg_28 = this.add.image(558, 423, "Location_dot_grey.svg");
		location_dot_grey_svg_28.scaleX = 0.03;
		location_dot_grey_svg_28.scaleY = 0.03;

		// location_dot_grey_svg_29
		const location_dot_grey_svg_29 = this.add.image(642, 423, "Location_dot_grey.svg");
		location_dot_grey_svg_29.scaleX = 0.03;
		location_dot_grey_svg_29.scaleY = 0.03;

		// location_dot_grey_svg_30
		const location_dot_grey_svg_30 = this.add.image(728, 423, "Location_dot_grey.svg");
		location_dot_grey_svg_30.scaleX = 0.03;
		location_dot_grey_svg_30.scaleY = 0.03;

		// location_dot_grey_svg_31
		const location_dot_grey_svg_31 = this.add.image(813, 423, "Location_dot_grey.svg");
		location_dot_grey_svg_31.scaleX = 0.03;
		location_dot_grey_svg_31.scaleY = 0.03;

		// location_dot_grey_svg_32
		const location_dot_grey_svg_32 = this.add.image(214.4816027810526, 340.24906467163055, "Location_dot_grey.svg");
		location_dot_grey_svg_32.scaleX = 0.03;
		location_dot_grey_svg_32.scaleY = 0.03;

		// location_dot_grey_svg_33
		const location_dot_grey_svg_33 = this.add.image(299.48160278105263, 340.24906467163055, "Location_dot_grey.svg");
		location_dot_grey_svg_33.scaleX = 0.03;
		location_dot_grey_svg_33.scaleY = 0.03;

		// location_dot_grey_svg_34
		const location_dot_grey_svg_34 = this.add.image(385.48160278105263, 340.24906467163055, "Location_dot_grey.svg");
		location_dot_grey_svg_34.scaleX = 0.03;
		location_dot_grey_svg_34.scaleY = 0.03;

		// location_dot_grey_svg_35
		const location_dot_grey_svg_35 = this.add.image(470.5810290505839, 340.6320602770993, "Location_dot_grey.svg");
		location_dot_grey_svg_35.scaleX = 0.03;
		location_dot_grey_svg_35.scaleY = 0.03;

		// location_dot_grey_svg_36
		const location_dot_grey_svg_36 = this.add.image(558.4816027810526, 340.24906467163055, "Location_dot_grey.svg");
		location_dot_grey_svg_36.scaleX = 0.03;
		location_dot_grey_svg_36.scaleY = 0.03;

		// location_dot_grey_svg_37
		const location_dot_grey_svg_37 = this.add.image(642.4816027810526, 340.24906467163055, "Location_dot_grey.svg");
		location_dot_grey_svg_37.scaleX = 0.03;
		location_dot_grey_svg_37.scaleY = 0.03;

		// location_dot_grey_svg_38
		const location_dot_grey_svg_38 = this.add.image(728.4816027810526, 340.24906467163055, "Location_dot_grey.svg");
		location_dot_grey_svg_38.scaleX = 0.03;
		location_dot_grey_svg_38.scaleY = 0.03;

		// location_dot_grey_svg_39
		const location_dot_grey_svg_39 = this.add.image(814.0543566873026, 340.0607712145993, "Location_dot_grey.svg");
		location_dot_grey_svg_39.scaleX = 0.03;
		location_dot_grey_svg_39.scaleY = 0.03;

		// location_dot_grey_svg_40
		const location_dot_grey_svg_40 = this.add.image(214, 254, "Location_dot_grey.svg");
		location_dot_grey_svg_40.scaleX = 0.03;
		location_dot_grey_svg_40.scaleY = 0.03;

		// location_dot_grey_svg_41
		const location_dot_grey_svg_41 = this.add.image(299, 254, "Location_dot_grey.svg");
		location_dot_grey_svg_41.scaleX = 0.03;
		location_dot_grey_svg_41.scaleY = 0.03;

		// location_dot_grey_svg_42
		const location_dot_grey_svg_42 = this.add.image(385, 254, "Location_dot_grey.svg");
		location_dot_grey_svg_42.scaleX = 0.03;
		location_dot_grey_svg_42.scaleY = 0.03;

		// location_dot_grey_svg_43
		const location_dot_grey_svg_43 = this.add.image(470, 254, "Location_dot_grey.svg");
		location_dot_grey_svg_43.scaleX = 0.03;
		location_dot_grey_svg_43.scaleY = 0.03;

		// location_dot_grey_svg_44
		const location_dot_grey_svg_44 = this.add.image(558, 254, "Location_dot_grey.svg");
		location_dot_grey_svg_44.scaleX = 0.03;
		location_dot_grey_svg_44.scaleY = 0.03;

		// location_dot_grey_svg_45
		const location_dot_grey_svg_45 = this.add.image(642, 254, "Location_dot_grey.svg");
		location_dot_grey_svg_45.scaleX = 0.03;
		location_dot_grey_svg_45.scaleY = 0.03;

		// location_dot_grey_svg_46
		const location_dot_grey_svg_46 = this.add.image(728, 254, "Location_dot_grey.svg");
		location_dot_grey_svg_46.scaleX = 0.03;
		location_dot_grey_svg_46.scaleY = 0.03;

		// location_dot_grey_svg_47
		const location_dot_grey_svg_47 = this.add.image(813, 254, "Location_dot_grey.svg");
		location_dot_grey_svg_47.scaleX = 0.03;
		location_dot_grey_svg_47.scaleY = 0.03;

		// location_dot_grey_svg_48
		const location_dot_grey_svg_48 = this.add.image(214, 169, "Location_dot_grey.svg");
		location_dot_grey_svg_48.scaleX = 0.03;
		location_dot_grey_svg_48.scaleY = 0.03;

		// location_dot_grey_svg_49
		const location_dot_grey_svg_49 = this.add.image(299, 169, "Location_dot_grey.svg");
		location_dot_grey_svg_49.scaleX = 0.03;
		location_dot_grey_svg_49.scaleY = 0.03;

		// location_dot_grey_svg_50
		const location_dot_grey_svg_50 = this.add.image(385, 169, "Location_dot_grey.svg");
		location_dot_grey_svg_50.scaleX = 0.03;
		location_dot_grey_svg_50.scaleY = 0.03;

		// location_dot_grey_svg_51
		const location_dot_grey_svg_51 = this.add.image(470, 170, "Location_dot_grey.svg");
		location_dot_grey_svg_51.scaleX = 0.03;
		location_dot_grey_svg_51.scaleY = 0.03;

		// location_dot_grey_svg_52
		const location_dot_grey_svg_52 = this.add.image(558, 169, "Location_dot_grey.svg");
		location_dot_grey_svg_52.scaleX = 0.03;
		location_dot_grey_svg_52.scaleY = 0.03;

		// location_dot_grey_svg_53
		const location_dot_grey_svg_53 = this.add.image(642, 169, "Location_dot_grey.svg");
		location_dot_grey_svg_53.scaleX = 0.03;
		location_dot_grey_svg_53.scaleY = 0.03;

		// location_dot_grey_svg_54
		const location_dot_grey_svg_54 = this.add.image(728, 169, "Location_dot_grey.svg");
		location_dot_grey_svg_54.scaleX = 0.03;
		location_dot_grey_svg_54.scaleY = 0.03;

		// location_dot_grey_svg_55
		const location_dot_grey_svg_55 = this.add.image(814, 169, "Location_dot_grey.svg");
		location_dot_grey_svg_55.scaleX = 0.03;
		location_dot_grey_svg_55.scaleY = 0.03;

		// location_dot_grey_svg_56
		const location_dot_grey_svg_56 = this.add.image(212, 83, "Location_dot_grey.svg");
		location_dot_grey_svg_56.setInteractive(new Phaser.Geom.Rectangle(-300, -300, 2700, 2700), Phaser.Geom.Rectangle.Contains);
		location_dot_grey_svg_56.scaleX = 0.03;
		location_dot_grey_svg_56.scaleY = 0.03;

		// location_dot_grey_svg_57
		const location_dot_grey_svg_57 = this.add.image(297, 83, "Location_dot_grey.svg");
		location_dot_grey_svg_57.scaleX = 0.03;
		location_dot_grey_svg_57.scaleY = 0.03;

		// location_dot_grey_svg_58
		const location_dot_grey_svg_58 = this.add.image(383, 80, "Location_dot_grey.svg");
		location_dot_grey_svg_58.scaleX = 0.03;
		location_dot_grey_svg_58.scaleY = 0.03;

		// location_dot_grey_svg_59
		const location_dot_grey_svg_59 = this.add.image(468, 84, "Location_dot_grey.svg");
		location_dot_grey_svg_59.scaleX = 0.03;
		location_dot_grey_svg_59.scaleY = 0.03;

		// location_dot_grey_svg_60
		const location_dot_grey_svg_60 = this.add.image(556, 83, "Location_dot_grey.svg");
		location_dot_grey_svg_60.scaleX = 0.03;
		location_dot_grey_svg_60.scaleY = 0.03;

		// location_dot_grey_svg_61
		const location_dot_grey_svg_61 = this.add.image(640, 83, "Location_dot_grey.svg");
		location_dot_grey_svg_61.scaleX = 0.03;
		location_dot_grey_svg_61.scaleY = 0.03;

		// location_dot_grey_svg_62
		const location_dot_grey_svg_62 = this.add.image(726, 83, "Location_dot_grey.svg");
		location_dot_grey_svg_62.scaleX = 0.03;
		location_dot_grey_svg_62.scaleY = 0.03;

		// location_dot_grey_svg_63
		const location_dot_grey_svg_63 = this.add.image(812, 83, "Location_dot_grey.svg");
		location_dot_grey_svg_63.scaleX = 0.03;
		location_dot_grey_svg_63.scaleY = 0.03;

		// rectangle_1

		// yourColorText
		const yourColorText = this.add.text(300, 770, "", {});
		yourColorText.text = "Your Color: none";
		yourColorText.setStyle({ "fontFamily": "Times", "fontSize": "40px" });
		yourColorText.setWordWrapWidth(10);
		this.yourColorText = yourColorText

		// turnText
		const turnText = this.add.text(700, 770, "", {});
		turnText.text = "Turn: none";
		turnText.setStyle({ "fontFamily": "Times", "fontSize": "40px" });
		turnText.setWordWrapWidth(10);
		this.turnText = turnText

		// yourTimeText
		const yourTimeText = this.add.text(300, -120, "", {});
		yourTimeText.text = "Your time: 10:00\n";
		yourTimeText.setStyle({ "fontFamily": "Times", "fontSize": "40px" });
		yourTimeText.setWordWrapWidth(10);
		this.yourTimeText = yourTimeText

		// enemyTimeText
		const enemyTimeText = this.add.text(700, -120, "", {});
		enemyTimeText.text = "Enemy timer: 10:00\n";
		enemyTimeText.setStyle({ "fontFamily": "Times", "fontSize": "40px" });
		enemyTimeText.setWordWrapWidth(10);
		this.enemyTimeText = enemyTimeText

		const rectangle_1 = this.add.rectangle(512, 384, 128, 128);
		rectangle_1.scaleX = 8;
		rectangle_1.scaleY = 6;
		rectangle_1.visible = false;
		rectangle_1.isFilled = true;
		rectangle_1.fillColor = 0;
		rectangle_1.alpha = 0.5;
		rectangle_1.alphaTopLeft = 0.5;
		rectangle_1.alphaTopRight = 0.5;
		rectangle_1.alphaBottomLeft = 0.5;
		rectangle_1.alphaBottomRight = 0.5;
		this.blackRectangle = rectangle_1

		const youWinText = this.add.text(260, -120, "", {});
		youWinText.text = "YOU WIN";
		youWinText.visible = false
		youWinText.setStyle({ "fontFamily": "Times", "fontSize": "80px" });

		this.youWin = youWinText

		const opponentWins = this.add.text(230, -120, "", {});
		opponentWins.text = "OPPONENT WINS";
		opponentWins.visible = false
		opponentWins.setStyle({ "fontFamily": "Times", "fontSize": "80px" });

		this.opponentWins = opponentWins

		const yallTie = this.add.text(250, -120, "", {});
		yallTie.text = "TIE GAME";
		yallTie.visible = false
		yallTie.setStyle({ "fontFamily": "Times", "fontSize": "80px" });

		this.yallTie = yallTie

		for(let x = 0; x < 64; x++){
			this.squares.push(eval(`location_dot_grey_svg_${x.toString()}`))
			// //console.log(this.squares.length)
			// //console.log(this.squares[x].name)
		}

		this.events.emit("scene-awake");
	}

	yourColorText
	turnText
	yourTimeText
	enemyTimeText

	blackRectangle

	youWin
	opponentWins
	yallTie
	/* START-USER-CODE */

	// Write your code here

	numberToSquareConverter(numberParam: integer): string{
		let letterFinal = 'X'
		let numberFinal = Math.floor(numberParam/8) + 1
		//console.log(numberParam)
		 //console.log(numberParam % 8)
		 //console.log(typeof(numberParam))
		switch (numberParam % 8){
			case 0:
				letterFinal ='a'
				break;
			case 1:
				letterFinal ='b'
				break;
			case 2:
				letterFinal ='c'
				break;
			case 3:
				letterFinal ='d'
				break;
			case 4:
				letterFinal ='e'
				break;
			case 5:
				letterFinal ='f'
				break;
			case 6:
				letterFinal ='g'
				break;
			case 7:
				letterFinal ='h'
				break;
			default:
				//console.log("numConverterBroke")
				break;
		}
		return letterFinal + numberFinal.toString()
	}
	squareToNumberConverter(squareParam: string): number{
		if(squareParam.length == 2)
			return squareParam.charCodeAt(0) - 97 + (8 * (Number(squareParam[1]) - 1))
		else
			return squareParam.charCodeAt(1) - 97 + (8 * (Number(squareParam[2]) - 1))
	}

	squares = [];

	piecesOnSquares = new Array(64).fill(null)

	upgradeWhiteArr = [];
	upgradeBlackArr = [];

	chosenUpgrade = "";
	chosenUpgradeLetter = "";

	// for(let x = 0; x < 64; x++){
	// 		this.squares.push(eval(`location_dot_grey_svg_${x.toString()}`))
	// 		//console.log(this.squares.length)
	// 		//console.log(this.squares[x].name)
	// 	}

	chess = new Chess()

	winWhite
	winBlack
	stalemate
	repetition
	insufficient
	_50move

	create() {

		this.editorCreate();

		const whiteRook = this.add.image(this.squares[0].x, this.squares[0].y + 5, "whiteRook");
		whiteRook.scaleX = 1.6;
		whiteRook.scaleY = 1.6;
		this.piecesOnSquares[0] = whiteRook

		const whiteRook2 = this.add.image(this.squares[7].x, this.squares[7].y + 5, "whiteRook");
		whiteRook2.scaleX = 1.6;
		whiteRook2.scaleY = 1.6;
		this.piecesOnSquares[7] = whiteRook2

		const blackRook = this.add.image(this.squares[56].x, this.squares[56].y, "blackRook");
		blackRook.scaleX = 1.6;
		blackRook.scaleY = 1.6;
		this.piecesOnSquares[56] = blackRook
		const blackRook2 = this.add.image(this.squares[63].x, this.squares[63].y, "blackRook");
		blackRook2.scaleX = 1.6;
		blackRook2.scaleY = 1.6;
		this.piecesOnSquares[63] = blackRook2

		const whiteKnight = this.add.image(this.squares[1].x, this.squares[1].y + 5, "whiteKnight");
		whiteKnight.scaleX = 1.6;
		whiteKnight.scaleY = 1.6;
		this.piecesOnSquares[1] = whiteKnight
		const whiteKnight2 = this.add.image(this.squares[6].x, this.squares[6].y + 5, "whiteKnight");
		whiteKnight2.scaleX = 1.6;
		whiteKnight2.scaleY = 1.6;
		this.piecesOnSquares[6] = whiteKnight2

		const blackKnight = this.add.image(this.squares[57].x, this.squares[57].y, "blackKnight");
		blackKnight.scaleX = 1.6;
		blackKnight.scaleY = 1.6;
		this.piecesOnSquares[57] = blackKnight
		const blackKnight2 = this.add.image(this.squares[62].x, this.squares[62].y, "blackKnight");
		blackKnight2.scaleX = 1.6;
		blackKnight2.scaleY = 1.6;
		this.piecesOnSquares[62] = blackKnight2

		const whiteBishop = this.add.image(this.squares[2].x, this.squares[2].y + 5, "whiteBishop");
		whiteBishop.scaleX = 1.6;
		whiteBishop.scaleY = 1.6;
		this.piecesOnSquares[2] = whiteBishop
		const whiteBishop2 = this.add.image(this.squares[5].x, this.squares[5].y + 5, "whiteBishop");
		whiteBishop2.scaleX = 1.6;
		whiteBishop2.scaleY = 1.6;
		this.piecesOnSquares[5] = whiteBishop2

		const blackBishop = this.add.image(this.squares[58].x, this.squares[58].y, "blackBishop");
		blackBishop.scaleX = 1.6;
		blackBishop.scaleY = 1.6;
		this.piecesOnSquares[58] = blackBishop
		const blackBishop2 = this.add.image(this.squares[61].x, this.squares[61].y, "blackBishop");
		blackBishop2.scaleX = 1.6;
		blackBishop2.scaleY = 1.6;
		this.piecesOnSquares[61] = blackBishop2

		const whiteKing = this.add.image(this.squares[4].x, this.squares[4].y + 5, "whiteKing");
		whiteKing.scaleX = 1.6;
		whiteKing.scaleY = 1.6;
		this.piecesOnSquares[4] = whiteKing
		const whiteQueen = this.add.image(this.squares[3].x, this.squares[3].y + 5, "whiteQueen");
		whiteQueen.scaleX = 1.6;
		whiteQueen.scaleY = 1.6;
		this.piecesOnSquares[3] = whiteQueen

		const blackKing = this.add.image(this.squares[60].x, this.squares[60].y, "blackKingChess");
		blackKing.scaleX = 1.6;
		blackKing.scaleY = 1.6;
		this.piecesOnSquares[60] = blackKing
		const blackQueen = this.add.image(this.squares[59].x, this.squares[59].y, "blackQueen");
		blackQueen.scaleX = 1.6;
		blackQueen.scaleY = 1.6;
		this.piecesOnSquares[59] = blackQueen


		for(let iter = 8; iter <= 15; iter++){
			const whitePawn = this.add.image(this.squares[iter].x, this.squares[iter].y + 5, "whitePawn");
			whitePawn.scaleX = 1.6;
			whitePawn.scaleY = 1.6;
			this.piecesOnSquares[iter] = whitePawn
		}
		for(let iter = 48; iter <= 55; iter++){
			const blackPawn = this.add.image(this.squares[iter].x, this.squares[iter].y, "blackPawn");
			blackPawn.scaleX = 1.6;
			blackPawn.scaleY = 1.6;
			this.piecesOnSquares[iter] = blackPawn
		}


		// chooseUpgradeBlack
		const chooseUpgradeBlack = this.add.rectangle(516, 381, 128, 128);
		chooseUpgradeBlack.scaleX = 4;
		chooseUpgradeBlack.isFilled = true;
		this.upgradeBlackArr.push(chooseUpgradeBlack)

		// blackKnightUpgrade
		const blackKnightUpgrade = this.add.image(329, 383, "blackKnight");
		blackKnightUpgrade.setInteractive(new Phaser.Geom.Rectangle(0, 0, 60, 60), Phaser.Geom.Rectangle.Contains);
		blackKnightUpgrade.scaleX = 2;
		blackKnightUpgrade.scaleY = 2;
		this.upgradeBlackArr.push(blackKnightUpgrade)

		// blackBishopUpgrade
		const blackBishopUpgrade = this.add.image(457, 382, "blackBishop");
		blackBishopUpgrade.setInteractive(new Phaser.Geom.Rectangle(0, 0, 60, 60), Phaser.Geom.Rectangle.Contains);
		blackBishopUpgrade.scaleX = 2;
		blackBishopUpgrade.scaleY = 2;
		this.upgradeBlackArr.push(blackBishopUpgrade)

		// blackRookUpgrade
		const blackRookUpgrade = this.add.image(582, 382, "blackRook");
		blackRookUpgrade.setInteractive(new Phaser.Geom.Rectangle(0, 0, 60, 60), Phaser.Geom.Rectangle.Contains);
		blackRookUpgrade.scaleX = 2;
		blackRookUpgrade.scaleY = 2;
		this.upgradeBlackArr.push(blackRookUpgrade)

		// blackQueenUpgrade
		const blackQueenUpgrade = this.add.image(701, 381, "blackQueen");
		blackQueenUpgrade.setInteractive(new Phaser.Geom.Rectangle(0, 0, 60, 60), Phaser.Geom.Rectangle.Contains);
		blackQueenUpgrade.scaleX = 2;
		blackQueenUpgrade.scaleY = 2;
		this.upgradeBlackArr.push(blackQueenUpgrade)

		// chooseUpgradeWhite
		const chooseUpgradeWhite = this.add.rectangle(516.600826820601, 380.88517862739684, 128, 128);
		chooseUpgradeWhite.scaleX = 4;
		chooseUpgradeWhite.isFilled = true;
		this.upgradeWhiteArr.push(chooseUpgradeWhite)

		// whiteKnightUpgrade
		const whiteKnightUpgrade = this.add.image(329.600826820601, 382.88517862739684, "whiteKnight");
		whiteKnightUpgrade.setInteractive(new Phaser.Geom.Rectangle(0, 0, 60, 60), Phaser.Geom.Rectangle.Contains);
		whiteKnightUpgrade.scaleX = 2;
		whiteKnightUpgrade.scaleY = 2;
		this.upgradeWhiteArr.push(whiteKnightUpgrade)

		// whiteBishopUpgrade
		const whiteBishopUpgrade = this.add.image(457.600826820601, 381.88517862739684, "whiteBishop");
		whiteBishopUpgrade.setInteractive(new Phaser.Geom.Rectangle(0, 0, 60, 60), Phaser.Geom.Rectangle.Contains);
		whiteBishopUpgrade.scaleX = 2;
		whiteBishopUpgrade.scaleY = 2;
		this.upgradeWhiteArr.push(whiteBishopUpgrade)

		// whiteRookUpgrade
		const whiteRookUpgrade = this.add.image(582.600826820601, 381.88517862739684, "whiteRook");
		whiteRookUpgrade.setInteractive(new Phaser.Geom.Rectangle(0, 0, 60, 60), Phaser.Geom.Rectangle.Contains);
		whiteRookUpgrade.scaleX = 2;
		whiteRookUpgrade.scaleY = 2;
		this.upgradeWhiteArr.push(whiteRookUpgrade)

		// whiteQueenUpgrade
		const whiteQueenUpgrade = this.add.image(700.600826820601, 380.88517862739684, "whiteQueen");
		whiteQueenUpgrade.setInteractive(new Phaser.Geom.Rectangle(0, 0, 60, 60), Phaser.Geom.Rectangle.Contains);
		whiteQueenUpgrade.scaleX = 2;
		whiteQueenUpgrade.scaleY = 2;
		this.upgradeWhiteArr.push(whiteQueenUpgrade)

		// rectangle_1
		const rectangle_1 = this.add.rectangle(512, 384, 128, 128);
		rectangle_1.visible = false;
		rectangle_1.scaleX = 8;
		rectangle_1.scaleY = 6;
		rectangle_1.isFilled = true;
		rectangle_1.fillColor = 0;

		// winWhite
		const winWhite = this.add.text(130, 320, "", {});
		winWhite.visible = false;
		winWhite.text = "Winner: White";
		winWhite.setStyle({ "fontSize": "100px" });
		this.winWhite = winWhite

		// winBlack
		const winBlack = this.add.text(130, 320, "", {});
		winBlack.visible = false;
		winBlack.text = "Winner: Black";
		winBlack.setStyle({ "fontSize": "100px" });
		this.winBlack = winBlack

		// stalemate
		const stalemate = this.add.text(250, 320, "", {});
		stalemate.visible = false;
		stalemate.text = "Stalemate";
		stalemate.setStyle({ "fontSize": "100px" });
		this.stalemate = stalemate

		// repetition
		const repetition = this.add.text(0, 320, "", {});
		repetition.scaleX = 0.9376230629670078;
		repetition.scaleY = 1.3432718833173838;
		repetition.visible = false;
		repetition.text = "Draw by Repetition";
		repetition.setStyle({ "fontSize": "100px" });
		repetition.setWordWrapWidth(repetition.style.wordWrapWidth, true);
		this.repetition = repetition

		// insufficient
		const insufficient = this.add.text(0, 280, "", {});
		insufficient.scaleX = 0.9376230629670078;
		insufficient.scaleY = 1.3432718833173838;
		insufficient.visible = false;
		insufficient.text = "Draw by Insufficient\nMaterial";
		insufficient.setStyle({ "align": "center", "fixedWidth": 1080, "fixedHeight": 200, "fontSize": "85px", "maxLines": 2 });
		insufficient.setWordWrapWidth(1080);
		this.insufficient = insufficient

		// 50move
		const _50move = this.add.text(0, 320, "", {});
		_50move.visible = false;
		_50move.scaleX = 0.9376230629670078;
		_50move.scaleY = 1.3432718833173838;
		_50move.text = "Draw by 50 move rule";
		_50move.setStyle({ "align": "center", "fixedWidth": 1080, "fixedHeight": 200, "fontSize": "85px", "maxLines": 2 });
		_50move.setWordWrapWidth(1080);
		this._50move = _50move


		for(let x=0; x<5; x++){
			this.upgradeBlackArr[x].visible = false
			this.upgradeWhiteArr[x].visible = false
			if(x !== 0){
				let temp = this.upgradeBlackArr[x]
				temp.on('pointerdown', () => {
					this.chosenUpgrade = temp.texture
					//console.log('tex tex tex' + temp.texture.key)
					switch (temp.texture.key){
						case "blackQuuen":
							this.chosenUpgradeLetter = 'q'
							break;
						case "blackRook":
							this.chosenUpgradeLetter = 'r'
							break;
						case "blackBishop":
							this.chosenUpgradeLetter = 'b'
							break;
						case "blackKnight":
							this.chosenUpgradeLetter = 'n'
							break;
					}
					for(let x = 0; x < 5; x++){
							this.upgradeBlackArr[x].visible = false
						}
					this.piecesOnSquares[clickedSquareInt].setTexture(this.chosenUpgrade)
					chess.move({from: clickedSquareString, to: moveToSquareStr, promotion: this.chosenUpgradeLetter})
					moveToSquareStr = ""

					if(this.piecesOnSquares[moveToSquareInt] !== null) {
							this.piecesOnSquares[moveToSquareInt].destroy()
						}
					this.piecesOnSquares[moveToSquareInt] = this.piecesOnSquares[clickedSquareInt]
					this.piecesOnSquares[clickedSquareInt] = null
					const t = this.tweens.add({
                    targets: [this.piecesOnSquares[moveToSquareInt]],
                    y: {from: this.piecesOnSquares[moveToSquareInt].y, to: this.squares[moveToSquareInt].y},
					x: {from: this.piecesOnSquares[moveToSquareInt].x, to: this.squares[moveToSquareInt].x},
                    duration: 200,
                    easing: 'bounce',
                    yoyo: false,
                    paused: true
                	})
					this.socket.emit('placePieceChessMania', ({promote: true, promoteLetter: this.chosenUpgradeLetter, promoteTexture: temp.texture.key, startSquareStr: clickedSquareString, destinationSquareStr: this.numberToSquareConverter(moveToSquareInt), castleStr: ""}))
					this.chess = chess
					clickedSquareString = ""
					t.play()
					moveToSquareInt = -1;
					moves = []
					activeSquares = []
					this.myTurn = false
					this.turnText.text = `Turn: Opponent's`
					this.squares.forEach((square2) => {
						square2.alphaTopLeft = 0;
						square2.alphaTopRight = 0;
						square2.alphaBottomLeft = 0;
						square2.alphaBottomRight = 0;
					})
				})
				let temp2 = this.upgradeWhiteArr[x]
				temp2.on('pointerdown', () => {
					this.chosenUpgrade = temp2.texture
					//console.log('tex tex tex' + temp2.texture.key)
					switch (temp2.texture.key){
						case "whiteQueen":
							this.chosenUpgradeLetter = 'q'
							break;
						case "whiteRook":
							this.chosenUpgradeLetter = 'r'
							break;
						case "whiteBishop":
							this.chosenUpgradeLetter = 'b'
							break;
						case "whiteKnight":
							this.chosenUpgradeLetter = 'n'
							break;
					}
					for(let x = 0; x < 5; x++){
							this.upgradeWhiteArr[x].visible = false
						}
					this.piecesOnSquares[clickedSquareInt].setTexture(this.chosenUpgrade)
					chess.move({from: clickedSquareString, to: moveToSquareStr, promotion: this.chosenUpgradeLetter})
					moveToSquareStr = ""
					console
					if(this.piecesOnSquares[moveToSquareInt] !== null) {
							this.piecesOnSquares[moveToSquareInt].destroy()
						}
					this.piecesOnSquares[moveToSquareInt] = this.piecesOnSquares[clickedSquareInt]
					this.piecesOnSquares[clickedSquareInt] = null
					const t = this.tweens.add({
                    targets: [this.piecesOnSquares[moveToSquareInt]],
                    y: {from: this.piecesOnSquares[moveToSquareInt].y, to: this.squares[moveToSquareInt].y},
					x: {from: this.piecesOnSquares[moveToSquareInt].x, to: this.squares[moveToSquareInt].x},
                    duration: 200,
                    easing: 'bounce',
                    yoyo: false,
                    paused: true
                	})
					let temp:string = this.numberToSquareConverter(moveToSquareInt)
					//console.log("HOOOOOOOW " + temp)
					this.socket.emit('placePieceChessMania', ({promote: true, promoteLetter: this.chosenUpgradeLetter, promoteTexture: temp2.texture.key, startSquareStr: clickedSquareString, destinationSquareStr: temp, castleStr: ""}))
					//this.socket.emit('placePieceChess', ({promote: true, promoteLetter: this.chosenUpgradeLetter, promoteTexture: this.chosenUpgrade.key, startSquareStr: 'a1', destinationSquareStr: 'x8', castleStr: ""}))
					////console.log("this is where the loopin happens")
					t.play()
					moveToSquareInt = -1;
					moves = []
					activeSquares = []
					this.myTurn = false
					this.turnText.text = `Turn: Opponent's`
					this.chess = chess
					clickedSquareString = ""
					this.squares.forEach((square2) => {
						square2.alphaTopLeft = 0;
						square2.alphaTopRight = 0;
						square2.alphaBottomLeft = 0;
						square2.alphaBottomRight = 0;
					})
				})
			}
		}





		var chess = new Chess()

		let isClicked = false
		let clickedSquare;
		let clickedSquareInt:number;
		let clickedSquareString: string;
		let moves = []
		let activeSquares = []
		let moveToSquareStr:string = "";
		let moveToSquareInt:number;

		let castleStr = ""

		let gameOver = true
		let uhhidk = false;

		let i = 0
		this.squares.forEach((square)=>{
			let thisNumber = i
			i++
			square.setInteractive(new Phaser.Geom.Rectangle(-300, -300, 2700, 2700), Phaser.Geom.Rectangle.Contains);
			square.alphaTopLeft = 0;
			square.alphaTopRight = 0;
			square.alphaBottomLeft = 0;
			square.alphaBottomRight = 0;
			square.on('pointerdown', () => {
				//console.log(this.myTurn)
				chess = this.chess
				if(this.upgradeBlackArr[0].visible == false && this.upgradeWhiteArr[0].visible == false && this.myTurn == true && this.gameOver == false){
				//console.log(thisNumber)
				if(!activeSquares.includes(square)){
					clickedSquareInt = thisNumber;
					this.squares.forEach((square2) => {
						square2.alphaTopLeft = 0;
						square2.alphaTopRight = 0;
						square2.alphaBottomLeft = 0;
						square2.alphaBottomRight = 0;
					})
					clickedSquare = square
					clickedSquareString = this.numberToSquareConverter(thisNumber)
					//console.log(clickedSquareString)
					isClicked = true
					moves = chess.moves({ square: clickedSquareString })
					//console.log(moves)
					moves = moves.map((string) => {
						if(string.includes("=")){string = string.slice(0, string.indexOf("="))}
						if(string[string.length -1] == "+" || string[string.length -1] == "#" ){string = string.slice(0,string.length -1)}
						if(string == "O-O" || string == "O-O-O"){
							return string
						}
						return string.slice(-2)
					})
					//console.log(moves)
					for(let j = 0; j < 64; j++){
						let temp = chess.get(clickedSquareString)
						let typePiece;
						if(temp !== undefined) typePiece = temp.type.toUpperCase()
						//console.log(typePiece)
						let startStr = ""
						if(typePiece != 'P'){startStr = typePiece}
						if(moves.includes(startStr + this.numberToSquareConverter(j)) || moves.includes(startStr + 'x' + this.numberToSquareConverter(j)) || moves.includes(this.numberToSquareConverter(j))){
							activeSquares.push(this.squares[j])
							this.squares[j].alphaTopLeft = 0.5;
							this.squares[j].alphaTopRight = 0.5;
							this.squares[j].alphaBottomLeft = 0.5;
							this.squares[j].alphaBottomRight = 0.5;
						}
					}
					if(chess.turn() == 'b'){
							if(moves.includes("O-O")){
								activeSquares.push(this.squares[62])
								this.squares[62].alphaTopLeft = 0.5;
								this.squares[62].alphaTopRight = 0.5;
								this.squares[62].alphaBottomLeft = 0.5;
								this.squares[62].alphaBottomRight = 0.5;
							}
							if(moves.includes("O-O-O")){
								activeSquares.push(this.squares[58])
								this.squares[58].alphaTopLeft = 0.5;
								this.squares[58].alphaTopRight = 0.5;
								this.squares[58].alphaBottomLeft = 0.5;
								this.squares[58].alphaBottomRight = 0.5;
							}
					}
					else
						{
							if(moves.includes("O-O")){
								activeSquares.push(this.squares[6])
								this.squares[6].alphaTopLeft = 0.5;
								this.squares[6].alphaTopRight = 0.5;
								this.squares[6].alphaBottomLeft = 0.5;
								this.squares[6].alphaBottomRight = 0.5;
							}
							if(moves.includes("O-O-O")){
								activeSquares.push(this.squares[2])
								this.squares[2].alphaTopLeft = 0.5;
								this.squares[2].alphaTopRight = 0.5;
								this.squares[2].alphaBottomLeft = 0.5;
								this.squares[2].alphaBottomRight = 0.5;
							}
					}
				}
				else{
					let temp = chess.get(clickedSquareString)
					let typePiece;
					if(temp !== undefined) typePiece = temp.type.toUpperCase()



					if(typePiece == 'K' && Math.abs(thisNumber - clickedSquareInt) == 2){
						castleStr = "yesidkthestringdoesntmatter"
						if(chess.turn() == 'b'){
							if(thisNumber == 62){//king side black
								var tt = this.tweens.add({
								targets: [this.piecesOnSquares[63]],
								y: {from: this.piecesOnSquares[63].y, to: this.squares[61].y},
								x: {from: this.piecesOnSquares[63].x, to: this.squares[61].x},
								duration: 200,
								easing: 'bounce',
								yoyo: false,
								paused: true
								})
								this.piecesOnSquares[61] = this.piecesOnSquares[63]
								this.piecesOnSquares[63] = null
							}
							else{
								var tt = this.tweens.add({
								targets: [this.piecesOnSquares[56]],
								y: {from: this.piecesOnSquares[56].y, to: this.squares[59].y},
								x: {from: this.piecesOnSquares[56].x, to: this.squares[59].x},
								duration: 200,
								easing: 'bounce',
								yoyo: false,
								paused: true
								})
								this.piecesOnSquares[59] = this.piecesOnSquares[56]
								this.piecesOnSquares[56] = null
							}
						}


						else{
							if(thisNumber == 6){//king side white
								var tt = this.tweens.add({
								targets: [this.piecesOnSquares[7]],
								y: {from: this.piecesOnSquares[7].y, to: this.squares[5].y},
								x: {from: this.piecesOnSquares[7].x, to: this.squares[5].x},
								duration: 200,
								easing: 'bounce',
								yoyo: false,
								paused: true
								})
								this.piecesOnSquares[5] = this.piecesOnSquares[7]
								this.piecesOnSquares[7] = null
							}
							else{
								var tt = this.tweens.add({
								targets: [this.piecesOnSquares[0]],
								y: {from: this.piecesOnSquares[0].y, to: this.squares[3].y},
								x: {from: this.piecesOnSquares[0].x, to: this.squares[3].x},
								duration: 200,
								easing: 'bounce',
								yoyo: false,
								paused: true
								})
								this.piecesOnSquares[3] = this.piecesOnSquares[0]
								this.piecesOnSquares[0] = null
							}
						}
					}

					let promoteChecker = false
					if(this.numberToSquareConverter(thisNumber)[1] == '8' && typePiece == 'P' || this.numberToSquareConverter(thisNumber)[1] == '1' && typePiece == 'P')
						{
						promoteChecker = true
						moveToSquareStr = this.numberToSquareConverter(thisNumber)	
						moveToSquareInt = thisNumber
						for(let x = 0; x < 5; x++){
							if(chess.turn() == 'b')
								this.upgradeBlackArr[x].visible = true
							else
								this.upgradeWhiteArr[x].visible = true
						}
						return	
						}
					else {
						chess.move({from: clickedSquareString, to: this.numberToSquareConverter(thisNumber)})


						if(this.piecesOnSquares[thisNumber] !== null) {
							this.piecesOnSquares[thisNumber].destroy()
						}
						else if(typePiece == 'P' && this.numberToSquareConverter(thisNumber)[0] !== clickedSquareString[0])
							{
								if(chess.turn() == 'b')
									this.piecesOnSquares[thisNumber-8].destroy()
								else
									this.piecesOnSquares[thisNumber+8].destroy()
							}
						this.piecesOnSquares[thisNumber] = this.piecesOnSquares[clickedSquareInt]
						this.piecesOnSquares[clickedSquareInt] = null
						uhhidk = true;

					}
					this.squares.forEach((square2) => {
						square2.alphaTopLeft = 0;
						square2.alphaTopRight = 0;
						square2.alphaBottomLeft = 0;
						square2.alphaBottomRight = 0;
					})
					const t = this.tweens.add({
                    targets: [this.piecesOnSquares[thisNumber]],
                    y: {from: this.piecesOnSquares[thisNumber].y, to: this.squares[thisNumber].y},
					x: {from: this.piecesOnSquares[thisNumber].x, to: this.squares[thisNumber].x},
                    duration: 200,
                    easing: 'bounce',
                    yoyo: false,
                    paused: true
                	})
              		t.play()
					if(tt)tt.play()
					moves = []
					activeSquares = []
					if(chess.isGameOver()){
						this.gameOver = true
						//rectangle_1.visible = true
						if(this.chess.isCheckmate()){
							if(this.chess.turn() == 'b'){
								this.winWhite.visible = true
								this.socket.emit("gameDone", {game: "chess", winner: "white"});
							}
							else {this.winBlack.visible = true
								this.socket.emit("gameDone", {game: "chess", winner: "black"});
							}
						}
						else{
							this.socket.emit("gameDone", {game: "chess", winner: "tie"});
						}
						if(chess.isStalemate()){
							stalemate.visible = true
						}
						if(chess.isInsufficientMaterial()) insufficient.visible = true
						if(chess.isDrawByFiftyMoves()) _50move.visible = true
						if(chess.isThreefoldRepetition()) repetition.visible = true
					}
					this.myTurn = false
					this.turnText.text = `Turn: Opponent's`
					if(promoteChecker == false)
						this.socket.emit('placePieceChessMania', ({promote: false, promoteLetter: 'x', promoteTexture: 'x', startSquareStr: clickedSquareString, destinationSquareStr: this.numberToSquareConverter(thisNumber), castleStr: castleStr}))
					this.chess = chess
					castleStr = ""
					if(promoteChecker == false)
						clickedSquareString = ""
				}
				// else if(isClicked == true){
				//	//console.log("isClickd true")
				// 	isClicked = false
				// }

			}
		})
		})

		//var timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });
	}

	
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

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
