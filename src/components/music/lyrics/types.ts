export type Option = {
  label: string;
  value: string;
  icon?: string;
};

export type MusicFormState = {
  genre: string;
  mood: string;
  vocal: string;
  tempo: string;
  instrument: string;
  theme: string;
  language: string;
  structure: string;
  generationCount: number;
};

export type SongItem = {
  title: string;
  conceptDescription: string;
  lyrics: string;
  sunoPrompt: string;
  youtubeTitles: string[];
  youtubeDescription: string;
  hashtags: string[];
  visualDescription: string;
  videoDescription: string;
};

export type MusicResultState = {
  title: string;
  conceptDescription: string;
  lyrics: string;
  sunoPrompt: string;
  youtubeTitles: string[];
  youtubeDescription: string;
  hashtags: string[];
  visualDescription: string;
  videoDescription: string;
  savedId: string;
  batchId?: string;
  songs: SongItem[];
};