import {Player} from "../objects/player.js"

export class JesseLVL extends Phaser.Scene {

    constructor() {
        super('JesseLVL');
    }

    preload() {
        this.load.tilemapTiledJSON('level', 'assets/TileMaps/TileMapOliv.json')
        this.load.image('tilesBackgrounds', 'assets/TileMaps/TileSetsPNG/spritesheet-backgrounds-default.png');
        this.load.image('tilesDouble', 'assets/TileMaps/TileSetsPNG/spritesheet-tiles-double.png');
        this.load.image('tilesNormal', 'assets/TileMaps/TileSetsPNG/spritesheet-tiles-default.png');
        this.load.image('background', 'assets/banner.png' );
        this.load.image("player", 'assets/Graphics/frog_idle.png');
    }

    create() {
        const map = this.make.tilemap({ key: 'level' });
        const tileSets = [
            map.addTilesetImage('TileSetBackgrounds', 'tilesBackgrounds'),
            //map.addTilesetImage('NAME_OF_DOUBLE_TILESET', 'tilesDouble'),
            map.addTilesetImage('TileSetNormal', 'tilesNormal'),
        ];

        map.createLayer('Background', tileSets, 0, 0);
        map.createLayer('Water', tileSets, 0, 0);
        map.createLayer('PlatformDecorBehind', tileSets, 0, 0);
        map.createLayer('PlatformDecor', tileSets, 0, 0);
        map.createLayer('Slides', tileSets, 0, 0);
        this.platforms = map.createLayer('Platform', tileSets, 0, 0);
        this.platforms.setCollisionByExclusion([-2]);

        this.player = new Player(this, 16*64, 20 *64,) //(x, y, platform) deleted this.platforms {error, player takes scene, x, y}
        this.player.setScale(0.5);
        this.player.setDepth(2);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBackgroundColor('#ccccff'); 
    }

    update() {
        this.player.update();
    }
    
}
