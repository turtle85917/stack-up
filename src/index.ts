import Game from "./core/game";
import "./style.css";

const gameCanvas = document.querySelector<HTMLCanvasElement>("canvas.game");
if(gameCanvas === null)
  throw new Error("Not found 'game' canvas!");
const ctx = gameCanvas.getContext("2d");
if(ctx === null)
  throw new Error("Not found context in game canvas...");

globalThis.$game = Object.assign(ctx, {
  width: gameCanvas.width,
  height: gameCanvas.height
});

const game = new Game();
game.run();
