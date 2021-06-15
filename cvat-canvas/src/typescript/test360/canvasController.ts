// Copyright (C) 2019-2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import {
    CanvasModel,
    Geometry,
    Position,
    FocusData,
    ActiveElement,
    DrawData,
    MergeData,
    SplitData,
    GroupData,
    Mode,
    InteractionData,
    Configuration,
} from './canvasModel';

export interface CanvasController {
    readonly objects: any[];
    readonly issueRegions: Record<number, number[]>;
    readonly zLayer: number | null;
    readonly focusData: FocusData;
    readonly activeElement: ActiveElement;
    readonly drawData: DrawData;
    readonly interactionData: InteractionData;
    readonly mergeData: MergeData;
    readonly splitData: SplitData;
    readonly groupData: GroupData;
    readonly selected: any;
    readonly configuration: Configuration;
    mode: Mode;
    geometry: Geometry;

    zoom(x: number, y: number, direction: number): void;
    draw(drawData: DrawData): void;
    interact(interactionData: InteractionData): void;
    merge(mergeData: MergeData): void;
    split(splitData: SplitData): void;
    group(groupData: GroupData): void;
    selectRegion(enabled: boolean): void;
    enableDrag(x: number, y: number): void;
    drag(x: number, y: number): void;
    disableDrag(): void;
    fit(): void;
}

export class CanvasControllerImpl implements CanvasController {
    private model: CanvasModel;
    private lastDragPosition: Position;
    private isDragging: boolean;

    public constructor(model: CanvasModel) {
        this.model = model;
    }

    /* Default */
    issueRegions: Record<number, number[]>;
    zLayer: number;
    focusData: FocusData;
    activeElement: ActiveElement;
    interactionData: InteractionData;
    mergeData: MergeData;
    splitData: SplitData;
    groupData: GroupData;
    selected: any;
    configuration: Configuration;
    mode: Mode;
    geometry: Geometry;
    /* Default */

    public get drawData(): DrawData {
        console.log(this.model.drawData);
        return this.model.drawData;
    }

    public get objects(): any[] {
        return this.model.objects;
    }

    public draw(drawData: DrawData): void {
        this.model.draw(drawData);
    }

    zoom(x: number, y: number, direction: number): void {
        throw new Error('Method not implemented.');
    }
    interact(interactionData: InteractionData): void {
        throw new Error('Method not implemented.');
    }
    merge(mergeData: MergeData): void {
        throw new Error('Method not implemented.');
    }
    split(splitData: SplitData): void {
        throw new Error('Method not implemented.');
    }
    group(groupData: GroupData): void {
        throw new Error('Method not implemented.');
    }
    selectRegion(enabled: boolean): void {
        throw new Error('Method not implemented.');
    }
    enableDrag(x: number, y: number): void {
        throw new Error('Method not implemented.');
    }
    drag(x: number, y: number): void {
        throw new Error('Method not implemented.');
    }
    disableDrag(): void {
        throw new Error('Method not implemented.');
    }
    fit(): void {
        throw new Error('Method not implemented.');
    }
}
