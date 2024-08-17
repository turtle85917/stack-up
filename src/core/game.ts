import Rectangle from "../objects/rectangle";
import Vector2 from "../utils/vector2";
import type {Stack} from "../types/game";

export default class Game{
  private lastY;
  private stacks:Stack[];

  private isStackSpawn:boolean = false;

  private width:number;
  private tick:number = 0;

  private readonly STACK_WIDTH = 240;
  private readonly STACK_HEIGHT = 50;

  constructor(){
    this.stacks = [];
    this.lastY = $game.height + this.STACK_HEIGHT / 2;
    this.width = this.STACK_WIDTH
  }

  public run():void{
    this.tick = requestAnimationFrame(this.onTick.bind(this));
    $game.canvas.addEventListener("click", () => {
      const lastStack = this.stacks.at(-1);
      if(lastStack !== undefined){
        lastStack.current = false;
        this.isStackSpawn = false;
        const previousStack = this.stacks.at(-2);
        if(previousStack !== undefined){
          const newWidth = Math.abs(previousStack.rect.position.x - lastStack.rect.position.x);
          this.width -= newWidth;
          lastStack.rect.rescale(new Vector2(this.width, this.STACK_HEIGHT));
          lastStack.rect.translateTo(lastStack.rect.position.add(Vector2.right.multiply(newWidth)));
        }
      }
    });
  }

  private gameLoop():void{
    $game.clearRect(0, 0, $game.width, $game.height);

    if(!this.isStackSpawn){
      this.isStackSpawn = true;
      this.lastY -= this.STACK_HEIGHT;
      this.stacks.push({
        rect: new Rectangle(this.width, this.STACK_HEIGHT, -this.STACK_WIDTH / 2, this.lastY),
        current: true
      });
    }

    const lastStack = this.stacks.at(-1);
    if(lastStack !== undefined && lastStack.current){
      lastStack.rect.translateTo(lastStack.rect.position.add(Vector2.right.multiply(2.5)));
    }
    for(const stack of this.stacks)
      stack.rect.draw();
  }

  private onTick():void{
    this.gameLoop();
    this.tick = requestAnimationFrame(this.onTick.bind(this));
  }
}
