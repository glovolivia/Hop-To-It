import { setupButton } from "./helpers/setupButton.js";

export class Controls extends Phaser.Scene {
    constructor() {
        super('Controls');
    }

    
    preload() {
        this.load.image('backgroundCC', 'assets/Graphics/BannerCC.png');
        this.load.image('close', 'assets/Graphics/iconCross_grey.png');

    
    }
    
    create() {
        //load background
        this.background = this.add.sprite(640, 360, 'backgroundCC').setDisplaySize(1280,720);

        //camera fade in
        this.cameras.main.fadeIn(200, 0, 0, 0);

        this.add.rectangle(640, 360, 1280, 720, 0x00000, 0.12);
        this.ui = this.add.container(0,0);
    
            
        this.backButton = setupButton(this, 'close', false, 50, 45, 0.7, 'squareButton', 'squareButtonPressed', 'Start', 'click');

       
        this.tweens.add({
            targets: this.ui,
            repeat: -1,
            yoyo: true,
            y: -5,
            duration: 12000,
            ease: 'Sine.easeInOut',
        });
    }
    
}
