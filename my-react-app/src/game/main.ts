
import Connect4Main from './scenes/Connect4Main';
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

    game.scene.add('Connect4Main', Connect4Main, false);

    return game;

}

export default StartGame;
