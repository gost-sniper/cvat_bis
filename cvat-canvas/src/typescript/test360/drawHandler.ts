import { DrawData } from './canvasModel';

export interface DrawHandler {
    draw(drawData: DrawData, point: any): void;
}

export class DrawHandlerImpl implements DrawHandler {
    // callback is used to notify about creating new shape
    private onDrawDone: (data: object | null, duration?: number, continueDraw?: boolean) => void;
    private startTimestamp: number;
    private drawData: DrawData;

    private startDraw(): void {
        // TODO: Use enums after typification cvat-core
        console.log('DRAWHANDLER ---------> 2');
        if (this.drawData.initialState) {
            console.log('DRAWHANDLER ---------> 3');
            if (this.drawData.shapeType === 'rectangle') {
                alert('Method not implemented.');
                // throw new Error('Method not implemented.');
            } else {
                console.log('DRAWHANDLER ---------> 4');

                if (this.drawData.shapeType === 'polygon') {
                    alert('Method not implemented.');
                    // throw new Error('Method not implemented.');
                } else if (this.drawData.shapeType === 'polyline') {
                    alert('Method not implemented.');
                    // throw new Error('Method not implemented.');
                } else if (this.drawData.shapeType === 'points') {
                    // this.pastePoints(stringifiedPoints);
                } else if (this.drawData.shapeType === 'cuboid') {
                    alert('Method not implemented.');
                    // throw new Error('Method not implemented.');
                }
            }
            // this.setupPasteEvents();
        } else {
            console.log('DRAWHANDLER ---------> 5');
            if (this.drawData.shapeType === 'rectangle') {
                alert('Method not implemented.');
                // throw new Error('Method not implemented.');
            } else if (this.drawData.shapeType === 'polygon') {
                alert('Method not implemented.');
                // throw new Error('Method not implemented.');
            } else if (this.drawData.shapeType === 'polyline') {
                alert('Method not implemented.');
                // throw new Error('Method not implemented.');
            } else if (this.drawData.shapeType === 'points') {
                console.log('DRAWHANDLER ---------> 6');
            } else if (this.drawData.shapeType === 'cuboid') {
                alert('Method not implemented.');
                // throw new Error('Method not implemented.');
            }
        }

        this.startTimestamp = Date.now();
    }

    public constructor(onDrawDone: (data: object | null, duration?: number, continueDraw?: boolean) => void) {
        this.startTimestamp = Date.now();
        this.onDrawDone = onDrawDone;
        this.drawData = null;
    }

    public draw(drawData: DrawData, point: any): void {
        console.log('DRAWHANDLER ---------> 1', drawData);
        let points = [];
        points = point;
        if (drawData.enabled) {
            this.drawData = drawData;
            this.startDraw();
        } else {
            if (points === undefined || points.length == 0) {
                this.onDrawDone(null);
            } else {
                const { shapeType, redraw: clientID } = this.drawData;

                console.log('DRAWHANDLER ---------> 11: ', clientID, '-', shapeType, '-', points);
                this.onDrawDone(
                    {
                        clientID,
                        shapeType,
                        points,
                    },
                    Date.now() - this.startTimestamp,
                );
                this.drawData = drawData;
                this.onDrawDone(null);
            }
        }
    }
}
