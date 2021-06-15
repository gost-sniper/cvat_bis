// Copyright (C) 2019-2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import * as SVG from 'svg.js';

import 'svg.draggable.js';
import 'svg.resize.js';
import 'svg.select.js';

// Pannellum
import { Viewer } from '../../panellum/viewer';
import { GenerateUUID } from '../../panellum/utils/string-utils';
// Pannellum

import { CanvasController } from './canvasController';
import { Listener, Master } from './master';
import consts from './consts';
import { DrawnState } from './shared';
import {
    CanvasModel,
    Geometry,
    UpdateReasons,
    FrameZoom,
    ActiveElement,
    DrawData,
    MergeData,
    SplitData,
    GroupData,
    Mode,
    Size,
    Configuration,
    InteractionResult,
    InteractionData,
    LabelList,
} from './canvasModel';
import { DrawHandler, DrawHandlerImpl } from './drawHandler';

export interface CanvasView {
    html(): HTMLDivElement;
}

export class CanvasViewImpl implements CanvasView, Listener {
    private canvas: HTMLDivElement;
    private canvas360: any;
    /* Panellum */
    private coordinates: any;
    private viewer: Viewer;
    private setCoordinates: any;
    private hotspots: any;
    /* Panellum */

    /* Default */
    private loadingAnimation: SVGSVGElement;
    private text: SVGSVGElement;
    private adoptedText: SVG.Container;
    private background: HTMLCanvasElement;
    private bitmap: HTMLCanvasElement;
    private grid: SVGSVGElement;
    private gridPath: SVGPathElement;
    private gridPattern: SVGPatternElement;
    private content: SVGSVGElement;
    private adoptedContent: SVG.Container;
    private attachmentBoard: HTMLDivElement;
    private drawnStates: Record<number, DrawnState>;
    private activeElement: ActiveElement;
    private drawHandler: DrawHandler;
    private svgShapes: Record<number, SVG.Shape>;
    private svgTexts: Record<number, SVG.Text>;
    private controller: CanvasController;

    private set mode(value: Mode) {
        this.controller.mode = value;
    }

    private get mode(): Mode {
        return this.controller.mode;
    }

    private serviceFlags: {
        drawHidden: Record<number, boolean>;
    };

    /* Default */

    /* NEW Methods */

    private onDrawDone(data: object | null, duration: number, continueDraw?: boolean): void {
        console.log('CANVAS VIEW ---------> 4');

        if (data) {
            /* ---------------------------- Here it is --------------------------------- */

            const { zLayer } = this.controller;
            const event: CustomEvent = new CustomEvent('canvas.drawn', {
                bubbles: false,
                cancelable: true,
                detail: {
                    // eslint-disable-next-line new-cap
                    state: {
                        ...data,
                        zOrder: zLayer || 0,
                    },
                    continue: continueDraw,
                    duration,
                },
            });
            console.log('CANVAS VIEW ---------> 7');
            this.canvas.dispatchEvent(event);
            /* ---------------------------- Here it is --------------------------------- */
        } else if (!continueDraw) {
            console.log('CANVAS VIEW ---------> 8');
            const event: CustomEvent = new CustomEvent('canvas.canceled', {
                bubbles: false,
                cancelable: true,
            });

            this.canvas.dispatchEvent(event);
        }

        if (!continueDraw) {
            console.log('CANVAS VIEW ---------> 9');
            this.mode = Mode.IDLE;
            this.controller.draw({
                enabled: false,
            });
        }
    }

    private createHotspot(coordinates: any): void {
        const id = GenerateUUID();

        // const hotspot: interfaces.IHotspot = {
        const hotspot = {
            pitch: coordinates[0],
            yaw: coordinates[1],
            type: 'info',
            text: `Pitch: ${coordinates[0]} \n Yaw: ${coordinates[1]}`,
            id: id,
            cssClass: 'pnlm-default-hotspot',
            // Delete on click
            // clickHandlerFunc: () => deleteHotspot(id)
        };

        this.viewer.addNewHotspot(hotspot);

        this.addHotspot(hotspot);
    }

    private createHotspotWithLabels(coordinates: any, labelState: any): void {
        const id = GenerateUUID();

        const cssClass = this.getLabelCss(labelState.label.name);

        // const hotspot: interfaces.IHotspot = {
        const hotspot = {
            pitch: coordinates[0],
            yaw: coordinates[1],
            type: 'info',
            text: `Id:${labelState.clientID} \n Label: ${labelState.label.name} \n Pitch: ${coordinates[0]} \n Yaw: ${coordinates[1]}`,
            id: id,
            cssClass: cssClass,
            // Delete on click
            // clickHandlerFunc: () => deleteHotspot(id)
        };

        this.viewer.addNewHotspot(hotspot);

        this.addHotspot(hotspot);
    }

    private createPairs(list: any): any {
        var pairList = [];

        for (var i = 0; i < list.length - 1; i += 2) {
            pairList.push([list[i], list[i + 1]]);
        }

        return pairList;
    }

    private addHotspot(hotspot: any) {
        this.hotspots.push(hotspot);
    }

    private removeHotspot() {
        this.hotspots.map((hotspot) => this.viewer.removeCurrentHotspot(hotspot.id));
    }

    private getLabelCss(label: string) {
        switch (label.toLowerCase()) {
            case 'door': {
                return LabelList.DOOR;
                break;
            }
            case 'window': {
                return LabelList.WINDOW;
                break;
            }
            case 'wall-corner': {
                return LabelList.WALL_CORNER;
                break;
            }
            case 'stair': {
                return LabelList.STAIR;
                break;
            }
            default: {
                return LabelList.DEFAULT;
                break;
            }
        }
    }

    /* NEW Methods */

    public constructor(model: CanvasModel & Master, controller: CanvasController) {
        this.controller = controller;
        this.mode = Mode.IDLE;
        this.drawnStates = {};
        this.coordinates = [];

        /** Pannelum */
        this.setCoordinates = (coordinates: any) => {
            this.createHotspot(coordinates);
            this.coordinates = this.coordinates.concat(coordinates);
        };
        /** Pannelum */

        // Create HTML elements
        this.loadingAnimation = window.document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.text = window.document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.adoptedText = SVG.adopt((this.text as any) as HTMLElement) as SVG.Container;
        this.background = window.document.createElement('canvas');
        this.bitmap = window.document.createElement('canvas');
        // window.document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        this.grid = window.document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.gridPath = window.document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.gridPattern = window.document.createElementNS('http://www.w3.org/2000/svg', 'pattern');

        this.content = window.document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.adoptedContent = SVG.adopt((this.content as any) as HTMLElement) as SVG.Container;

        this.attachmentBoard = window.document.createElement('div');

        // CANVAS
        this.canvas = window.document.createElement('div');

        // create canvas with API

        this.canvas360 = window.document.createElement('div');

        this.canvas360.setAttribute('id', 'panorama');

        this.canvas360.height = '100%';

        this.canvas360.width = '100%';

        // pass the hotspots as attributes
        // this.viewer = new Viewer(this.canvas360, model);

        // create canvas with API

        const loadingCircle: SVGCircleElement = window.document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const gridDefs: SVGDefsElement = window.document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gridRect: SVGRectElement = window.document.createElementNS('http://www.w3.org/2000/svg', 'rect');

        // Setup defs

        this.canvas.appendChild(this.canvas360);

        // Setup loading animation
        this.loadingAnimation.setAttribute('id', 'cvat_canvas_loading_animation');
        loadingCircle.setAttribute('id', 'cvat_canvas_loading_circle');
        loadingCircle.setAttribute('r', '30');
        loadingCircle.setAttribute('cx', '50%');
        loadingCircle.setAttribute('cy', '50%');

        // Setup grid
        this.grid.setAttribute('id', 'cvat_canvas_grid');
        this.grid.setAttribute('version', '2');
        this.gridPath.setAttribute('d', 'M 1000 0 L 0 0 0 1000');
        this.gridPath.setAttribute('fill', 'none');
        this.gridPath.setAttribute('stroke-width', `${consts.BASE_GRID_WIDTH}`);
        this.gridPath.setAttribute('opacity', 'inherit');
        this.gridPattern.setAttribute('id', 'cvat_canvas_grid_pattern');
        this.gridPattern.setAttribute('width', '100');
        this.gridPattern.setAttribute('height', '100');
        this.gridPattern.setAttribute('patternUnits', 'userSpaceOnUse');
        gridRect.setAttribute('width', '100%');
        gridRect.setAttribute('height', '100%');
        gridRect.setAttribute('fill', 'url(#cvat_canvas_grid_pattern)');

        // Setup content
        this.text.setAttribute('id', 'cvat_canvas_text_content');
        this.background.setAttribute('id', 'cvat_canvas_background');
        this.content.setAttribute('id', 'cvat_canvas_content');
        this.bitmap.setAttribute('id', 'cvat_canvas_bitmap');
        this.bitmap.style.display = 'none';

        // Setup sticked div
        this.attachmentBoard.setAttribute('id', 'cvat_canvas_attachment_board');

        // Setup wrappers
        // WORKSPACE
        this.canvas.setAttribute('id', 'cvat_canvas_wrapper');

        // Unite created HTML elements together
        this.loadingAnimation.appendChild(loadingCircle);
        this.grid.appendChild(gridDefs);
        this.grid.appendChild(gridRect);

        gridDefs.appendChild(this.gridPattern);
        this.gridPattern.appendChild(this.gridPath);

        this.canvas.appendChild(this.loadingAnimation);
        this.canvas.appendChild(this.text);
        this.canvas.appendChild(this.background);
        this.canvas.appendChild(this.bitmap);
        this.canvas.appendChild(this.grid);
        this.canvas.appendChild(this.content);
        this.canvas.appendChild(this.attachmentBoard);

        // -------------------------------------------------------------

        // Setup API handlers
        this.drawHandler = new DrawHandlerImpl(this.onDrawDone.bind(this));

        this.content.oncontextmenu = (): boolean => false;
        model.subscribe(this);

        // pannellum
        this.hotspots = [];
    }

    public notify(model: CanvasModel & Master, reason: UpdateReasons): void {
        if (reason === UpdateReasons.CONFIG_UPDATED) {
            //TODO
        } else if (reason === UpdateReasons.BITMAP) {
            //TODO
        } else if (reason === UpdateReasons.IMAGE_CHANGED) {
            const { image } = model;
            if (!image) {
                this.loadingAnimation.classList.remove('cvat_canvas_hidden');
            } else {
                if (this.viewer) {
                    this.removeHotspot();
                    this.hotspots = [];
                    this.viewer = new Viewer(this.canvas360, image);
                } else {
                    this.viewer = new Viewer(this.canvas360, image);
                }
                // this.viewer = new Viewer(this.canvas360, image);
            }
        } else if (reason === UpdateReasons.FITTED_CANVAS) {
            //TODO
        } else if (reason === UpdateReasons.IMAGE_MOVED) {
            //TODO
        } else if ([UpdateReasons.OBJECTS_UPDATED].includes(reason)) {
            if (this.mode === Mode.GROUP) {
                // this.groupHandler.resetSelectedObjects();
            }
            this.setupObjects(this.controller.objects);
            if (this.mode === Mode.MERGE) {
                // this.mergeHandler.repeatSelection();
            }
            const event: CustomEvent = new CustomEvent('canvas.setup');
            this.canvas.dispatchEvent(event);
        } else if (reason === UpdateReasons.ISSUE_REGIONS_UPDATED) {
            //TODO
        } else if (reason === UpdateReasons.GRID_UPDATED) {
            //TODO
        } else if (reason === UpdateReasons.SHAPE_FOCUSED) {
            //TODO
        } else if (reason === UpdateReasons.SHAPE_ACTIVATED) {
            //TODO
        } else if (reason === UpdateReasons.SELECT_REGION) {
            //TODO
        } else if (reason === UpdateReasons.DRAG_CANVAS) {
            //TODO
        } else if (reason === UpdateReasons.ZOOM_CANVAS) {
            //TODO
        } else if (reason === UpdateReasons.DRAW) {
            //TODO
            console.log('CANVAS VIEW ---------> 1');

            const data: DrawData = this.controller.drawData;

            if (data.enabled && this.mode === Mode.IDLE) {
                console.log('CANVAS VIEW ---------> 2');
                this.mode = Mode.DRAW;
                this.viewer.setOnMousedown(this.setCoordinates, true);
                this.drawHandler.draw(data, []);
            } else {
                console.log('CANVAS VIEW ---------> 3');
                this.viewer.setOnMousedown(this.setCoordinates, false);
                this.canvas.style.cursor = '';
                if (this.mode !== Mode.IDLE) {
                    this.drawHandler.draw(data, this.coordinates);
                    this.coordinates = [];
                }
            }
        } else if (reason === UpdateReasons.INTERACT) {
            //TODO
        } else if (reason === UpdateReasons.MERGE) {
            //TODO
        } else if (reason === UpdateReasons.SPLIT) {
            //TODO
        } else if (reason === UpdateReasons.GROUP) {
            //TODO
        } else if (reason === UpdateReasons.SELECT) {
            //TODO
        } else if (reason === UpdateReasons.CANCEL) {
            //TODO
        } else if (reason === UpdateReasons.DATA_FAILED) {
            //TODO
        }

        if (model.imageBitmap && [UpdateReasons.IMAGE_CHANGED, UpdateReasons.OBJECTS_UPDATED].includes(reason)) {
            this.redrawBitmap();
        }
    }

    public html(): HTMLDivElement {
        return this.canvas;
    }

    private redrawBitmap(): void {
        //
    }

    private setupObjects(states: any[]): void {
        console.log('CANVAS VIEW ---------> 10.1');
        const created = [];
        const updated = [];
        for (const state of states) {
            console.log('------------------------@@@@@@@@@@@@@@@@@@@@@@------------------------', state);
            if (!(state.clientID in this.drawnStates)) {
                created.push(state);
            } else {
                const drawnState = this.drawnStates[state.clientID];
                // object has been changed or changed frame for a track
                if (drawnState.updated !== state.updated || drawnState.frame !== state.frame) {
                    updated.push(state);
                }
            }
        }
        if (updated.length || created.length) {
            console.log('CANVAS VIEW ---------> 10.1.1', created);
            this.addObjects(created);
        } else {
            if (this.hotspots) {
                this.removeHotspot();
                this.hotspots = [];
            }
        }
    }

    private addObjects(states: any[]): void {
        console.log('CANVAS VIEW ---------> 10.2');
        //const { displayAllText } = this.configuration;
        var i = 0;
        // createHotspot
        this.removeHotspot();
        // Clean hotspot array
        this.hotspots = [];

        for (const state of states) {
            console.log('CANVAS VIEW ---------> 10.5', state.points);

            const pairs = this.createPairs(state.points);

            for (var i = 0; i < pairs.length; i++) {
                this.createHotspotWithLabels(pairs[i], state);
            }
        }

        console.log('CANVAS VIEW ---------> 11');
        //this.saveState(state);
    }
}
