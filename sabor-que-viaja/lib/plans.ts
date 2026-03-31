export type EggSize = "small" | "large";

export const EGG_SIZE_LABELS: Record<EggSize, string> = {
  small: "Huevo pequeño",
  large: "Huevo grande",
};

export const EGGS_PER_CARTON = 30;

export interface EggPrice {
  id: number;
  egg_size: EggSize;
  price_per_carton: number;
  sub_price_per_carton: number;
}
