import { v4 as uuid } from 'uuid';

import { Tuinstraat, TuinstraatId } from '../../../../frontend/src/models/Tuinstraat';
import { Marker, MarkerId } from '../../../../frontend/src/models/Marker';
import { CutlerRepository } from '.';

export class InMemoryCutlerRepository implements CutlerRepository {
    private tuinstraten: Array<Tuinstraat>;
    private markers: Array<Marker>;

    constructor() {
        this.tuinstraten = [
            {
                id: uuid(),
                name: 'Lange ridderstraat',
                status: 'proposed',
                type: 'Type 1',
                eligibleType1: null,
                eligibleType2: null,
                eligibleType3: null,
                benefitsType1: 100000,
                benefitsType2: 100000,
                benefitsType3: 100000,
                costsType1: 20000,
                costsType2: 20000,
                costsType3: 20000,
                profitsType1: 80000,
                profitsType2: 80000,
                profitsType3: 80000,
                evaluation: null,
                remarks: null,
                area: 0,
                geometry: { type: 'Polygon', coordinates: [] },
            },
        ];
        this.markers = [
            {
                id: uuid(),
                geometry: { type: 'Point', coordinates: [] },
            },
        ];
    }

    /**
     * Garden Street methods
     */

    createGardenStreet(tuinstraat: Tuinstraat): Promise<Tuinstraat> {
        const id = uuid();
        const gardenStreet = { ...tuinstraat, id };
        this.tuinstraten.push(gardenStreet);
        return Promise.resolve(gardenStreet);
    }

    getAllGardenStreets(): Promise<Array<Tuinstraat>> {
        return Promise.resolve(this.tuinstraten);
    }

    updateGardenStreet(id: TuinstraatId, tuinstraat: Tuinstraat): Promise<Tuinstraat | null> {
        const index = this.tuinstraten.findIndex((el) => el.id === id);
        if (index === -1) {
            return Promise.resolve(null);
        }
        this.tuinstraten.splice(index, 1, tuinstraat);
        return Promise.resolve(tuinstraat);
    }

    deleteGardenStreet(id: TuinstraatId): Promise<void> {
        this.tuinstraten = this.tuinstraten.filter((el) => el.id !== id);
        return Promise.resolve();
    }

    existsGardenStreet(id: TuinstraatId): Promise<boolean> {
        const index = this.tuinstraten.findIndex((el) => el.id === id);
        return Promise.resolve(index !== -1);
    }

    /**
     * Markers method
     */

    createMarker(marker: Marker): Promise<Marker> {
        const id = uuid();
        const newMarker = { ...marker, id };
        this.markers.push(newMarker);
        return Promise.resolve(marker);
    }

    getAllMarkers(): Promise<Array<Marker>> {
        return Promise.resolve(this.markers);
    }

    updateMarker(id: MarkerId, marker: Marker): Promise<Marker | null> {
        const index = this.markers.findIndex((el) => el.id === id);
        if (index === -1) {
            return Promise.resolve(null);
        }
        this.markers.splice(index, 1, marker);
        return Promise.resolve(marker);
    }

    deleteMarker(id: TuinstraatId): Promise<void> {
        this.markers = this.markers.filter((el) => el.id !== id);
        return Promise.resolve();
    }

    existsMarker(id: TuinstraatId): Promise<boolean> {
        const index = this.markers.findIndex((el) => el.id === id);
        return Promise.resolve(index !== -1);
    }
}
