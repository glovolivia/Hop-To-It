export class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setBounce(0);
		this.setCollideWorldBounds(true);
		this.setMaxVelocity(400, 800);

        this.jumping = false
        this.inWater = false;

        this.body.setGravityY(900);
        this.body.setAllowGravity(!this.inWater);
		
        if(this.inWater) {
            this.setDrag(450);
        } else {
            this.setDrag(700);
        }

        this.min_jump_strength = 150;
		this.max_jump_strength = 500;
		this.jump_charge_rate = 600;   // velocity gained per second of holding
		this.jump_charge = 0;

        this.up = this.scene.input.keyboard.addKey("W", false, true);
        this.down = this.scene.input.keyboard.addKey("S", false, true);
        this.left = this.scene.input.keyboard.addKey("A", false, true);
        this.right = this.scene.input.keyboard.addKey("D", false, true);
        this.jump = this.scene.input.keyboard.addKey("SPACE", false, true);
        this.cursor = this.scene.input.keyboard.createCursorKeys();
    }

    update(time, delta){
        const onGround = this.body.blocked.down;
        const dt = delta / 1000;
        this.setAcceleration(0, 0);

        if (this.jumping && onGround && this.body.velocity.y >= 0) {
            this.jumping = false;
            this.setDragX(700);
        }

        if (!this.inWater){
            if (this.cursor.right.isDown || this.right.isDown){
                this.setFlipX(true)
            }
            if (this.cursor.left.isDown || this.left.isDown){
                this.setFlipX(false)
            }
            if (!this.jumping && this.jump.isDown){
                this.jump_charge = Math.min(this.jump_charge + this.jump_charge_rate * dt, this.max_jump_strength)
            }
            if (!this.jumping && Phaser.Input.Keyboard.JustUp(this.jump)){
                const power = Math.max(this.jump_charge, this.min_jump_strength);
                const facing = this.flipX ? 1 : -1;

				this.jumping = true;
				this.setDrag(0, 0);
				this.setVelocity(facing * power * 0.6, -power);
				this.jump_charge = 0;

            }
        }

        if (this.jumping){
            if (this.cursor.right.isDown || this.right.isDown){
                this.setAccelerationX(200);
            }
            if (this.cursor.left.isDown || this.left.isDown){
                this.setAccelerationX(-200)
            }
        }

        if (this.inWater){
            if (this.cursor.up.isDown || this.up.isDown){
                this.setAccelerationY(-1000);
            }
            else if (this.cursor.down.isDown || this.down.isDown){
                this.setAccelerationY(1000);
            }
            if (this.cursor.right.isDown || this.right.isDown){
                this.setAccelerationX(1000);
                this.setFlipX(true)
            }
            else if (this.cursor.left.isDown || this.left.isDown){
                this.setAccelerationX(-1000);
                this.setFlipX(false)
            } // else {
            //     this.body.setVelocityX(0);
            //     this.body.setVelocityY(0);
            // }
        }

    }
}
