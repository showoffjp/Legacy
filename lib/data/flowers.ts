import type { FlowerArrangement } from "@/lib/types";

export const FLOWERS: FlowerArrangement[] = [
  {
    id: "casket-spray-white",
    name: "Peaceful Rest Casket Spray",
    style: "Full casket spray",
    flowers: ["White roses", "Lilies", "Stock", "Eucalyptus"],
    priceUsd: 385,
    description:
      "A flowing blanket of white roses and lilies laid across the casket — purity, peace, and the hope of resurrection.",
  },
  {
    id: "standing-cross",
    name: "Standing Cross of Remembrance",
    style: "Standing easel piece",
    flowers: ["White carnations", "Red roses", "Baby's breath"],
    priceUsd: 265,
    description:
      "A cross of white carnations with a heart of red roses at its center — the enduring symbol of our faith.",
  },
  {
    id: "gates-ajar",
    name: "Gates Ajar",
    style: "Standing tribute",
    flowers: ["Gladioli", "Chrysanthemums", "Roses", "Dove accent"],
    priceUsd: 425,
    description:
      "The traditional 'gates of heaven' standing piece with a white dove, welcoming a soul home.",
  },
  {
    id: "wreath-eternal",
    name: "Eternal Circle Wreath",
    style: "Standing wreath",
    flowers: ["White hydrangea", "Cream roses", "Ivy"],
    priceUsd: 295,
    description:
      "An unbroken circle of hydrangea and roses — love without end, life everlasting.",
  },
  {
    id: "psalm-garden-basket",
    name: "Psalm 23 Garden Basket",
    style: "Floor basket",
    flowers: ["Wildflowers", "Delphinium", "Ferns", "Still-water blues"],
    priceUsd: 165,
    description:
      "Green pastures and still waters gathered into a garden basket — gentle comfort for the family home.",
  },
  {
    id: "lily-plant",
    name: "Peace Lily Planter",
    style: "Living plant",
    flowers: ["Peace lily in ceramic planter"],
    priceUsd: 95,
    description:
      "A living remembrance that continues to grow — often given by friends and church family.",
  },
];

export const flowerById = (id: string) => FLOWERS.find((f) => f.id === id);
