import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './game/main';
import { EventBus } from './game/EventBus';
import CheckersMain from './game/scenes/CheckersMain';

export interface IRefPhaserGame
{
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps
{
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
    user?: any;
    gametype?: any;
    opp?: any;
    userID?: string
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({ currentActiveScene, user, gametype, opp, userID }, ref) //USER IN PHASER 2: add user to props here
{
    //console.log("test: " + test);
    const game = useRef<Phaser.Game | null>(null!);
    const sceneStarted = useRef(false);
    //console.log("Props in PhaserGame:", { user, gametype, opp });

    useLayoutEffect(() =>
    {
        if (game.current === null)
        {
            game.current = StartGame("game-container", {user, gametype, opp}); //USER IN PHASER 3: user passed to start game function

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
    }, [ref, user, opp]); //USER IN PHASER 4: add user here. next step in main.ts
    useEffect(() => {
        if (!game.current || !userID || sceneStarted.current) return;

        sceneStarted.current = true;

        game.current.scene.start('CheckersMain', {
            userID
        });
    }, [userID]);
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
