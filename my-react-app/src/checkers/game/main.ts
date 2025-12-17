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
    scene: []
};

const StartGame = (parent: string, options?: {user?: any, gametype?: string, opp?: any, userID?: any}) => { //USER IN PHASER 5: include options as a parameter holding user
    console.log(options);
    const game = new Game({ 
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
                if(options?.opp) {
                    console.log("got opp");
                    game.registry.set("opp", options.opp)
                }
                if(options?.userID) {
                    console.log("got userID");
                    game.registry.set("userID", options.userID);
                }
            }
         }
        });
    game.scene.add('CheckersMain', CheckersMain, true);
    return game;

}

export default StartGame;
