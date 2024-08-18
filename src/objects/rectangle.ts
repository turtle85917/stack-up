import Base from "./_base";
import type Color from "../utils/color";

export default class Rectangle extends Base{
  public draw(color?:Color|string){
    if(color)
      $game.fillStyle = color.toString();
    $game.fillRect(this.x, this.y, this.width, this.height);
  }
}
