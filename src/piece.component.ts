import { BLOCK_SIZE, COLORS, SHAPES } from './app/constants'

export interface IPiece {
    x: number;
    y: number;
    color: string;
    shape: number[][];
}
export class Piece implements IPiece {
    x: number;
    y: number;
    color: string;
    shape: number[][];

    constructor(
        private ctx: CanvasRenderingContext2D
    ) {
        this.spawn()
    }

    spawn() {
        const typeId = this.randomizeTetromino(COLORS.length - 1);
        this.shape = SHAPES[typeId];
        this.color = COLORS[typeId];
        this.x = 3;
        this.y = 0;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    // this.x & this.y = position on the board
                    // x & y postition are the positions of the shape
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }

    move(p: IPiece) {
        this.x = p.x;
        this.y = p.y;
    }

    randomizeTetromino(noOfTypes: number): number {
        return Math.floor(Math.random() * noOfTypes);
    }
}
