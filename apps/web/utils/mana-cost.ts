// Symbol lookup map for special cases
const SYMBOL_LOOKUP: Record<string, string> = {
  // Basic mana symbols
  w: "w",
  u: "u",
  b: "b",
  r: "r",
  g: "g",
  c: "c",
  s: "s", // Snow mana
  x: "x",
  y: "y",
  z: "z",
  // Numbers
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "10": "10",
  "11": "11",
  "12": "12",
  "13": "13",
  "14": "14",
  "15": "15",
  "16": "16",
  "17": "17",
  "18": "18",
  "19": "19",
  "20": "20",
  "100": "100",
  "1000000": "1000000",
  // Special symbols
  t: "tap",
  q: "untap",
  e: "e",
  p: "paw",
  l: "l",
  h: "h",
  "1/2": "1-2",
  infinity: "infinity",
  // Card symbols
  chaos: "chaos",
  flashback: "flashback",
  power: "power",
  toughness: "toughness",
  saga: "saga",
  acorn: "acorn",
  ticket: "ticket",
  rarity: "rarity",
  multicolor: "multicolor",
  spree: "spree",
};

export const parseManaCost = (
  manaCost: string | null | undefined
): string[] => {
  if (!manaCost) return [];

  // Remove curly braces and split by spaces
  return manaCost
    .replace(/[{}]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((symbol) => symbol.toLowerCase());
};

export const replaceManaCosts = (text: string | null | undefined): string => {
  if (!text) return "";

  // First replace newlines with br tags
  const withBrTags = text.replace(/\n/g, "<br>");

  // Then replace mana costs with mana symbols
  return withBrTags.replace(/{([^}]+)}/g, (match, symbol) => {
    const lowerSymbol = symbol.toLowerCase();
    const mappedSymbol = SYMBOL_LOOKUP[lowerSymbol] || lowerSymbol;
    return `<i class="ms ms-cost ms-${mappedSymbol}"></i>`;
  });
};
