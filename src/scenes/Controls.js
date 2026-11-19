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

        this.ui.add(this.add.text(650, 120, "Controls", { fontSize: '48px', fontFamily: 'Trebuchet MS', fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));
        this.ui.add(this.add.text(650, 220, "Move Left : A/Left Arrow", { fontSize: '24px', fontFamily: 'Trebuchet MS', fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));
        this.ui.add(this.add.text(650, 280, "Move Right : D/Right Arrow", { fontSize: '24px', fontFamily: 'Trebuchet MS', fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));
        this.ui.add(this.add.text(650, 340, "Swim Up : W/Up Arrow", { fontSize: '24px', fontFamily: 'Trebuchet MS', fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));
        this.ui.add(this.add.text(650, 400, "Swim Down : S/Down Arrow", { fontSize: '24px', fontFamily: 'Trebuchet MS', fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));
        this.ui.add(this.add.text(650, 460, "Jump : Space (Hold to Jump Higher)", { fontSize: '24px', fontFamily: 'Trebuchet MS', fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));

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
