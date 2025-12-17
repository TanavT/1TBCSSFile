import Boot from './scenes/BootConnect';
import GameOver from './scenes/GameOver';
import MainGame from './scenes/Game';
import MainMenu from './scenes/MainMenu';
import Preloader from './scenes/PreloaderConnect';
import Connect4Main from './scenes/Connect4Main';
import ChessGame from './scenes/ChessGame';
import CheckersMain from './scenes/CheckersMain'
import { AUTO, Game } from 'phaser';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game-container3',
    backgroundColor: '#818589',
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver,
        Connect4Main,
        ChessGame,
        CheckersMain
    ],
    scale: {
        parent: 'game-container3',
        //mode: Phaser.Scale.FIT,
        //autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 420,
        height: 600
    }
};

const StartGame = (parent: string, options?: {user?: any, gametype?: string}) => { //USER IN PHASER 5: include options as a parameter holding user
    console.log(options);
    return new Game({ 
        ...config,
         parent,
         callbacks: { //USER IN PHASER 6: add preboot function to get user if it exists (it better) and add it to the game registry. Final step in CheckersMain.ts
            preBoot: (game) => {
                if(options?.user) {
                    console.log("USER AHAHA");
                    game.registry.set("user", options.user);
                }
                if(options?.gametype) {
                    console.log("GAMETYPE LOLOLOL");
                    game.registry.set("gametype", options.gametype)
                }
            }
         }
        });
}

export default StartGame;
