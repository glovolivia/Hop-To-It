import { Start } from './scenes/Start.js';
import { JesseLVL } from './scenes/Jesse_LVL.js';
import { OliviaLVL } from './scenes/Olivia_LVL.js';
import { WyattLVL } from './scenes/Wyatt_LVL.js';
import { Credits } from './scenes/Credits.js';
import { Controls } from './scenes/Controls.js';

const config = {
    type: Phaser.AUTO,
    title: 'Hop To It',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    backgroundColor: '#000000',
    pixelArt: true,
    scene: [
        Start, WyattLVL, OliviaLVL, JesseLVL, Credits, Controls
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            