export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  title: string;
  description: string;
  url: string;
  color: number; // Embed의 색상 (16진수 색상 코드)
  timestamp: string;
  fields: DiscordEmbedField[];
}
