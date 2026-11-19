import {Player} from "../objects/player.js"

export class JesseLVL extends Phaser.Scene {

    constructor() {
        super('JesseLVL');
    }

    preload() {
        this.load.audio("jump_sfx", "assets/Audio/kenney_digital-audio/Audio/phaseJump1.ogg");
        this.load.audio("charge_sfx", "assets/Audio/kenney_digital-audio/Audio/laser1.ogg");
        this.load.audio("pickup_sfx", "assets/Audio/kenney_digital-audio/Audio/powerUp7.ogg");

        this.load.tilemapTiledJSON('Jesse-LVL', 'assets/TileMaps/TileMapJesse.json')
        this.load.image('tilesBackgrounds', 'assets/TileMaps/TileSetsPNG/spritesheet-backgrounds-default.png');
        //this.load.image('tilesDouble', 'assets/TileMaps/TileSetsPNG/spritesheet-tiles-double.png');
        this.load.image('tilesNormal', 'assets/TileMaps/TileSetsPNG/spritesheet-tiles-default.png');
        this.load.image('background', 'assets/banner.png' );
        this.load.image('fly', 'assets/Graphics/fly.png');
        this.load.image("star4", "assets/Graphics/dirt_02.png");
        this.load.image('bubbles', 'assets/Graphics/circle_02.png');
    }

    create() {
        const map = this.make.tilemap({ key: 'Jesse-LVL' });
        const tileSets = [
            map.addTilesetImage('TileSetBackgrounds', 'tilesBackgrounds'),
            //map.addTilesetImage('spritesheet-tiles-double', 'tilesDouble'),
            map.addTilesetImage('TileSetNormal', 'tilesNormal'),
        ];

        this.backgroundLayer = map.createLayer('Background', tileSets, 0, 0);
        this.backgroundLayer.setCullPadding(3, 3); //fix odd tile rendering
        map.createLayer('PlatformDecorBehind', tileSets, 0, 0);
        this.waterLayer = map.createLayer('Water', tileSets, 0, 0);
        map.createLayer('PlatformDecor', tileSets, 0, 0);
        map.createLayer('Slides', tileSets, 0, 0);
        this.platforms = map.createLayer('Platform', tileSets, 0, 0);
        this.platforms.setCollisionByExclusion([-1]);

        this.player = new Player(this, 460, 6400) //(this, 16*64, 20 *64,) //460, 5792
        this.player.setFlipX(true)
        this.physics.add.collider(this.player, this.platforms);
        this.player.setScale(0.5);
        this.player.setDepth(2);
        this.player.waterLayer = this.waterLayer;
        this.player.groundLayer = this.platforms;
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
                        let fly = this.physics.add.staticSprite(obj.x, obj.y, "fly");
                        fly.setDepth(10);
                        fly.setScale(0.25);
                        fly.refreshBody();

                        fly.dot = this.add.image(obj.x, obj.y, "fly");
                        fly.dot.setScale(0.1);
                        fly.dot.setDepth(50);
                        fly.dot.setVisible(false);

                        this.flies.add(fly);
                        this.target_score += 1;
                    }
                }
            }
        }

        this.score_label = this.add.text(0, 0, 'Points: ' + this.player.score + "/" + this.target_score, { fontSize: '32px', fill: '#FFF' });
        this.score_label.setScrollFactor(0);
        this.score_label.setDepth(100);
        
    }

    updateFlyMarkers() {
        const view = this.cameras.main.worldView;
        const margin = 20;

        for (const fly of this.flies.getChildren()) {
            const offscreen = !view.contains(fly.x, fly.y);
            fly.dot.setVisible(offscreen);

            if (offscreen) {
                fly.dot.x = Phaser.Math.Clamp(fly.x, view.left + margin, view.right - margin);
                fly.dot.y = Phaser.Math.Clamp(fly.y, view.top + margin, view.bottom - margin);
            }
        }
    }

    update(time, delta) {
        this.player.update(time, delta);
        this.updateFlyMarkers();

        this.physics.world.overlap(this.player, this.flies, (p,c) => { 
               c.body.enable = false;
               this.tweens.add({
                  targets: c, 
                  scale: 0.2, 
                  duration: 300, 
                  onComplete: () => {
                        c.dot.destroy();
                        c.destroy(true);}
                }); 
                p.score += 1; 
                this.sound.play("pickup_sfx");
                this.score_label.text = "Points: " + p.score + "/" + this.target_score;
                this.checkEndGame();}
            );
        
        
    }

    checkEndGame(){
        if (this.player.score >= this.target_score){
            this.scene.stop("JesseLVL");
            this.scene.start('Victory');
        }
    }
    
}
