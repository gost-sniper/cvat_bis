interface IHotspot {
    pitch: number;
    yaw: number;
    type: string;
    text: string;
    id: any;
    cssClass?: string;
    clickHandlerFunc(event: any): void;
}


export { IHotspot };