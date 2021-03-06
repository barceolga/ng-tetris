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
        //Figure out what makes the animation stops sometimes. Suspect that it has to do with typeId value
        const typeId = this.randomizeTetromino(COLORS.length - 1);
        this.shape = SHAPES[typeId];
        this.color = COLORS[typeId];
        this.x = typeId === 4 ? 4 : 3;
        this.y = 0;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }

    drawNext(ctxNext: CanvasRenderingContext2D) {
        ctxNext.clearRect(0, 0, ctxNext.canvas.width, ctxNext.canvas.height);
        ctxNext.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0){
                    ctxNext.fillRect(x, y, 1, 1);
                }
            });
        });
    }

    move(p: IPiece) {
        this.x = p.x;
        this.y = p.y;
        this.shape = p.shape;
    }

    randomizeTetromino(noOfTypes: number): number {
        //console.log(Math.floor(Math.random() * noOfTypes));
        return Math.floor(Math.random() * noOfTypes);
    }
}
