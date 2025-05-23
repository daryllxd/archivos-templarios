export interface MagicLanguage {
  label: string;
  value: string;
}

export interface MagicSet {
  label: string;
  value: string;
}

export const MAGIC_LANGUAGES: MagicLanguage[] = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "Japanese", value: "ja" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Italian", value: "it" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Korean", value: "ko" },
  { label: "Chinese Simplified", value: "zhs" },
  { label: "Chinese Traditional", value: "zht" },
];

export const MAGIC_SETS: MagicSet[] = [
  { label: "Modern Horizons 3", value: "mh3" },
  { label: "Murders at Karlov Manor", value: "mkm" },
  { label: "The Lost Caverns of Ixalan", value: "lci" },
  { label: "Wilds of Eldraine", value: "woe" },
  { label: "March of the Machine", value: "mom" },
  { label: "Phyrexia: All Will Be One", value: "one" },
  { label: "The Brothers' War", value: "bro" },
  { label: "Dominaria United", value: "dmu" },
];
