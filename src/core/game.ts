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
  private isGameEnded:boolean = false;

  private overflowStack:Stack&{transparency:number;}|null = null;

  private width:number;
  private speed:number;
  private score:number;
  private combo:number;
  private gradient:Generator<string, string, string>;
  private tick:number = 0;
  private bestScore:number = 0;

  // gameover panel
  private gameoverPanelTransparency:number = 0;
  private gameoverTextTransparency:number = 0;

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
    this.combo = 0;
    this.gradient = new Color("#696EFF").gettingGradient(["#9983FF", "#B18DFF", "#E0A2FF", "#F8ACFF"]);

    this.stacks.push({
      rect: new Rectangle(this.STACK_WIDTH, this.STACK_HEIGHT, $game.width / 2, this.lastY),
      current: false,
      color: "#696EFF"
    });
  }

  public run():void{
    this.bestScore = parseInt(localStorage.getItem("stack.bestScore") ?? '0');
    this.tick = requestAnimationFrame(this.onTick.bind(this));

    // click the screen
    $game.canvas.addEventListener("click", () => {
      if(this.isGameEnded) return;
      const lastStack = this.stacks.at(-1);
      if(lastStack !== undefined){
        if(lastStack.rect.position.x < 0 || lastStack.rect.position.x > $game.width - this.width) return;
        lastStack.current = false;
        this.isStackSpawn = false;
        this.isLeft = !this.isLeft;
        // manage camera position y
        if(this.stacks.length % 7 === 0)
          this.newCameraY = this.stacks.length * this.STACK_HEIGHT - this.STACK_HEIGHT / 2 * 5;
        // speed up
        if(this.stacks.length % 10 === 0)
          this.speed *= 1.1;
        const previousStack = this.stacks.at(-2);
        if(previousStack !== undefined){
          // cut the stack
          const overflowWidth = Math.abs(lastStack.rect.position.x - previousStack.rect.position.x);
          if(this.width < overflowWidth){
            this.isGameEnded = true;
            this.gameoverPanelTransparency = 0;
            this.gameoverTextTransparency = 0;
            this.overflowStack = {...lastStack, current: false, transparency: 1};
            if(this.bestScore < this.score){
              localStorage.setItem("stack.bestScore", this.score.toString());
              this.bestScore = this.score;
            }
            return;
          }
          this.width -= overflowWidth;
          lastStack.rect.rescale(new Vector2(this.width, this.STACK_HEIGHT));
          let overflowRectangle:Rectangle = new Rectangle(overflowWidth, this.STACK_HEIGHT, lastStack.rect.position.x + this.width + overflowWidth / 2, this.lastY);
          // stack that cutted re-position
          if(lastStack.rect.position.x < previousStack.rect.position.x){
            lastStack.rect.translateTo(lastStack.rect.position.add(Vector2.right.multiply(overflowWidth)));
            overflowRectangle = new Rectangle(overflowWidth, this.STACK_HEIGHT, lastStack.rect.position.x - overflowWidth / 2, this.lastY);
          }
          this.score += Math.floor(this.width / 2);
          if(overflowWidth === 0){
            this.combo++;
          }else
            this.combo = 0;
          // store overflow stack
          this.overflowStack = {
            rect: overflowRectangle,
            current: false,
            color: lastStack.color,
            transparency: 1
          };
        }
      }
    });
  }

  private get direction():Vector2{
    return Vector2.right.multiply(this.isLeft ? 1 : -1);
  }

  private gameLoop():void{
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
        color: this.gradient.next().value
      });
    }

    // moving current stack
    const lastStack = this.stacks.at(-1);
    if(!this.isGameEnded && lastStack !== undefined && lastStack.current){
      lastStack.rect.translateTo(lastStack.rect.position.add(this.direction.multiply(this.speed)));
    }
    for(const stack of this.stacks)
      stack.rect.draw(stack.color);

    // animating overflow stack
    if(this.overflowStack !== null){
      this.overflowStack.transparency = lerp(this.overflowStack.transparency, 0, 0.15);
      if(this.overflowStack.transparency <= 0.1){
        this.overflowStack = null;
      }else{
        $game.fillStyle = `${this.overflowStack.color}${Color.alphaToHex(this.overflowStack.transparency)}`;
        this.overflowStack.rect.translateTo(this.overflowStack.rect.position.add(Vector2.down.multiply(6)));
        this.overflowStack.rect.draw();
      }
    }

    // display viewport ui
    $game.font = "20px Arial";
    $game.fillStyle = "#000";
    $game.fillText(`${this.score.toLocaleString()}점`, 10, 30 - this.cameraY);

    if(this.combo !== 0){
      $game.font = "15px Arial";
      $game.fillStyle = "#000000";
      $game.fillText(`COMBO +${this.combo}`, 10, 50 - this.cameraY);
    }

    // process gameover panel
    if(this.isGameEnded){
      this.gameoverPanelTransparency = lerp(this.gameoverPanelTransparency, 0.3, 0.04);
      this.gameoverTextTransparency = lerp(this.gameoverTextTransparency, 1, 0.04);
      $game.fillStyle = `#000000${Color.alphaToHex(this.gameoverPanelTransparency)}`;
      $game.fillRect(0, -this.cameraY, $game.width, $game.height);
      $game.font = "36px Arial";
      $game.textAlign = "center";
      $game.fillStyle = `#e81515${Color.alphaToHex(this.gameoverTextTransparency)}`;
      $game.fillText("GAME OVER...", $game.width / 2, $game.height / 2 - 30 - this.cameraY);
      $game.font = "18px Arial";
      $game.fillStyle = `#000000${Color.alphaToHex(this.gameoverTextTransparency)}`;
      $game.fillText(`획득 점수 : ${this.score.toLocaleString()}점`, $game.width / 2, $game.height / 2 + 20 - this.cameraY);
      $game.fillText(`최고 점수 : ${this.bestScore.toLocaleString()}점`, $game.width / 2, $game.height / 2 + 60 - this.cameraY);
    }
  }

  private onTick():void{
    this.gameLoop();
    this.tick = requestAnimationFrame(this.onTick.bind(this));
  }
}
