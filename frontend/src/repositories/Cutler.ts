import * as firebase from 'firebase';

import { Marker, MarkerId } from '../models/Marker';
import {
  FormGardenStreet,
  Tuinstraat,
  TuinstraatId,
} from '../models/Tuinstraat';

class CutlerRepository {
  static user: firebase.User | null = null;

  static setUser(user: firebase.User | null) {
    this.user = user;
  }

  static async getCommonHeaders() {
    const idToken = await this.user?.getIdToken();
    return {
      Authorization: `Bearer ${idToken}`,
    };
  }

  /**
   * Garden Streets Methods
   * @param gardenStreet
   */

  static async createGardenStreet(
    gardenStreet: FormGardenStreet,
  ): Promise<void> {
    const res = await fetch('/api/gardenstreets', {
      method: 'POST',
      body: JSON.stringify(gardenStreet),
      headers: {
        ...(await this.getCommonHeaders()),
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('An error occured while creating garden street');
    }
  }

  static async getAllGardenStreets(): Promise<Tuinstraat[]> {
    const res = await fetch('/api/gardenstreets', {
      method: 'GET',
      headers: await this.getCommonHeaders(),
    });

    if (!res.ok) {
      throw new Error('An error occured while fetching garden streets');
    }

    const gardenStreets = await res.json();
    return gardenStreets;
  }

  static async updateGardenStreet(
    id: TuinstraatId,
    gardenStreet: FormGardenStreet,
  ): Promise<void> {
    const res = await fetch(`/api/gardenstreets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gardenStreet),
      headers: {
        ...(await this.getCommonHeaders()),
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('An error occured while updating garden street');
    }
  }

  static async deleteGardenStreet(id: TuinstraatId): Promise<void> {
    const res = await fetch(`/api/gardenstreets/${id}`, {
      method: 'DELETE',
      headers: await this.getCommonHeaders(),
    });
    if (!res.ok) {
      throw new Error('An error occured while deleting garden street');
    }
  }

  /**
   * Markers Methods
   * @param marker
   */

  static async createMarker(marker: Marker): Promise<void> {
    const res = await fetch('/api/markers', {
      method: 'POST',
      body: JSON.stringify(marker),
      headers: {
        ...(await this.getCommonHeaders()),
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('An error occured while creating marker');
    }
  }

  static async getAllMarkers(): Promise<Marker[]> {
    const res = await fetch('/api/markers', {
      method: 'GET',
      headers: await this.getCommonHeaders(),
    });

    if (!res.ok) {
      throw new Error('An error occured while fetching markers');
    }

    const markers = await res.json();
    return markers;
  }

  static async updateMarker(id: MarkerId, marker: Marker): Promise<void> {
    const res = await fetch(`/api/markers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(marker),
      headers: {
        ...(await this.getCommonHeaders()),
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('An error occured while updating marker');
    }
  }

  static async deleteMarker(id: MarkerId): Promise<void> {
    const res = await fetch(`/api/markers/${id}`, {
      method: 'DELETE',
      headers: await this.getCommonHeaders(),
    });
    if (!res.ok) {
      throw new Error('An error occured while deleting marker');
    }
  }
}

export default CutlerRepository;
