import Vector2 from "../utils/vector2";

export default class Base{
  constructor(
    protected width:number,
    protected height:number,
    protected x:number,
    protected y:number,
    protected color:string = "#000000"
  ){
    this.x = x - width / 2;
    this.y = y - height / 2;
  }

  public get position():Vector2{
    return new Vector2(this.x, this.y);
  }
  public set position(value:Vector2){
    this.x = value.x;
    this.y = value.y;
  }

  public getCentroid():Vector2{
    return new Vector2($game.width / 2 - this.width / 2, $game.height / 2 - this.height / 2);
  }

  public translateTo(){}

  public draw():void{}
}
