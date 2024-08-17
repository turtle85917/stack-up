import Vector2 from "../utils/vector2";

export default class Base{
  protected x:number;
  protected y:number;

  constructor(
    protected width:number,
    protected height:number,
    x:number,
    y:number,
    protected color:string = "#000000"
  ){
    this.x = x - width / 2;
    this.y = y - height / 2;
  }

  public getCentroid():Vector2{
    return new Vector2($game.width / 2 - this.width / 2, $game.height / 2 - this.height / 2);
  }

  public draw():void{}
}
