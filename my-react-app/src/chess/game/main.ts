import Boot from './scenes/Boot';
import GameOver from './scenes/GameOver';
import MainGame from './scenes/Game';
import MainMenu from './scenes/MainMenu';
import Preloader from './scenes/Preloader';
import Connect4Main from './scenes/Connect4Main';
import ChessGame from './scenes/ChessGame';
import { AUTO, Game } from 'phaser';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#818589',
    scene: []
};

const StartGame = (parent: string) => {

    const game = new Game({ ...config, parent });
    game.scene.add('Boot', Boot, false);
    game.scene.add('Preloader', Preloader, false);
    game.scene.add('MainMenu', MainMenu, false);
    game.scene.add('MainGame', MainGame, false);
    game.scene.add('GameOver', GameOver, false);

    game.scene.add('Connect4Main', Connect4Main, false);
    game.scene.add('ChessGame', ChessGame, false);
    return game;


}

export default StartGame;
