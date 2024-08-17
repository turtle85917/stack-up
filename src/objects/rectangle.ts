import Base from "./_base";

export default class Rectangle extends Base{
  public draw(){
    $game.fillStyle = this.color;
    $game.fillRect(this.x, this.y, this.width, this.height);
  }
}
