
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
    scene: [
        Connect4Main
    ]
};

const StartGame = (parent: string, options?: {user?: any, gametype?: string, opp?: any}) => {
    
    return new Game({
         ...config,
        parent,
        callbacks: {
            preBoot: (game) => {
                if(options?.user) {
                    console.log("got user");
                    game.registry.set("user", options.user);
                }
                if(options?.gametype) {
                    console.log("got gametypre");
                    game.registry.set("gametype", options.gametype)
                }
                if(options?.opp) {
                    console.log("got opp");
                    game.registry.set("opp", options.opp)
                }
            }
        }
     });

}

export default StartGame;
