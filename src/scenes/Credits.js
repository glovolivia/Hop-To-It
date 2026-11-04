import { setupButton } from "./helpers/setupButton.js";

export class Credits extends Phaser.Scene {
    constructor() {
        super('Credits');
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

        this.ui.add(this.add.text(650, 120, "Credits", { fontSize: '128px', fontFamily: 'Trebuchet MS', fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));
        this.ui.add(this.add.text(650, 220, "Game Design & Programming", { fontSize: '24px', fontFamily: 'Trebuchet MS', fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));
        this.ui.add(this.add.text(650, 280, "Jesse Chung, Wyatt Berson", { fontSize: '48px', fontFamily: 'Trebuchet MS',fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));
        this.ui.add(this.add.text(650, 340, "Oliwia Glowczynska", { fontSize: '48px', fontFamily: 'Trebuchet MS',fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));
        this.ui.add(this.add.text(650, 420, "Art & UI assets", { fontSize: '24px', fontFamily: 'Trebuchet MS',fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));
        this.ui.add(this.add.text(650, 460, "Kenny - kenney.nl", { fontSize: '48px', fontFamily: 'Trebuchet MS',fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));
        this.ui.add(this.add.text(650, 540, "Audio", { fontSize: '24px', fontFamily: 'Trebuchet MS',fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));
        this.ui.add(this.add.text(650, 580, "opengameart.org", { fontSize: '48px', fontFamily: 'Trebuchet MS',fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));
        this.ui.add(this.add.text(650, 640, "kenney.nl", { fontSize: '48px', fontFamily: 'Trebuchet MS',fill: '#FFF', align: "center", stroke: "#070706d9", strokeThickness: 3 }).setOrigin(0.5).setShadow(3, 3, '#667580', 4));

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
