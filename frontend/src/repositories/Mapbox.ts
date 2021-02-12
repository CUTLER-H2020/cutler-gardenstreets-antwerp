import { Style } from 'mapbox-gl';

import { getEnv } from '../env';

const CUTLER_MAP_STYLE_ID = getEnv('REACT_APP_CUTLER_MAP_STYLE_ID');
const MAPBOX_ACCESS_TOKEN = getEnv('REACT_APP_MAPBOX_ACCESS_TOKEN');

class Mapbox {
  public static accessToken: string = MAPBOX_ACCESS_TOKEN || '';
  public static styleId: string = CUTLER_MAP_STYLE_ID || '';

  public static async fetchStyle() {
    const url = `https://api.mapbox.com/styles/v1/imec-apt/${this.styleId}?access_token=${this.accessToken}`;
    const response = await fetch(url);

    if (response.ok) {
      // if HTTP-status is 200-299
      // get the response body (the method explained below)
      const json = await response.json();
      return json as Style;
    } else {
      return undefined;
    }
  }

  public static get spriteUrls() {
    return {
      json: `https://api.mapbox.com/styles/v1/imec-apt/${this.styleId}/sprite.json?access_token=${this.accessToken}`,
      png: `https://api.mapbox.com/styles/v1/imec-apt/${this.styleId}/sprite.png?access_token=${this.accessToken}`,
    };
  }
}

export default Mapbox;
