export interface LyricsHubCategory {
  id: string;
  name: string;
  emoji: string;
  group: "장르별 대분류" | "테마별 대분류";
  description: string;
  subTopicCount?: number;
  ideaCount?: number;
  featured?: boolean;
}

export interface LyricsHubSubTopic {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  ideaCount?: number;
  keywords: string[];
}

export interface LyricsHubTemplate {
  id: string;
  title: string;
  categoryId: string;
  subTopicId: string;
  mood: string;
  vocal: string;
  instrument: string;
  tempo: string;
  keywords: string[];
  description: string;
  lyricsBackground: string;
  placeSetting: string;
  featured?: boolean;
}
