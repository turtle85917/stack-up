import Vector2 from "../utils/vector2";
import type Color from "../utils/color";

export default class Base{
  constructor(
    protected width:number,
    protected height:number,
    protected x:number,
    protected y:number
  ){
    this.x = x - width / 2;
    this.y = y - height / 2;
  }

  public get position():Vector2{
    return new Vector2(this.x, this.y);
  }
  public get scale():Vector2{
    return new Vector2(this.width, this.height);
  }

  public getCentroid():Vector2{
    return new Vector2($game.width / 2 - this.width / 2, $game.height / 2 - this.height / 2);
  }

  public rescale(newScale:Vector2){
    this.width = newScale.x;
    this.height = newScale.y;
  }
  public translateTo(newPosition:Vector2):void{
    this.x = newPosition.x;
    this.y = newPosition.y;
  }

  public draw(_color?:Color|string):void{}
}
