import Base from "./_base";
import type Color from "../utils/color";

export default class Rectangle extends Base{
  public draw(color?:Color){
    if(color)
      $game.fillStyle = color.value;
    $game.fillRect(this.x, this.y, this.width, this.height);
  }
}
