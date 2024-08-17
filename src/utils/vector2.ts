export default class Vector2{
  constructor(
    public readonly x:number,
    public readonly y:number
  ){}

  public add(b:Vector2):Vector2{
    return new Vector2(this.x + b.x, this.y + b.y);
  }
  public minus(b:Vector2):Vector2{
    return new Vector2(this.x - b.x, this.y - b.y);
  }
  public multiply(scala:number):Vector2{
    return new Vector2(this.x * scala, this.y * scala);
  }
  public equalsTo(b:Vector2):boolean{
    return this.x === b.x && this.y === b.y;
  }
}
