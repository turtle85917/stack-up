import lerp from "./lerp";

export default class Color{
  private endColor:string|null = null;
  private percent:number = 0;
  private gradient:boolean = false;

  private readonly PERCENT_STEP = 0.05;
  private readonly REGEX_HEX1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/;
  private readonly REGEX_HEX2 = /^#?([a-f\d]{3})$/;

  constructor(
    private hexcode:string
  ){
    if(!this.REGEX_HEX1.test(hexcode) && !this.REGEX_HEX2.test(hexcode))
      throw new Error("Invaild hex code.");
  }

  public get value():string{
    return this.hexcode;
  }
  public get rgb():RGB{
    return this.hexToRgb(this.hexcode);
  }

  public *startGradient(endColor:Color|string):Generator<string, string, string>{
    if(!this.gradient){
      this.endColor = typeof endColor === "string" ? endColor : endColor.value;
      this.gradient = true;
    }
    while(true){
      while(this.percent < 1){
        this.percent += this.PERCENT_STEP;
        yield this.getLerpColor();
      }
      while(this.percent > 0){
        this.percent -= this.PERCENT_STEP;
        yield this.getLerpColor();
      }
    }
  }

  public toString():string{
    return this.value;
  }

  private getLerpColor():string{
    const [r1, g1, b1] = this.rgb;
    const [r2, g2, b2] = this.hexToRgb(this.endColor!);
    return this.rgbToHex([lerp(r1, r2, this.percent), lerp(g1, g2, this.percent), lerp(b1, b2, this.percent)]);
  }

  private hexToRgb(_hex:string):RGB{
    let hex = _hex;
    if(this.REGEX_HEX2.test(_hex))
      hex = _hex + '0'.repeat(3);
    const [,r, g, b] = this.REGEX_HEX1.exec(hex)!;
    return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
  }
  private rgbToHex(rgb:RGB):string{
    return '#' + Math.floor(rgb[0]).toString(16) + Math.floor(rgb[1]).toString(16) + Math.floor(rgb[2]).toString(16);
  }
}
