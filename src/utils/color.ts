export default class Color{
  private REGEX_HEX1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/;
  private REGEX_HEX2 = /^#?([a-f\d]{3})$/;

  constructor(
    private hexcode:string
  ){
    if(!this.REGEX_HEX1.test(hexcode) || !this.REGEX_HEX2.test(hexcode))
      throw new Error("Invaild hex code.");
  }

  public get value():string{
    return this.hexcode;
  }

  public hexToRgb():RGB{
    let hex = this.hexcode;
    if(this.REGEX_HEX2.test(this.hexcode))
      hex = this.hexcode + '0'.repeat(3);
    const [,r, g, b] = this.REGEX_HEX1.exec(hex)!;
    return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
  }
}
