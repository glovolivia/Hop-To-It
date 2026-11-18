import { setupButton } from "./helpers/setupButton.js";

export class Victory extends Phaser.Scene {
    constructor() {
        super('Victory');
    }

    
    preload() {
        this.load.image('backgroundCC', 'assets/Graphics/BannerCC.png');
        this.load.image('button', 'assets/Graphics/buttonLong_brown.png');
        this.load.image('pressed', 'assets/Graphics/buttonLong_brown_pressed.png');

    
    }
    
    create() {
        //load background
        this.background = this.add.sprite(640, 360, 'backgroundCC').setDisplaySize(1280,720);

        //camera fade in
        this.cameras.main.fadeIn(200, 0, 0, 0);

        this.add.rectangle(640, 360, 1280, 720, 0x00000, 0.12);
        this.ui = this.add.container(0,0);

        this.ui.add(setupButton(this, null, 'Main Menu', 655, 510, 2, 'button', 'pressed', 'Start', 'click'));
        this.ui.add(this.add.text(650, 120, "Congratulations!", { fontSize: '128px', fontFamily: 'Trebuchet MS', fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));
        this.ui.add(this.add.text(650, 220, "You caught all the flies.", { fontSize: '24px', fontFamily: 'Trebuchet MS', fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));
        

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
