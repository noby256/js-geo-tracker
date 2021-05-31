import { initRenderer } from './renderer.js';

async function main() {
    const canvas = document.querySelector("#glCanvas");
    const countInput = document.querySelector("#count");
    const fpsInput = document.querySelector("#fps");

    let canvasWidth;
    let canvasHeight;
    const { render } = await initRenderer(canvas);

    const resizeHandler = () => {
        canvasWidth = canvas.clientWidth;
        canvasHeight = canvas.clientHeight;
    }

    window.addEventListener('resize', resizeHandler);
    resizeHandler();

    const inputHandler = () => {
        const inputValue = Math.trunc(countInput.value);
        if (inputValue > 0) {
            particlesCount = inputValue;
        }
    }
    countInput.addEventListener('input', inputHandler);
    inputHandler();

    let lastTs = 0;
    let framesDrawn = 0; 
    const frame = (timestamp) => {
        requestAnimationFrame(frame);
    }
}

window.onload = main;