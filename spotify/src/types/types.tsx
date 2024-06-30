export type ISpotifyPlaylist = {
  name: string;
  id: string,
  owner: {
    id: string,
    external_urls: {
      spotify: string;
    };
    display_name: string;
  };
  images: ISpotifyPlaylistImages[];
  tracks: ISpotifyPlaylistTracks;
  description: string;
};

export type ISpotifyPlaylistImages = {
  url: string;
  width: number;
  height: number;
};

export type ISpotifyPlaylistTracks = {
  total: number;
  items: ISpotifyPlaylistTracksItems[];
  next: string;
};

export type ISpotifyPlaylistTracksItems = {
  added_at: string;
  track: {
    id: string;
    name: string;
    album: any;
    artists: any;
    duration_ms: number;
  };

};

export type Categories = {
  id: string,
  icons: { url: string }[],
  name: string
}[];

export type Subcategories = {
  message: string;
  playlists: {
    items: {
      id: string;
      name: string;
      images: { url: string }[];
    }[]
  }
}

export type CurrentPlayerTrack = {
  id: string;
  name: string;
  uri: string;
  artists: { name: string, uri: string }[]
  album: {
    uri: string;
  }
}

export type ISpotifyTopTracks = {
  id: string;
  name: string;
  album: any;
  artists: any;
  duration_ms: number;
  uri: string;
};

export type ISpotifySimilarArtists = {
  id: string;
  name: string;
  images: { url: string }[];
}[]

export type ISpotifyArtist = {
  name: string;
  images: ISpotifyPlaylistImages[];
  owner: {
    external_urls: {
      spotify: string;
    };
    display_name: string;
  };
  id: string;
  uri: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  popularity: number;
  type: string;
};

export type Artist = {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: {
    url: string;
    width: number;
    height: number;
  }[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
};

export type ISpotifyAlbum = {
  artists: ISpotifyArtist[];
  id: string;
  images: ISpotifyPlaylistImages[];
  name: string;
  release_date: string;
  total_tracks: number;
  uri: string;
  tracks: {
    items: {
      id: string;
      name: string;
      uri: string;
      duration_ms: number;
    }[]
  }
}

export type ISpotifyTrack = {
  name: string;
  album: ISpotifyAlbum;
  artists: ISpotifyArtist[];
  id: string;
  uri: string;
  duration_ms: number;
}

export type SpotifyProfile = {
  id: string;
};

export type Context = {
  uri: string,
  metadata: {
    context_description: string
  }
}
export type PlaybackTrackWindow = {
  current_track: ISpotifyTrack;
  previous_tracks: ISpotifyTrack[];
  next_tracks: ISpotifyTrack[];
}

export type PlaybackState = {
  context: Context;
  duration: number;
  paused: boolean;
  position: number;
  loading: boolean;
  timestamp: number;
  repeat_mode: 0 | 1 | 2;
  shuffle: boolean;
  track_window: PlaybackTrackWindow;
  playback_id: string;
  playback_quality: string;
  playback_features: {
    hifi_status: string;
  };
}

export type MinimalSpotifyArtist = {
  id: string;
  name: string;
};

export type MinimalTrack = {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
  artists:
  { name: string }[];
}