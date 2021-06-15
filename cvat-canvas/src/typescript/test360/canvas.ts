// Copyright (C) 2019-2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import {
    Mode,
    DrawData,
    MergeData,
    SplitData,
    GroupData,
    InteractionData as _InteractionData,
    InteractionResult as _InteractionResult,
    CanvasModel,
    CanvasModelImpl,
    RectDrawingMethod,
    CuboidDrawingMethod,
    Configuration,
    Geometry,
} from './canvasModel';
import { Master } from './master';
import { CanvasController, CanvasControllerImpl } from './canvasController';
import { CanvasView, CanvasViewImpl } from './canvasView';

import '../../scss/canvas.scss';
import pjson from '../../../package.json';

const CanvasVersion = pjson.version;

interface Canvas {
    html(): HTMLDivElement;
    setup(frameData: any, objectStates: any[], zLayer?: number): void;
    setupIssueRegions(issueRegions: Record<number, number[]>): void;
    activate(clientID: number | null, attributeID?: number): void;
    rotate(rotationAngle: number): void;
    focus(clientID: number, padding?: number): void;
    fit(): void;
    grid(stepX: number, stepY: number): void;

    interact(interactionData: InteractionData): void;
    draw(drawData: DrawData): void;
    group(groupData: GroupData): void;
    split(splitData: SplitData): void;
    merge(mergeData: MergeData): void;
    select(objectState: any): void;

    fitCanvas(): void;
    bitmap(enable: boolean): void;
    selectRegion(enable: boolean): void;
    dragCanvas(enable: boolean): void;
    zoomCanvas(enable: boolean): void;

    mode(): Mode;
    cancel(): void;
    configure(configuration: Configuration): void;
    isAbleToChangeFrame(): boolean;

    readonly geometry: Geometry;
}

class CanvasImpl implements Canvas {
    private model: CanvasModel & Master;
    private controller: CanvasController;
    private view: CanvasView;

    public constructor() {
        this.model = new CanvasModelImpl();
        this.controller = new CanvasControllerImpl(this.model);
        this.view = new CanvasViewImpl(this.model, this.controller);
    }

    public html(): HTMLDivElement {
        return this.view.html();
    }

    public setup(frameData: any, objectStates: any[], zLayer = 0): void {
        console.log('CANVAS ---------> 1');
        this.model.setup(frameData, objectStates, zLayer);
    }

    public draw(drawData: DrawData): void {
        console.log('CANVAS ---------> 2');
        this.model.draw(drawData);
    }

    public fitCanvas(): void {
        this.model.fitCanvas(this.view.html().clientWidth, this.view.html().clientHeight);
    }

    public setupIssueRegions(issueRegions: Record<number, number[]>): void {
        //
    }

    public cancel(): void {
        this.model.cancel();
    }

    public configure(configuration: Configuration): void {
        this.model.configure(configuration);
    }

    public activate(clientID: number, attributeID?: number): void {
        this.model.activate(clientID, attributeID);
    }

    public mode(): Mode {
        return this.model.mode;
    }

    public fit(): void {
        this.model.fit();
    }

    public grid(stepX: number, stepY: number): void {
        this.model.grid(stepX, stepY);
    }

    public isAbleToChangeFrame(): boolean {
        return this.model.isAbleToChangeFrame();
    }

    rotate(rotationAngle: number): void {
        throw new Error('Method not implemented.');
    }

    focus(clientID: number, padding?: number): void {
        throw new Error('Method not implemented.');
    }

    interact(interactionData: _InteractionData): void {
        throw new Error('Method not implemented.');
    }

    group(groupData: GroupData): void {
        throw new Error('Method not implemented.');
    }

    split(splitData: SplitData): void {
        throw new Error('Method not implemented.');
    }

    merge(mergeData: MergeData): void {
        throw new Error('Method not implemented.');
    }

    select(objectState: any): void {
        throw new Error('Method not implemented.');
    }

    bitmap(enable: boolean): void {
        throw new Error('Method not implemented.');
    }

    selectRegion(enable: boolean): void {
        throw new Error('Method not implemented.');
    }

    dragCanvas(enable: boolean): void {
        throw new Error('Method not implemented.');
    }

    zoomCanvas(enable: boolean): void {
        throw new Error('Method not implemented.');
    }

    geometry: Geometry;
}

export type InteractionData = _InteractionData;
export type InteractionResult = _InteractionResult;

export { CanvasImpl as Canvas, CanvasVersion, RectDrawingMethod, CuboidDrawingMethod, Mode as CanvasMode };
