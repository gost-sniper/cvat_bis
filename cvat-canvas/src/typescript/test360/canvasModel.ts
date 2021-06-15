// Copyright (C) 2019-2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import { MasterImpl } from './master';

export interface Size {
    width: number;
    height: number;
}

export interface Image {
    renderWidth: number;
    renderHeight: number;
    imageData: ImageData | CanvasImageSource;
}

export interface Position {
    x: number;
    y: number;
}

export interface Geometry {
    image: Size;
    canvas: Size;
    grid: Size;
    top: number;
    left: number;
    scale: number;
    offset: number;
    angle: number;
}

export interface FocusData {
    clientID: number;
    padding: number;
}

export interface ActiveElement {
    clientID: number | null;
    attributeID: number | null;
}

export enum RectDrawingMethod {
    CLASSIC = 'By 2 points',
    EXTREME_POINTS = 'By 4 points',
}

export enum CuboidDrawingMethod {
    CLASSIC = 'From rectangle',
    CORNER_POINTS = 'By 4 points',
}

export interface Configuration {
    autoborders?: boolean;
    displayAllText?: boolean;
    undefinedAttrValue?: string;
    showProjections?: boolean;
    forceDisableEditing?: boolean;
}

export interface DrawData {
    enabled: boolean;
    shapeType?: string;
    rectDrawingMethod?: RectDrawingMethod;
    cuboidDrawingMethod?: CuboidDrawingMethod;
    numberOfPoints?: number;
    initialState?: any;
    crosshair?: boolean;
    redraw?: number;
}

export interface InteractionData {
    enabled: boolean;
    shapeType?: string;
    crosshair?: boolean;
    minPosVertices?: number;
    minNegVertices?: number;
}

export interface InteractionResult {
    points: number[];
    shapeType: string;
    button: number;
}

export interface EditData {
    enabled: boolean;
    state: any;
    pointID: number;
}

export interface GroupData {
    enabled: boolean;
}

export interface MergeData {
    enabled: boolean;
}

export interface SplitData {
    enabled: boolean;
}

export enum FrameZoom {
    MIN = 0.1,
    MAX = 10,
}

export enum UpdateReasons {
    IMAGE_CHANGED = 'image_changed',
    IMAGE_ZOOMED = 'image_zoomed',
    IMAGE_FITTED = 'image_fitted',
    IMAGE_MOVED = 'image_moved',
    GRID_UPDATED = 'grid_updated',

    ISSUE_REGIONS_UPDATED = 'issue_regions_updated',
    OBJECTS_UPDATED = 'objects_updated',
    SHAPE_ACTIVATED = 'shape_activated',
    SHAPE_FOCUSED = 'shape_focused',

    FITTED_CANVAS = 'fitted_canvas',

    INTERACT = 'interact',
    DRAW = 'draw',
    MERGE = 'merge',
    SPLIT = 'split',
    GROUP = 'group',
    SELECT = 'select',
    CANCEL = 'cancel',
    BITMAP = 'bitmap',
    SELECT_REGION = 'select_region',
    DRAG_CANVAS = 'drag_canvas',
    ZOOM_CANVAS = 'zoom_canvas',
    CONFIG_UPDATED = 'config_updated',
    DATA_FAILED = 'data_failed',
}

export enum Mode {
    IDLE = 'idle',
    DRAG = 'drag',
    RESIZE = 'resize',
    DRAW = 'draw',
    EDIT = 'edit',
    MERGE = 'merge',
    SPLIT = 'split',
    GROUP = 'group',
    INTERACT = 'interact',
    SELECT_REGION = 'select_region',
    DRAG_CANVAS = 'drag_canvas',
    ZOOM_CANVAS = 'zoom_canvas',
}

export enum LabelList {
    DOOR = 'pnlm-door-hotspot',
    WINDOW = 'pnlm-window-hotspot',
    WALL_CORNER = 'pnlm-wall-corner-hotspot',
    STAIR = 'pnlm-stairs-hotspot',
    DEFAULT = 'pnlm-default-hotspot',
}

export interface CanvasModel {
    readonly imageBitmap: boolean;
    readonly image: Image | null;
    readonly issueRegions: Record<number, number[]>;
    readonly objects: any[];
    readonly zLayer: number | null;
    readonly gridSize: Size;
    readonly focusData: FocusData;
    readonly activeElement: ActiveElement;
    readonly drawData: DrawData;
    readonly interactionData: InteractionData;
    readonly mergeData: MergeData;
    readonly splitData: SplitData;
    readonly groupData: GroupData;
    readonly configuration: Configuration;
    readonly selected: any;
    geometry: Geometry;
    mode: Mode;
    exception: Error | null;

    zoom(x: number, y: number, direction: number): void;
    move(topOffset: number, leftOffset: number): void;

    setup(frameData: any, objectStates: any[], zLayer: number): void;
    setupIssueRegions(issueRegions: Record<number, number[]>): void;
    activate(clientID: number | null, attributeID: number | null): void;
    rotate(rotationAngle: number): void;
    focus(clientID: number, padding: number): void;
    fit(): void;
    grid(stepX: number, stepY: number): void;

    draw(drawData: DrawData): void;
    group(groupData: GroupData): void;
    split(splitData: SplitData): void;
    merge(mergeData: MergeData): void;
    select(objectState: any): void;
    interact(interactionData: InteractionData): void;

    fitCanvas(width: number, height: number): void;
    bitmap(enabled: boolean): void;
    selectRegion(enabled: boolean): void;
    dragCanvas(enable: boolean): void;
    zoomCanvas(enable: boolean): void;

    isAbleToChangeFrame(): boolean;
    configure(configuration: Configuration): void;
    cancel(): void;
}

export class CanvasModelImpl extends MasterImpl implements CanvasModel {
    private data: {
        activeElement: ActiveElement;
        angle: number;
        canvasSize: Size;
        configuration: Configuration;
        imageBitmap: boolean;
        image: Image | null;
        imageID: number | null;
        imageOffset: number;
        imageSize: Size;
        focusData: FocusData;
        gridSize: Size;
        left: number;
        objects: any[];
        issueRegions: Record<number, number[]>;
        scale: number;
        top: number;
        zLayer: number | null;
        drawData: DrawData;
        interactionData: InteractionData;
        mergeData: MergeData;
        groupData: GroupData;
        splitData: SplitData;
        selected: any;
        mode: Mode;
        exception: Error | null;
    };

    public constructor() {
        super();

        this.data = {
            activeElement: {
                clientID: null,
                attributeID: null,
            },
            angle: 0,
            canvasSize: {
                height: 0,
                width: 0,
            },
            configuration: {
                displayAllText: false,
                autoborders: false,
                undefinedAttrValue: '',
            },
            imageBitmap: false,
            image: null,
            imageID: null,
            imageOffset: 0,
            imageSize: {
                height: 0,
                width: 0,
            },
            focusData: {
                clientID: 0,
                padding: 0,
            },
            gridSize: {
                height: 100,
                width: 100,
            },
            left: 0,
            objects: [],
            issueRegions: {},
            scale: 1,
            top: 0,
            zLayer: null,
            drawData: {
                enabled: false,
                initialState: null,
            },
            interactionData: {
                enabled: false,
            },
            mergeData: {
                enabled: false,
            },
            groupData: {
                enabled: false,
            },
            splitData: {
                enabled: false,
            },
            selected: null,
            mode: Mode.IDLE,
            exception: null,
        };
    }

    zoom(x: number, y: number, direction: number): void {
        throw new Error('Method not implemented.');
    }
    move(topOffset: number, leftOffset: number): void {
        throw new Error('Method not implemented.');
    }
    public setup(frameData: any, objectStates: any[], zLayer: number): void {
        console.log('CANVAS MODEL ---------> 1');
        if (this.data.imageID !== frameData.number) {
            console.log('CANVAS MODEL ---------> 1.2');
            if ([Mode.EDIT, Mode.DRAG, Mode.RESIZE].includes(this.data.mode)) {
                throw Error(`Canvas is busy. Action: ${this.data.mode}`);
            }
        }

        if (frameData.number === this.data.imageID) {
            console.log('CANVAS MODEL ---------> 1.7');
            this.data.zLayer = zLayer;
            this.data.objects = objectStates;
            this.notify(UpdateReasons.OBJECTS_UPDATED);
            return;
        }

        this.data.imageID = frameData.number;
        frameData
            .data((): void => {
                this.data.image = null;
                this.notify(UpdateReasons.IMAGE_CHANGED);
                console.log('CANVAS MODEL ---------> 1.3');
            })
            .then((data: Image): void => {
                console.log('CANVAS MODEL ---------> 1.4', data);
                if (frameData.number !== this.data.imageID) {
                    // already another image
                    return;
                }

                this.data.imageSize = {
                    height: frameData.height as number,
                    width: frameData.width as number,
                };
                console.log('CANVAS MODEL ---------> 1.5');
                this.data.image = data;
                console.log('CANVAS MODEL ---------> 1.5.1', this.data.image);
                this.notify(UpdateReasons.IMAGE_CHANGED);
                this.data.zLayer = zLayer;
                this.data.objects = objectStates;
                this.notify(UpdateReasons.OBJECTS_UPDATED);

                console.log('CANVAS MODEL ---------> 1.6', this.data);
            })
            .catch((exception: any): void => {
                this.data.exception = exception;
                this.notify(UpdateReasons.DATA_FAILED);
                throw exception;
            });
    }
    setupIssueRegions(issueRegions: Record<number, number[]>): void {
        throw new Error('Method not implemented.');
    }
    public activate(clientID: number | null, attributeID: number | null): void {
        if (this.data.activeElement.clientID === clientID && this.data.activeElement.attributeID === attributeID) {
            return;
        }

        if (this.data.mode !== Mode.IDLE && clientID !== null) {
            throw Error(`Canvas is busy. Action: ${this.data.mode}`);
        }

        if (typeof clientID === 'number') {
            const [state] = this.objects.filter((_state: any): boolean => _state.clientID === clientID);
            if (!state || state.objectType === 'tag') {
                return;
            }
        }

        this.data.activeElement = {
            clientID,
            attributeID,
        };

        this.notify(UpdateReasons.SHAPE_ACTIVATED);
    }
    rotate(rotationAngle: number): void {
        throw new Error('Method not implemented.');
    }
    focus(clientID: number, padding: number): void {
        throw new Error('Method not implemented.');
    }

    public fit(): void {
        this.notify(UpdateReasons.IMAGE_FITTED);
    }

    public grid(stepX: number, stepY: number): void {
        this.data.gridSize = {
            height: stepY,
            width: stepX,
        };

        this.notify(UpdateReasons.GRID_UPDATED);
    }

    public draw(drawData: DrawData): void {
        console.log('CANVAS MODEL ---------> 1');
        if (![Mode.IDLE, Mode.DRAW].includes(this.data.mode)) {
            throw Error(`Canvas is busy. Action: ${this.data.mode}`);
        }

        if (drawData.enabled) {
            if (this.data.drawData.enabled) {
                throw new Error('Drawing has been already started');
            } else if (!drawData.shapeType && !drawData.initialState) {
                throw new Error('A shape type is not specified');
            } else if (typeof drawData.numberOfPoints !== 'undefined') {
                if (drawData.shapeType === 'polygon' && drawData.numberOfPoints < 3) {
                    throw new Error('A polygon consists of at least 3 points');
                } else if (drawData.shapeType === 'polyline' && drawData.numberOfPoints < 2) {
                    throw new Error('A polyline consists of at least 2 points');
                }
            }
        }

        if (typeof drawData.redraw === 'number') {
            const clientID = drawData.redraw;
            const [state] = this.data.objects.filter((_state: any): boolean => _state.clientID === clientID);

            if (state) {
                this.data.drawData = { ...drawData };
                this.data.drawData.shapeType = state.shapeType;
            } else {
                return;
            }
        } else {
            this.data.drawData = { ...drawData };
            if (this.data.drawData.initialState) {
                this.data.drawData.shapeType = this.data.drawData.initialState.shapeType;
            }
        }

        this.notify(UpdateReasons.DRAW);
    }

    public isAbleToChangeFrame(): boolean {
        const isUnable =
            [Mode.DRAG, Mode.EDIT, Mode.RESIZE, Mode.INTERACT].includes(this.data.mode) ||
            (this.data.mode === Mode.DRAW && typeof this.data.drawData.redraw === 'number');

        return !isUnable;
    }

    public get objects(): any[] {
        if (this.data.zLayer !== null) {
            return this.data.objects.filter((object: any): boolean => object.zOrder <= this.data.zLayer);
        }

        return this.data.objects;
    }

    public fitCanvas(width: number, height: number): void {
        this.data.canvasSize.height = height;
        this.data.canvasSize.width = width;

        this.data.imageOffset = Math.floor(
            Math.max(this.data.canvasSize.height / FrameZoom.MIN, this.data.canvasSize.width / FrameZoom.MIN),
        );

        this.notify(UpdateReasons.FITTED_CANVAS);
        this.notify(UpdateReasons.OBJECTS_UPDATED);
    }

    public cancel(): void {
        this.notify(UpdateReasons.CANCEL);
    }

    configure(configuration: Configuration): void {
        if (typeof configuration.displayAllText !== 'undefined') {
            this.data.configuration.displayAllText = configuration.displayAllText;
        }

        if (typeof configuration.showProjections !== 'undefined') {
            this.data.configuration.showProjections = configuration.showProjections;
        }
        if (typeof configuration.autoborders !== 'undefined') {
            this.data.configuration.autoborders = configuration.autoborders;
        }

        if (typeof configuration.undefinedAttrValue !== 'undefined') {
            this.data.configuration.undefinedAttrValue = configuration.undefinedAttrValue;
        }

        if (typeof configuration.forceDisableEditing !== 'undefined') {
            this.data.configuration.forceDisableEditing = configuration.forceDisableEditing;
        }

        this.notify(UpdateReasons.CONFIG_UPDATED);
    }

    public get drawData(): DrawData {
        return { ...this.data.drawData };
    }

    public get imageBitmap(): boolean {
        //
        return this.data.imageBitmap;
    }

    public set geometry(geometry: Geometry) {
        throw new Error('Method not implemented.');
    }

    public get configuration(): Configuration {
        throw new Error('Method not implemented.');
    }

    public get zLayer(): number | null {
        throw new Error('Method not implemented.');
    }

    public get image(): Image | null {
        return this.data.image;
    }

    public get issueRegions(): Record<number, number[]> {
        throw new Error('Method not implemented.');
    }

    public group(groupData: GroupData): void {
        throw new Error('Method not implemented.');
    }
    public split(splitData: SplitData): void {
        throw new Error('Method not implemented.');
    }
    public merge(mergeData: MergeData): void {
        throw new Error('Method not implemented.');
    }
    public select(objectState: any): void {
        throw new Error('Method not implemented.');
    }
    public interact(interactionData: InteractionData): void {
        throw new Error('Method not implemented.');
    }

    public bitmap(enabled: boolean): void {
        throw new Error('Method not implemented.');
    }
    public selectRegion(enabled: boolean): void {
        throw new Error('Method not implemented.');
    }
    public dragCanvas(enable: boolean): void {
        throw new Error('Method not implemented.');
    }
    public zoomCanvas(enable: boolean): void {
        throw new Error('Method not implemented.');
    }

    public get gridSize(): Size {
        throw new Error('Method not implemented.');
    }

    public get focusData(): FocusData {
        throw new Error('Method not implemented.');
    }

    public get activeElement(): ActiveElement {
        throw new Error('Method not implemented.');
    }

    public get interactionData(): InteractionData {
        throw new Error('Method not implemented.');
    }

    public get mergeData(): MergeData {
        throw new Error('Method not implemented.');
    }

    public get splitData(): SplitData {
        throw new Error('Method not implemented.');
    }

    public get groupData(): GroupData {
        throw new Error('Method not implemented.');
    }

    public get selected(): any {
        throw new Error('Method not implemented.');
    }

    public set mode(value: Mode) {
        this.data.mode = value;
    }

    public get mode(): Mode {
        return this.data.mode;
    }
    public get exception(): Error {
        throw new Error('Method not implemented.');
    }
}
