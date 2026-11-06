import {Player} from "../objects/player.js"

export class JesseLVL extends Phaser.Scene {

    constructor() {
        super('JesseLVL');
    }

    preload() {
        this.load.tilemapTiledJSON('level', "assets/TileMaps/TileMapOliv.tmj")
        this.load.image("tileset", "assets/tilesheet.png") //need to know which png used exactly
        this.load.image('background', 'assets/banner.png' );
        this.load.image("player", 'assets/Graphics/frog_idle.png');
    }

    create() {
        const MAP_KEY = (64, 64, 100, 100) // tile_height, tile_width, num_of_tiles_X, num_of_tiles_Y
        const TILESET_KEY = (64, 64, 0, 1) // (tileWidth, tileHeight, tileMargin, tileSpacing, gid, tileOffset)

        var background = this.add.tilemap('tilemap', MAP_KEY);
        var tileset = background.addTilesetImage("tileset", "tileset", TILESET_KEY)
        this.platforms = background.createLayer("ground", tileset)

        this.player = new Player(100, 100, this.platforms) //(x, y, platform)
        this.player.setDepth(2);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(player);
        this.cameras.main.setBackgroundColor('#ccccff'); 
    }

    update() {

    }
    
}
