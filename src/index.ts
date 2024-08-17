import Rectangle from "./objects/rectangle";
import Vector2 from "./utils/vector2";
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

const BUOY_WIDTH = 240;
const BUOY_HEIGHT = 50;

const rect = new Rectangle(BUOY_WIDTH, BUOY_HEIGHT, $game.width / 2, $game.height - 25);
rect.draw();

const rect1 = new Rectangle(BUOY_WIDTH, BUOY_HEIGHT, -BUOY_WIDTH / 2, $game.height - BUOY_HEIGHT - 25, "#ff0000");
rect1.draw();

let frame = 0;
tick();

function tick(){
  $game.clearRect(0, 0, $game.width, $game.height);

  rect1.position = rect1.position.add(Vector2.right.multiply(2));

  rect.draw()
  rect1.draw();
  
  frame++;
  requestAnimationFrame(tick);
}
