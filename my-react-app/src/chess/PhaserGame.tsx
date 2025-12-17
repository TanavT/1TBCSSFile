import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './game/main';
import { EventBus } from './game/EventBus';
import ChessGame from './game/scenes/ChessGame';

export interface IRefPhaserGame
{
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps
{
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
    gametype?: string;
    user?: any;
    opp?: any;
    userID?: string
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({ currentActiveScene, gametype, user, opp, userID }, ref)
{
    console.log("bubububu: " + userID);
    const game = useRef<Phaser.Game | null>(null!);
    const sceneStarted = useRef(false);
    useLayoutEffect(() =>
    {
        if (game.current === null)
        {

            game.current = StartGame("game-container", {user, gametype, opp, userID});

            if (typeof ref === 'function')
            {
                ref({ game: game.current, scene: null });
            } else if (ref)
            {
                ref.current = { game: game.current, scene: null };
            }

        }

        return () =>
        {
            if (game.current)
            {
                game.current.destroy(true);
                if (game.current !== null)
                {
                    game.current = null;
                }
            }
        }
    }, [ref, user, opp]);
   /* useEffect(() => {
        if (!game.current || !userID || sceneStarted.current) return;

        sceneStarted.current = true;

        game.current.scene.start('Boot', {
            chessData: {
                userID
            }
        });
    }, [userID]);*/

    useEffect(() =>
    {
        EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) =>
        {
            if (currentActiveScene && typeof currentActiveScene === 'function')
            {

                currentActiveScene(scene_instance);

            }

            if (typeof ref === 'function')
            {
                ref({ game: game.current, scene: scene_instance });
            } else if (ref)
            {
                ref.current = { game: game.current, scene: scene_instance };
            }
            
        });
        return () =>
        {
            EventBus.removeListener('current-scene-ready');
        }
    }, [currentActiveScene, ref]);

    return (
        <div id="game-container"></div>
    );

});
