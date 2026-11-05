import { setupButton } from "./helpers/setupButton.js";

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/Graphics/HomeScreen.png' );
        this.load.image('button', 'assets/Graphics/buttonLong_brown.png');
        this.load.image('pressed', 'assets/Graphics/buttonLong_brown_pressed.png');

        this.load.image('squareButton', 'assets/Graphics/buttonSquare_brown.png');
        this.load.image('squareButtonPressed', 'assets/Graphics/buttonSquare_brown_pressed.png');

        this.load.audio('click', 'assets/Audio/click1.wav');

    }

    async create() {
        this.background = this.add.image(640, 360,'background');
        this.background.setDisplaySize(1280, 720);

        //camera fade in
        this.cameras.main.fadeIn(200, 0, 0, 0);

        //Get cords on pointerdown (easier to set up UI)
        this.input.on('pointerdown', (pointer) => {
            console.log(`X: ${pointer.x}, Y: ${pointer.y}`);
        });

        this.add.rectangle(640, 360, 1280, 720, 0x00000, 0.12);
        //container to animate later
        this.ui = this.add.container(0,0);

        //Load font
        const font = new FontFace('Lilita One', 'url("assets/Fonts/LilitaOne-Regular.ttf")');
        const loadFont = await font.load();
        document.fonts.add(loadFont);

        //title
        this.ui.add(this.add.text(650, 150, 'HOP TO IT!', { fontSize: '156px', fontFamily: 'Lilita One', fill: '#FFF', stroke: "#5a9513", strokeThickness: 20 }).setOrigin(0.5).setShadow(10, 10, '#314e0d76', 14));

        //buttons
        this.ui.add(setupButton(this, null, 'Start', 655, 290, 2, 'button', 'pressed', 'JesseLVL', 'click'));
        this.ui.add(setupButton(this, null, 'Controls', 470, 400, 1.8, 'button', 'pressed', 'Controls', 'click'));
        this.ui.add(setupButton(this, null, 'Credits', 850, 400, 1.8, 'button', 'pressed', 'Credits', 'click'));

        this.tweens.add({
            targets: this.ui,
            y: this.ui.y - 5,
            repeat: -1,
            ease: 'Sine.easeInOut',
            yoyo: true,
        });


    }
    
}
