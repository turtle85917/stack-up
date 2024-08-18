import Rectangle from "../objects/rectangle";
import Vector2 from "../utils/vector2";
import Color from "../utils/color";
import lerp from "../utils/lerp";
import type {Stack} from "../types/game";

export default class Game{
  private lastY;
  private stacks:Stack[];

  private isLeft:boolean = true;
  private isStackSpawn:boolean = false;

  private overflowStack:Stack&{transparcy:number;}|null = null;

  private width:number;
  private speed:number;
  private score:number;
  private gradient:Color;
  private tick:number = 0;

  // camera
  private cameraY:number = 0;
  private newCameraY:number = 0;

  private readonly STACK_WIDTH = 280;
  private readonly STACK_HEIGHT = 30;

  constructor(){
    this.stacks = [];
    this.lastY = $game.height - this.STACK_HEIGHT / 2;
    this.width = this.STACK_WIDTH;
    this.speed = 2.5;
    this.score = 0;
    this.gradient = new Color("#25a6fa");
    this.gradient.startGradient("#ff005b");

    this.stacks.push({
      rect: new Rectangle(this.STACK_WIDTH, this.STACK_HEIGHT, $game.width / 2, this.lastY),
      current: false,
      color: this.gradient.value
    });
  }

  public run():void{
    this.tick = requestAnimationFrame(this.onTick.bind(this));

    // click the screen
    $game.canvas.addEventListener("click", () => {
      const lastStack = this.stacks.at(-1);
      if(lastStack !== undefined){
        if(lastStack.rect.position.x < 0 || lastStack.rect.position.x > $game.width - this.width) return;
        lastStack.current = false;
        this.isStackSpawn = false;
        this.isLeft = !this.isLeft;
        // manage camera position y
        if(this.stacks.length % 7 === 0)
          this.newCameraY = this.stacks.length * this.STACK_HEIGHT - this.STACK_HEIGHT / 2 * 5;
        const previousStack = this.stacks.at(-2);
        if(previousStack !== undefined){
          // cut the stack
          const overflowWidth = Math.abs(lastStack.rect.position.x - previousStack.rect.position.x);
          this.width -= overflowWidth;
          lastStack.rect.rescale(new Vector2(this.width, this.STACK_HEIGHT));
          let overflowRectangle:Rectangle = new Rectangle(overflowWidth, this.STACK_HEIGHT, lastStack.rect.position.x + this.width + overflowWidth / 2, this.lastY);
          // stack that cutted re-position
          if(lastStack.rect.position.x < previousStack.rect.position.x){
            lastStack.rect.translateTo(lastStack.rect.position.add(Vector2.right.multiply(overflowWidth)));
            overflowRectangle = new Rectangle(overflowWidth, this.STACK_HEIGHT, lastStack.rect.position.x - overflowWidth / 2, this.lastY);
          }
          this.score += this.width;
          // store overflow stack
          this.overflowStack = {
            rect: overflowRectangle,
            current: false,
            color: lastStack.color,
            transparcy: 1
          };
        }
      }
    });
  }

  private get direction():Vector2{
    return Vector2.right.multiply(this.isLeft ? 1 : -1);
  }

  private gameLoop():void{
    // $game.clearRect(0, 0, $game.width, $game.height);
    $game.canvas.width = 0;
    $game.canvas.width = $game.width;

    // moving camera y
    if(this.cameraY !== this.newCameraY){
      this.cameraY = lerp(this.cameraY, this.newCameraY, 0.3);
      $game.setTransform(1, 0, 0, 1, 0, this.cameraY);
    }

    // spawn new stack
    if(!this.isStackSpawn){
      this.isStackSpawn = true;
      this.lastY -= this.STACK_HEIGHT;
      this.stacks.push({
        rect: new Rectangle(this.width, this.STACK_HEIGHT, this.isLeft ? -this.width / 2 : $game.width + this.width / 2, this.lastY),
        current: true,
        color: this.gradient.nextGradient()
      });
    }

    // moving current stack
    const lastStack = this.stacks.at(-1);
    if(lastStack !== undefined && lastStack.current){
      lastStack.rect.translateTo(lastStack.rect.position.add(this.direction.multiply(this.speed)));
    }
    for(const stack of this.stacks)
      stack.rect.draw(stack.color);

    // animating overflow stack
    if(this.overflowStack !== null){
      this.overflowStack.transparcy = lerp(this.overflowStack.transparcy, 0, 0.15);
      if(this.overflowStack.transparcy <= 0.1){
        this.overflowStack = null;
      }else{
        $game.fillStyle = `${this.overflowStack.color}${Math.floor(255 * this.overflowStack.transparcy).toString(16)}`;
        this.overflowStack.rect.translateTo(this.overflowStack.rect.position.add(Vector2.down.multiply(6)));
        this.overflowStack.rect.draw();
      }
    }

    // display viewport ui
    $game.font = "20px Arial";
    $game.fillStyle = "#000";
    $game.fillText(`${this.score.toLocaleString()}점`, 10, 30 - this.cameraY);
  }

  private onTick():void{
    this.gameLoop();
    this.tick = requestAnimationFrame(this.onTick.bind(this));
  }
}
