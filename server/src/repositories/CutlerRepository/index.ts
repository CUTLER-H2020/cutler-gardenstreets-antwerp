import { Tuinstraat, TuinstraatId } from '../../../../frontend/src/models/Tuinstraat';
import { Marker, MarkerId } from '../../../../frontend/src/models/Marker';

export interface CutlerRepository {
    /**
     * Garden Street Cruds methods
     * @param tuinstraat
     */

    createGardenStreet(tuinstraat: Tuinstraat): Promise<Tuinstraat>;

    getAllGardenStreets(): Promise<Array<Tuinstraat>>;

    updateGardenStreet(id: TuinstraatId, tuinstraat: Tuinstraat): Promise<Tuinstraat | null>;

    deleteGardenStreet(id: TuinstraatId): Promise<void>;

    // Convenience methods
    existsGardenStreet(id: TuinstraatId): Promise<boolean>;

    /**
     * Marker Cruds methods
     * @param marker
     */

    createMarker(marker: Marker): Promise<Marker>;

    getAllMarkers(): Promise<Array<Marker>>;

    updateMarker(id: MarkerId, marker: Marker): Promise<Marker | null>;

    deleteMarker(id: MarkerId): Promise<void>;

    // Convenience methods
    existsMarker(id: MarkerId): Promise<boolean>;
}
