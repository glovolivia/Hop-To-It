import {Player} from "../objects/player.js"

export class JesseLVL extends Phaser.Scene {

    constructor() {
        super('JesseLVL');
    }

    preload() {
        this.load.tilemapTiledJSON('level', 'assets/TileMaps/TileMapOliv.tmj')
        this.load.image('tilesBackgrounds', 'assets/TileMaps/TileSetsPNG/spritesheet-backgrounds-default.png');
        this.load.image('tilesDouble', 'assets/TileMaps/TileSetsPNG/spritesheet-tiles-double.png');
        this.load.image('tilesNormal', 'assets/TileMaps/TileSetsPNG/tiles_spritesheet.png');
        this.load.image('background', 'assets/banner.png' );
        this.load.image("player", 'assets/Graphics/frog_idle.png');
    }

    create() {
        const map = this.make.tilemap({ key: 'level' });
        const tilesets = [
            map.addTilesetImage('TileSetBackgrounds', 'tilesBackgrounds'),
            //map.addTilesetImage('NAME_OF_DOUBLE_TILESET', 'tilesDouble'),
            map.addTilesetImage('TileSetNormal', 'tilesNormal'),
        ];

        map.createLayer('Background', tilesets, 0, 0);
        map.createLayer('Water', tilesets, 0, 0);
        map.createLayer('PlatforDecorBehind', tilesets, 0, 0);
        map.createLayer('PlatfromDecor', tilesets, 0, 0);
        map.createLayer('Slides', tilesets, 0, 0);
        this.platforms = map.createLayer('Platfrom', tilesets, 0, 0);
        this.platforms.setCollisionByExclusion([-1]);

        this.player = new Player(100, 100, this.platforms) //(x, y, platform)
        this.player.setDepth(2);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(player);
        this.cameras.main.setBackgroundColor('#ccccff'); 
    }

    update() {

    }
    
}
