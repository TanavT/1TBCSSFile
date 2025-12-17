import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './game/mainCheckers';
import { EventBus } from './game/EventBus';

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
}

export const PhaserGameCheckers = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({ currentActiveScene, user, gametype}, ref) //USER IN PHASER 2: add user to props here
{
    //console.log("test: " + test);
    const game = useRef<Phaser.Game | null>(null!);
    //console.log("Props in PhaserGame:", { user, gametype });

    useLayoutEffect(() =>
    {
        if (game.current === null)
        {
            game.current = StartGame("game-container", {user, gametype}); //USER IN PHASER 3: user passed to start game function

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
    }, [ref, user]); //USER IN PHASER 4: add user here. next step in main.ts

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
        <span id="game-container2"></span>
    );

});