import { IHotspot } from '../panellum/interfaces';

interface Hotspot {
    hotspots: Array<IHotspot>;
}

class HotspotImpl implements Hotspot {

    public hotspots: Array<IHotspot> = [];

    public constructor(hotspots: Array<IHotspot>) {
        this.hotspots = hotspots;
    }

    public getHotspots(): Array<IHotspot> {
        return this.hotspots;
    }

    public setHotspots(hotspots: Array<IHotspot>): void {
        this.hotspots = hotspots;
    }

    public addHotspot(hotspot: IHotspot): void {
        console.log("!!", hotspot);
        this.hotspots.push(hotspot);
    }

    public removeHotspot(id: any): void {
        //iterate array
        // find hotspot with corresponding id
        // remove from array

        // If array is type of objects, then the simplest way is

        // let foo_object // Item to remove
        // this.foo_objects = this.foo_objects.filter(obj => obj !== foo_object);
    }


}


export {
    HotspotImpl as Hotspot,
};