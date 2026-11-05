import {Player} from "../objects/player.js"

export class JesseLVL extends Phaser.Scene {

    constructor() {
        super('JesseLVL');
    }

    preload() {
        this.load.image('background', 'assets/banner.png' );
        this.load.image("player", 'assets/Graphics/frog_idle.png')
    }

    create() {
        this.background = this.add.image(640, 360,'background');
        this.background.setDisplaySize(1280, 720);

        this.player = new Player(100, 100) //(x, y)

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(player);
        this.cameras.main.setBackgroundColor('#ccccff'); 
    }

    update() {

    }
    
}
