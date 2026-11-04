export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/banner.png' );
    }

    create() {
        this.background = this.add.image(640, 360,'background');
        this.background.setDisplaySize(1280, 720);

    }

    update() {

    }
    
}
