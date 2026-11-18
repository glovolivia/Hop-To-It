import {Player} from "../objects/player.js"

export class JesseLVL extends Phaser.Scene {

    constructor() {
        super('JesseLVL');
    }

    preload() {
        this.load.tilemapTiledJSON('level', 'assets/TileMaps/TileMapOliv.json')
        this.load.image('tilesBackgrounds', 'assets/TileMaps/TileSetsPNG/spritesheet-backgrounds-default.png');
        //this.load.image('tilesDouble', 'assets/TileMaps/TileSetsPNG/spritesheet-tiles-double.png');
        this.load.image('tilesNormal', 'assets/TileMaps/TileSetsPNG/spritesheet-tiles-default.png');
        this.load.image('background', 'assets/banner.png' );
        this.load.image('fly', 'assets/Graphics/fly.png');
    }

    create() {
        const map = this.make.tilemap({ key: 'level' });
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

        this.player = new Player(this, 460, 1560) //(this, 16*64, 20 *64,)
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

        let objects = map.getObjectLayer("Collectibles");
        if (objects)
        {
            for (var obj of objects.objects)
            {
                if (obj.properties)
                {
                    if (obj.properties[0].name == "value" && obj.properties[0].value)
                    {
                        let fly = this.physics.add.staticSprite(x+obj.x +16, y+obj.y-16, "fly");
                        fly.setDepth(10);
                        this.flies.add(fly);
                    }
                }
            }
        }
    }

    update(time, delta) {
        this.player.update(time, delta);

        this.physics.world.overlap(this.player, this.fly, (p,c) => { 
               c.body.enable = false;
               this.tweens.add({
                  targets: c, 
                  scale: 0.2, 
                  duration: 300, 
                  onComplete: () => {
                        c.destroy(true);}
                }); 
                p.score += c.value;});
    }
    
}
