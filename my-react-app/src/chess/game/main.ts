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

const StartGame = (parent: string, options?: {user?: any, gametype?: string, opp?: any, userID?: any}) => {

    const game = new Game({ 
        ...config, 
        parent,
        callbacks: {
            preBoot: (game) => {
                if(options?.user) {
                    console.log("user given");
                    game.registry.set("user", options.user);
                }
                if(options?.gametype) {
                    console.log("gametype given");
                    game.registry.set("gametype", options.gametype)
                }
                if(options?.opp) {
                    console.log("opp given");
                    game.registry.set("opp", options.opp)
                }
                if(options?.userID) {
                    console.log("userID given");
                    game.registry.set("userID", options.userID);
                }
            }
        }
    });
    game.scene.add('Boot', Boot, true);
    game.scene.add('Preloader', Preloader, false);
    game.scene.add('MainMenu', MainMenu, false);
    game.scene.add('MainGame', MainGame, false);
    game.scene.add('GameOver', GameOver, false);

    game.scene.add('Connect4Main', Connect4Main, false);
    game.scene.add('ChessGame', ChessGame, false);
    return game;

}

export default StartGame;
