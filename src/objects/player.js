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
        if (!this.inWater) {this.setDrag(1000,0)}
		

        this.min_jump_strength = 200;
		this.max_jump_strength = 800;
		this.jump_charge_rate = 600;   // velocity gained per second of holding
		this.jump_charge = 0;

        this.up = this.scene.input.keyboard.addKey("W", false, true);
        this.down = this.scene.input.keyboard.addKey("S", false, true);
        this.left = this.scene.input.keyboard.addKey("A", false, true);
        this.right = this.scene.input.keyboard.addKey("D", false, true);
        this.jump = this.scene.input.keyboard.addKey("SPACE", false, true);
        this.cursor = this.scene.input.keyboard.createCursorKeys();

        this.chargeSound = this.scene.sound.add('charge_sfx', { loop: true, volume: 0.6 });
        this.chargeMaxDetune = 1200

        if(!this.anims.exists('frog_jump')) { //this can be done without an animation but the original idea was to use one (just so happens it wasn't working gang)
            this.anims.create({
                key: 'frog_jump',
                frames: [
                    { key: 'player_jump'},
                    //{ key: 'player'}
                ],
                frameRate: 6,
                repeat: 0
            });
        }

        if(!this.anims.exists('frog_swim')) {
            this.anims.create({
                key: 'frog_swim',
                frames: [
                    { key: 'player_jump'},
                    { key: 'player_chill'},
                    { key: 'player_jump'}
                ],
                frameRate: 1.5,
                repeat: -1
            });
        }
    }

    updateChargeSound() {
        const ratio = this.jump_charge / this.max_jump_strength;

        if (!this.chargeSound.isPlaying) {
            this.chargeSound.play();
        }
        this.chargeSound.setDetune(ratio * this.chargeMaxDetune);
    }

    stopChargeSound() {
        this.chargeSound.stop();
    }

    update(time, delta){
        //check if in water 
        this.inWater = this.waterLayer.hasTileAtWorldXY(this.body.center.x, this.body.center.y);

        const right = this.cursor.right.isDown || this.right.isDown
        const left = this.cursor.left.isDown || this.left.isDown

        if (right && !left){this.setFlipX(true)}
        else if (left && !right){this.setFlipX(false)}

        const onGround = this.body.blocked.down;

        const dt = delta / 1000;
        this.setAcceleration(0, 0);

        if (this.jumping && onGround && this.body.velocity.y >= 0) {
            this.jumping = false;
            this.setDrag(1000,0);
            this.setBounce(0, 0);
        }

        if (this.chargeSound.isPlaying && (!this.jump.isDown || this.inWater || this.jumping)) {
            this.stopChargeSound();
        }

        if (!this.inWater){
            if(!this.jumping) {
                if(this.anims.isPlaying) {
                    this.stop();
                }
                this.setTexture('player');
            }

            this.body.setAllowGravity(true); //reset back to normal in case inWater was true before
            if (!this.jumping){
                if (this.cursor.right.isDown || this.right.isDown){
                    this.setVelocityX(100)
                }
                if (this.cursor.left.isDown || this.left.isDown){
                    this.setVelocityX(-100)
                }
                if (onGround && this.jump.isDown){
                    this.jump_charge = Math.min(this.jump_charge + this.jump_charge_rate * dt, this.max_jump_strength)
                    this.updateChargeSound();
                }
                if (onGround && Phaser.Input.Keyboard.JustUp(this.jump)){
                    this.scene.sound.play("jump_sfx")
                    this.particles = this.scene.add.particles(0, 0, 'star4', {
                        scale: {start: 0.1, end: 0.05, random: true},
                        angle: { min: 0, max: 180},
                        x: this.x,
                        y: this.y,
                        speed: 150,
                        color: [0xFFFFFF]
                    });
                    this.scene.time.delayedCall(300, () => {this.particles.destroy();});

                    const power = Math.max(this.jump_charge, this.min_jump_strength);
                    const facing = this.flipX ? 1 : -1;


                    this.jumping = true;
                    this.setDrag(0, 0);
                    this.setBounce(0.6, 0);
                    this.setVelocity(facing * power * 0.6, -power);
                    this.jump_charge = 0;

                }
            }
            if (this.jumping){
                this.play('frog_jump', true);
                if (this.body.blocked.left || this.body.blocked.left){
                    if (this.body.velocity.x > 0){
                        this.setFlipX(true);
                    }
                    else if (this.body.velocity.x < 0){
                        this.setFlipX(false);
                    }
                }
                if (this.cursor.right.isDown || this.right.isDown){
                    this.setAccelerationX(200);
                }
                if (this.cursor.left.isDown || this.left.isDown){
                    this.setAccelerationX(-200);
                }
            }
        }

        if (this.inWater){
            this.body.setAllowGravity(false); // For game feel and to make swimming make sense
            this.setDrag(500,500);
            this.play('frog_swim', true);

            if (this.cursor.up.isDown || this.up.isDown){
                this.setAccelerationY(-300);
                const particles = this.scene.add.particles(0, 0, 'star4', {
                        scale: {start: 0.05, end: 0.01, random: true},
                        angle: { min: 180, max: 0},
                        x: this.x,
                        y: this.y,
                        speed: 150,
                        color: [0xFFFFFF]
                    });
                    this.scene.time.delayedCall(100, () => {particles.destroy();});
            }
            if (this.cursor.down.isDown || this.down.isDown){
                this.setAccelerationY(400);
                const particles = this.scene.add.particles(0, 0, 'star4', {
                        scale: {start: 0.05, end: 0.01, random: true},
                        angle: { min: 180, max: 0},
                        x: this.x,
                        y: this.y,
                        speed: 150,
                        color: [0xFFFFFF]
                    });
                    this.scene.time.delayedCall(100, () => {particles.destroy();});
            }
            if (this.cursor.right.isDown || this.right.isDown){
                this.setAccelerationX(400);
                const particles = this.scene.add.particles(0, 0, 'star4', {
                        scale: {start: 0.05, end: 0.01, random: true},
                        angle: { min: 90, max: 270},
                        x: this.x,
                        y: this.y,
                        speed: 150,
                        color: [0xFFFFFF]
                    });
                    this.scene.time.delayedCall(100, () => {particles.destroy();});
            }
            if (this.cursor.left.isDown || this.left.isDown){
                this.setAccelerationX(-400);
                const particles = this.scene.add.particles(0, 0, 'star4', {
                        scale: {start: 0.05, end: 0.01, random: true},
                        angle: { min: -90, max: 90},
                        x: this.x,
                        y: this.y,
                        speed: 150,
                        color: [0xFFFFFF]
                    });
                    this.scene.time.delayedCall(100, () => {particles.destroy();});
            }
        }

    }
}
