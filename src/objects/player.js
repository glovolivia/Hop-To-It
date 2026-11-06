export class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setBounce(0.2);
		this.setCollideWorldBounds(true);

		this.inWater = true;


        this.inWater = true

        // Will be used later to adjust the juice of the player movement
        this.max_movement_speed = 500
        this.current_speed = 0
        this.movement_acceleration = 100
        this.max_jump_height = 200
        this.current_jump_height = 0;
        this.jump_acceleration = 100;
        
        this.gravity = 10;

        this.up = this.scene.input.keyboard.addKey("W", false, true);
        this.down = this.scene.input.keyboard.addKey("S", false, true);
        this.left = this.scene.input.keyboard.addKey("A", false, true);
        this.right = this.scene.input.keyboard.addKey("D", false, true);
        this.jump = this.scene.input.keyboard.addKey("SPACE", false, true);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    update(){
        const speed = 200

        if (this.inWater){
            if (this.up.isDown){
                this.body.setVelocityY(-speed);
            }
            if (this.down.isDown){
                this.body.setVelocityY(speed);
            }
            if (this.right.isDown){
                this.body.setVelocityX(speed);
            }
            if (this.left.isDown){
                this.body.setVelocityX(-speed)
            }
        }

    }
}
