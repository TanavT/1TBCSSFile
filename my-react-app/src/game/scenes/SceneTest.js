
// You can write more code here

/* START OF COMPILED CODE */

class SceneTest extends Phaser.Scene {

	constructor() {
		super("SceneTest");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// connect4_Empty_Grid
		this.add.image(334, 242, "Connect4_Empty_Grid");

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
