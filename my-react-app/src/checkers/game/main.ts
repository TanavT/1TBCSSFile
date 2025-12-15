//import Boot from './scenes/Boot';
//import GameOver from './scenes/GameOver';
//import MainGame from './scenes/Game';
//import MainMenu from './scenes/MainMenu';
//import Preloader from './scenes/Preloader';
import CheckersMain from './scenes/CheckersMain';
import { AUTO, Game } from 'phaser';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        CheckersMain
    ]
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
