export const MENU_TAGS = [
  "High Protein",
  "Low Sugar",
  "Zero Sugar",
  "Vegetarian",
  "Vegan",
  "Gluten Conscious",
] as const;

export type MenuTag = (typeof MENU_TAGS)[number];
