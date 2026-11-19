export class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setBounce(0);
		this.setCollideWorldBounds(true);
		this.setMaxVelocity(400, 800);
        this.setOrigin(0.5, 1);

        this.jumping = false
        this.inWater = false;
        this.score = 0;
        this.normalScale = 0.5;


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

        this.bubbles = this.scene.add.particles(0, 0, 'bubbles', {
            speedY: { min: -25, max: -10 },
            speedX: { min: -5, max: 5 },
            scale: { start: 0.06, end: 0.02 },
            alpha: { start: 0.6, end: 0 },
            quantity: 0.5,
            lifespan: 1200,
            tint: 0x8FB8C8,
            tintFill: true,
            emitting: false
        });

        this.bubbles.setDepth(1);
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

    getGroundTile() {
        const x = this.body.center.x;
        const y = this.body.bottom + 1;
        return this.groundLayer.getTileAtWorldXY(x, y);
    }

    update(time, delta){
        //check if in water 
        const wasInWater = this.inWater;
        console.log(this.drag)

        this.inWater = this.waterLayer.hasTileAtWorldXY(this.body.center.x, this.body.center.y);

        if(this.inWater && !wasInWater) {
            this.scene.sound.play('splash', { volume: 0.8 });
        }

        const right = this.cursor.right.isDown || this.right.isDown
        const left = this.cursor.left.isDown || this.left.isDown

        if (right && !left){this.setFlipX(true)}
        else if (left && !right){this.setFlipX(false)}

        const onGround = this.body.blocked.down;

        //Set the drag
        if (this.inWater) {
            this.setDrag(500, 500);
        } else if (this.jumping) {
            this.setDrag(0, 0);
        } else {
            if (onGround){
                const tile = this.getGroundTile();
                console.log(tile ? tile.index : null, tile ? tile.properties : null, this.body.drag.x);
                if (tile){
                    if (tile.properties.slip){
                        this.setDrag(100,0)
                    }
                    else{
                        this.setDrag(1000,0)
                    }
                }
            }
        }


        const dt = delta / 1000;
        this.setAcceleration(0, 0);

        if (this.jumping && onGround && this.body.velocity.y >= 0) {
            this.jumping = false;
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

                    if(!this.squash || !this.squash.isPlaying()) {
                        this.squash = this.scene.tweens.add({
                            targets: this,
                            scaleX: 0.51,
                            scaleY: 0.4,
                            duration: (this.max_jump_strength / this.jump_charge_rate) * 1000,
                            ease: 'Sine.easeIn',
                        });

                    }

                }
                if (onGround && Phaser.Input.Keyboard.JustUp(this.jump)){
                    this.scene.sound.play("jump_sfx")
                    this.particles = this.scene.add.particles(0, 0, 'star4', {
                        scale: {start: 0.1, end: 0.02, random: true},
                        angle: { min: 0, max: -180 },
                        quantity: 1,
                        x: this.x,
                        y: this.y + 16,
                        speed: 150,
                        alpha: {start: 1, end: 0},
                        tintFill: true,
                        tint: 0x568C61,
                    });
                    this.scene.time.delayedCall(300, () => {this.particles.destroy();});

                    const power = Math.max(this.jump_charge, this.min_jump_strength);
                    const facing = this.flipX ? 1 : -1;

                    if (!this.reset || !this.reset.isPlaying()) {
                        this.squash.stop();
                        this.reset = this.scene.tweens.add({
                            targets: this,
                            scaleX: 0.5,
                            scaleY: 0.5,
                            duration: 180,
                            ease: "Back.easeOut"
                        });
                    }

                    this.jumping = true;
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
            if (Math.random() > 0.004) {
                this.bubbles.explode(1, this.x, this.y - 18);
            }
            this.body.setAllowGravity(false); // For game feel and to make swimming make sense
            this.play('frog_swim', true);

            if (this.cursor.up.isDown || this.up.isDown){
                this.setAccelerationY(-300);
            }
            if (this.cursor.down.isDown || this.down.isDown){
                this.setAccelerationY(400);
            }
            if (this.cursor.right.isDown || this.right.isDown){
                this.setAccelerationX(400);
            }
            if (this.cursor.left.isDown || this.left.isDown){
                this.setAccelerationX(-400);
            }
        }

        

    }
}
