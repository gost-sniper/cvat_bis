import pannellum from '../panellum/js/pannellum';
import '../panellum/css/pannellum.scss';
import '../panellum/css/viewer.scss';

interface Viewer {
    initPannellum(container: any, img: any): void;
    destroyViewer(isLoaded: any): void;
    addNewHotspot(hotspot: any): void;
    removeCurrentHotspot(hotspot: any): void;
    setOnMousedown(method: any, enable: boolean): void;
}

let myPannellum: any = null;

class ViewerImpl implements Viewer {
    public constructor(container: any, panorama: any) {
        this.initPannellum(container, this.getDataUrl(panorama));
    }

    /**
     * Initialize viewer
     */
    public initPannellum(container: any, img: any): void {
        /**
         * Viewer configuration
         */
        myPannellum = pannellum.viewer(container, {
            /**
             * This specifies the panorama type. Can be equirectangular, cubemap, or multires. Defaults to equirectangular.
             */
            type: 'equirectangular',
            /**
             * Panorama
             */
            panorama: img,
            /**
             * When set to true, the panorama will automatically load. When false, the user needs to click on the load button to load the panorama. Defaults to false.
             */
            autoLoad: true,
            /**
             * Setting this parameter causes the panorama to automatically rotate when loaded. The value specifies the rotation speed in degrees per second. Positive is counter-clockwise, and negative is clockwise.
             */
            autoRotate: 0,
            /**
             * If set to false, no controls are displayed. Defaults to true.
             */
            showControls: false,
            /**
             * When true, the mouse pointer’s pitch and yaw are logged to the console when the mouse button is clicked. Defaults to false.
             */
            hotSpotDebug: false,
            /**
             * This specifies a dictionary of hot spots that can be links to other scenes, information, or external links. Each array element has the following properties.
             */
            hotSpots: [],
        });
    }

    /**
     * Destroy viewer
     * @param isLoaded
     */
    public destroyViewer(isLoaded: any): void {
        myPannellum.off('load', isLoaded);
    }

    /**
     * Add new hotspot
     * @param hotspot
     */
    public addNewHotspot(hotspot: any): void {
        myPannellum.addHotSpot(hotspot);
    }

    /**
     * Remove hotspot
     * @param hotspot
     */
    public removeCurrentHotspot(hotspot: any): void {
        myPannellum.removeHotSpot(hotspot);
    }

    /**
     * Subscribe listener to specified event or Remove an event listener
     * @param method - Listener function to subscribe to event.
     * @param enable - Subscribe or remove listener
     */
    public setOnMousedown(method: any, enable: boolean): void {
        if (enable) {
            myPannellum.on('mousedown', function (event: any) {
                const coordinates = myPannellum.mouseEventToCoords(event);

                method(coordinates);
            });
        } else {
            myPannellum.off('mousedown');
        }
    }

    /**
     * Pass image as base 64
     * @param img
     * @returns
     */
    private getDataUrl(img: any) {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.setAttribute('width', `${img.renderWidth}px`);
        canvas.setAttribute('height', `${img.renderHeight}px`);

        if (ctx) {
            if (img.imageData instanceof ImageData) {
                ctx.scale(img.renderWidth / img.imageData.width, img.renderHeight / img.imageData.height);
                ctx.putImageData(img.imageData, 0, 0);
                // Transformation matrix must not affect the putImageData() method.
                // By this reason need to redraw the image to apply scale.
                // https://www.w3.org/TR/2dcontext/#dom-context-2d-putimagedata
                ctx.drawImage(canvas, 0, 0);
            } else {
                ctx.drawImage(img.imageData, 0, 0);
            }
        }
        return canvas.toDataURL('image/jpeg');
    }
}

export { ViewerImpl as Viewer };
