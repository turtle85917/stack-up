import Rectangle from "../objects/rectangle";
import Vector2 from "../utils/vector2";
import Color from "../utils/color";
import type {Stack} from "../types/game";

export default class Game{
  private lastY;
  private stacks:Stack[];

  private isLeft:boolean = true;
  private isStackSpawn:boolean = false;

  private width:number;
  private gradient:Color;
  private tick:number = 0;

  private readonly STACK_WIDTH = 280;
  private readonly STACK_HEIGHT = 30;

  constructor(){
    this.stacks = [];
    this.lastY = $game.height - this.STACK_HEIGHT / 2;
    this.width = this.STACK_WIDTH;
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
    $game.canvas.addEventListener("click", () => {
      const lastStack = this.stacks.at(-1);
      if(lastStack !== undefined){
        if(lastStack.rect.position.x < 0 || lastStack.rect.position.x > $game.width - this.width) return;
        lastStack.current = false;
        this.isStackSpawn = false;
        this.isLeft = !this.isLeft;
        const previousStack = this.stacks.at(-2);
        if(previousStack !== undefined){
          const overflowWidth = Math.abs(lastStack.rect.position.x - previousStack.rect.position.x);
          this.width -= overflowWidth;
          lastStack.rect.rescale(new Vector2(this.width, this.STACK_HEIGHT));
          if(lastStack.rect.position.x < previousStack.rect.position.x){
            lastStack.rect.translateTo(lastStack.rect.position.add(Vector2.right.multiply(overflowWidth)));
          }
        }
      }
    });
  }

  private get direction():Vector2{
    return Vector2.right.multiply(this.isLeft ? 1 : -1);
  }

  private gameLoop():void{
    $game.clearRect(0, 0, $game.width, $game.height);

    if(!this.isStackSpawn){
      this.isStackSpawn = true;
      this.lastY -= this.STACK_HEIGHT;
      this.stacks.push({
        rect: new Rectangle(this.width, this.STACK_HEIGHT, this.isLeft ? -this.width / 2 : $game.width + this.width / 2, this.lastY),
        current: true,
        color: this.gradient.nextGradient()
      });
    }

    const lastStack = this.stacks.at(-1);
    if(lastStack !== undefined && lastStack.current){
      lastStack.rect.translateTo(lastStack.rect.position.add(this.direction.multiply(2.5)));
    }
    for(const stack of this.stacks){
      $game.fillStyle = stack.color;
      stack.rect.draw();
    }
  }

  private onTick():void{
    this.gameLoop();
    this.tick = requestAnimationFrame(this.onTick.bind(this));
  }
}
