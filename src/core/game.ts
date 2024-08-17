import Rectangle from "../objects/rectangle";
import type {Stack} from "../types/game";
import Vector2 from "../utils/vector2";

export default class Game{
  private lastY;
  private stacks:Stack[];

  private isStackSpawn:boolean = false;

  private tick:number = 0;

  private readonly STACK_WIDTH = 240;
  private readonly STACK_HEIGHT = 50;

  constructor(){
    this.stacks = [];
    this.lastY = $game.height + this.STACK_HEIGHT / 2;
  }

  public run():void{
    this.tick = requestAnimationFrame(this.onTick.bind(this));
    $game.canvas.addEventListener("click", () => {
      // TODO: Put stack.
    });
  }

  private gameLoop():void{
    $game.clearRect(0, 0, $game.width, $game.height);

    if(!this.isStackSpawn){
      this.isStackSpawn = true;
      this.lastY -= this.STACK_HEIGHT;
      this.stacks.push({
        rect: new Rectangle(this.STACK_WIDTH, this.STACK_HEIGHT, -this.STACK_WIDTH / 2, this.lastY),
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
