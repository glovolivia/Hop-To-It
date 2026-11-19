import { Player } from "../objects/player.js";

export class OliviaLVL extends Phaser.Scene {

    constructor() {
        super('OliviaLVL');
    }

    preload() {
            this.load.audio("jump_sfx", "assets/Audio/kenney_digital-audio/Audio/phaseJump1.ogg");
            this.load.audio("charge_sfx", "assets/Audio/kenney_digital-audio/Audio/laser1.ogg");
            this.load.audio("pickup_sfx", "assets/Audio/kenney_digital-audio/Audio/powerUp7.ogg");
    
            this.load.tilemapTiledJSON('level', 'assets/TileMaps/TileMapOliv.json')
            this.load.image('tilesBackgrounds', 'assets/TileMaps/TileSetsPNG/spritesheet-backgrounds-default.png');
            //this.load.image('tilesDouble', 'assets/TileMaps/TileSetsPNG/spritesheet-tiles-double.png');
            this.load.image('tilesNormal', 'assets/TileMaps/TileSetsPNG/spritesheet-tiles-default.png');
            this.load.image('background', 'assets/banner.png' );
            this.load.image('fly', 'assets/Graphics/fly.png');
            this.load.image("star4", "assets/Graphics/dirt_02.png");
            this.load.image('bubbles', 'assets/Graphics/circle_02.png');
            this.load.image('lever', 'assets/Graphics/lever.png');
            this.load.image('lever_left', 'assets/Graphics/lever_left.png');
            this.load.image('lever_right', 'assets/Graphics/lever_right.png');
            this.load.image('gate', 'assets/Graphics/chain.png');

            this.load.audio('olivMusic', 'assets/Audio/platformer_alt.wav');
        }
    
        create() {
            const map = this.make.tilemap({ key: 'level' });
            const tileSets = [
                map.addTilesetImage('TileSetBackgrounds', 'tilesBackgrounds'),
                //map.addTilesetImage('spritesheet-tiles-double', 'tilesDouble'),
                map.addTilesetImage('TileSetNormal', 'tilesNormal'),
            ];

            if(this.sound.get('bgMusic')) {
                this.sound.stopByKey('bgMusic');
                this.sound.play('olivMusic', { volume: 0.9, loop: true });
            }

            this.backgroundLayer = map.createLayer('Background', tileSets, 0, 0);
            this.backgroundLayer.setCullPadding(3, 3); //fix odd tile rendering
            map.createLayer('PlatformDecorBehind', tileSets, 0, 0);
            this.waterLayer = map.createLayer('Water', tileSets, 0, 0);
            map.createLayer('PlatformDecor', tileSets, 0, 0);
            map.createLayer('Slides', tileSets, 0, 0);
            this.platforms = map.createLayer('Platform', tileSets, 0, 0);
            this.platforms.setCollisionByExclusion([-1]);
    
            this.player = new Player(this, 460, 1500) //(this, 16*64, 20 *64,) //460, 5792
            this.player.setFlipX(true)
            this.physics.add.collider(this.player, this.platforms);
            this.player.setScale(0.5);
            this.player.setDepth(2);
            this.player.waterLayer = this.waterLayer;
            this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
            this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
            this.cameras.main.startFollow(this.player);
            this.cameras.main.setBackgroundColor('#ccccff'); 
            this.cameras.main.setRoundPixels(true);
    
            this.flies = this.add.group("flies");
    
            let objects = map.getObjectLayer("collectibles");
            if (objects)
            {
                this.target_score = 0;
                for (var obj of objects.objects)
                {
                    if (obj.properties)
                    {
                        if (obj.properties[0].name == "value" && obj.properties[0].value)
                        {
                            let fly = this.physics.add.staticSprite(obj.x + 32, obj.y - 32, "fly");
                            fly.value = obj.properties[0].value;
                            fly.setDepth(10);
                            fly.setScale(0.4);
                            fly.refreshBody();
                            this.flies.add(fly);
                            this.target_score += fly.value;
                        }
                    }
                }
            }

            const leverObject = map.getObjectLayer("lever").objects[0];
            const gateObject = map.getObjectLayer("gate");

            this.lever = this.add.sprite(leverObject.x + 32, leverObject.y - 32, 'lever');

            this.gates = this.add.group('gates');

            for(var object of gateObject.objects) {
                if (objects.properties) {
                    if(object.properties[0].name == 'lock' && object.properties[0].lock) {
                        let gate = this.physics.add.staticSprite(object.x + 32, object.y - 32, "gate");
                        gate.lock = object.properties[0].lock;
                        gate.setDepth(20);
                        gate.refreshBody();
                        this.gates.add(gate);
                    }
                }
            }

            this.physics.add.collider(this.player, this.gates)



            
        }
    
        update(time, delta) {
            this.player.update(time, delta);
    
            this.physics.world.overlap(this.player, this.flies, (p,c) => { 
                   c.body.enable = false;
                   this.tweens.add({
                      targets: c, 
                      scale: 0.2, 
                      duration: 300, 
                      onComplete: () => {
                            c.destroy(true);
                            this.checkEndGame();}
                    }); 
                    this.player.score += c.value;
                    console.log('pscore: ', this.player.score);
                    this.sound.play("pickup_sfx")}
                );
                    
        }
    
        checkEndGame(){
            if (this.player.score == this.target_score){
                this.scene.stop("OliviaLVL");
                this.scene.start('Victory');
            }
        }
    
}
