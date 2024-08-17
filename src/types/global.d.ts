export {};

declare global {
  var $game: CanvasRenderingContext2D & {
    width: number;
    height: number;
  };
}
