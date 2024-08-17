import Rectangle from "./objects/rectangle";
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

const rect = new Rectangle(240, 50, $game.width / 2, $game.height - 25);
rect.draw();
