import lerp from "./lerp";

export default class Color{
  private readonly PERCENT_STEP = 0.1;
  private readonly REGEX_HEX1 = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/;
  private readonly REGEX_HEX2 = /^#?([a-fA-F\d]{3})$/;

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

  public *gettingGradient(endColors:string[]):Generator<string, string, string>{
    let percent:number = 0;
    let colorIndex:number = 0;
    while(true){
      while(percent < 1){
        percent += this.PERCENT_STEP;
        yield this.getLerpColor(endColors[colorIndex - 1] ?? this.hexcode, endColors[colorIndex], percent);
      }
      percent = 0;
      colorIndex = (colorIndex + 1) % endColors.length;
    }
  }

  public toString():string{
    return this.value;
  }

  private getLerpColor(start:string, end:string, percent:number):string{
    const [r1, g1, b1] = this.hexToRgb(start);
    const [r2, g2, b2] = this.hexToRgb(end);
    return this.rgbToHex([lerp(r1, r2, percent), lerp(g1, g2, percent), lerp(b1, b2, percent)]);
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
