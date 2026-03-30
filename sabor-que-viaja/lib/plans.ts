// Tipos compartidos entre servidor y cliente
// Los precios viven en la DB (tablas: plans, egg_prices)

export type EggSize = "small" | "large";
export type PlanType = "30" | "60";

export const EGG_SIZE_LABELS: Record<EggSize, string> = {
  small: "Huevo pequeño",
  large: "Huevo grande",
};

export const EGGS_PER_CARTON = 30;

// Shapes que devuelve la DB / API
export interface Plan {
  id: number;
  uuid: string;
  name: string;
  eggs_per_week: number;
  egg_size: EggSize;
  price_monthly: number;
  active: boolean;
}

export interface EggPrice {
  id: number;
  egg_size: EggSize;
  price_per_egg: number;
  price_per_carton: number;
}

// Helpers de presentación (sin tocar la DB)
export function perEggLabel(price_monthly: number, eggs_per_week: number): string {
  return `Q${(price_monthly / (eggs_per_week * 4)).toFixed(2)} c/u`;
}

export function getOneTimeOptions(ep: EggPrice) {
  return [
    {
      quantity: EGGS_PER_CARTON,
      label: "1 cartón",
      sublabel: `${EGGS_PER_CARTON} huevos`,
      price: ep.price_per_carton,
      unit_label: `Q${ep.price_per_egg.toFixed(2)} c/u`,
    },
    {
      quantity: EGGS_PER_CARTON * 2,
      label: "2 cartones",
      sublabel: `${EGGS_PER_CARTON * 2} huevos`,
      price: +(ep.price_per_carton * 2).toFixed(2),
      unit_label: `Q${ep.price_per_egg.toFixed(2)} c/u`,
    },
  ];
}
