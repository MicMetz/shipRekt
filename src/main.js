/**
 * @author MicMetzger /
 * @original Mugen87 / https://github.com/Mugen87
 */

    // import world from './core/World.js';


// const splashScreen = document.getElementById("splashScreen");
const startButton = document.getElementById('start-button');
import('./core/World.js').then((game) => {
    startButton.onclick = function () {
        game.start();
    }
});

