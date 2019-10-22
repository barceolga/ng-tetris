export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;
export const COLORS = [
    'cyan',
    'blue',
    'orange',
    'yellow',
    'green',
    'purple',
    'red'
]
  
export const SHAPES = [
 [],
  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
  [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
  [[4, 4], [4, 4]],
  [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
  [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
  [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
]

export class KEY {
    static readonly ESC = 27;
    static readonly SPACE = 32;
    static readonly LEFT = 37;
    static readonly UP = 38;
    static readonly RIGHT = 39;
    static readonly DOWN = 40;
}