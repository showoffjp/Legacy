import type { Casket } from "@/lib/types";

export const CASKETS: Casket[] = [
  {
    id: "shepherd-pine",
    name: "The Shepherd",
    material: "Solid pine",
    interior: "Natural cotton, ivory",
    finish: "Hand-rubbed matte",
    priceUsd: 1195,
    kind: "casket",
    description:
      "A simple, dignified pine casket in the tradition of a humble farewell. Quietly beautiful, with rope handles and a hand-carved cross on the lid.",
  },
  {
    id: "galilee-poplar",
    name: "The Galilee",
    material: "Poplar hardwood",
    interior: "Crepe, moon ivory",
    finish: "Satin honey",
    priceUsd: 1895,
    kind: "casket",
    description:
      "Warm poplar with softly rounded corners and swing-bar handles. A gentle, welcoming presence for visitation and service.",
  },
  {
    id: "bethany-oak",
    name: "The Bethany",
    material: "Solid oak",
    interior: "Velvet, champagne",
    finish: "Traditional gloss",
    priceUsd: 2650,
    kind: "casket",
    description:
      "Classic oak with raised panels and an engraved 'In God's Care' interior panel. The most chosen casket among our families.",
  },
  {
    id: "cedars-mahogany",
    name: "Cedars of Lebanon",
    material: "Mahogany",
    interior: "Tufted velvet, pearl",
    finish: "Deep hand-polished",
    priceUsd: 4850,
    kind: "casket",
    description:
      "A stately mahogany casket with carved praying-hands corners and a full rounded lid. For a farewell of great honor.",
  },
  {
    id: "jordan-steel",
    name: "The Jordan",
    material: "18-gauge steel",
    interior: "Crepe, silver blue",
    finish: "Brushed silver, sealed",
    priceUsd: 2195,
    kind: "casket",
    description:
      "Protective gasketed steel in brushed silver with the Lord's Prayer embroidered in the cap panel.",
  },
  {
    id: "resurrection-bronze",
    name: "The Resurrection",
    material: "Solid bronze",
    interior: "Velvet, ivory rose",
    finish: "Brushed natural bronze",
    priceUsd: 7900,
    kind: "casket",
    description:
      "Our finest — solid bronze with a sunrise cap panel depicting the empty tomb, built to endure for generations.",
  },
  {
    id: "eventide-urn",
    name: "Eventide Urn",
    material: "Turned walnut",
    interior: "Sealed inner vessel",
    finish: "Oiled walnut with inlaid cross",
    priceUsd: 395,
    kind: "urn",
    description:
      "A warm walnut urn with a mother-of-pearl cross inlay, made for a place of honor in the home or columbarium.",
  },
  {
    id: "stillwaters-urn",
    name: "Still Waters Urn",
    material: "Glazed ceramic",
    interior: "Sealed inner vessel",
    finish: "Deep water-blue glaze",
    priceUsd: 285,
    kind: "urn",
    description:
      "Hand-thrown ceramic in flowing blues, inspired by Psalm 23 — 'He leadeth me beside the still waters.'",
  },
  {
    id: "garden-keepsake-urn",
    name: "Garden Keepsake Set",
    material: "Cast bronze",
    interior: "Four keepsake vessels",
    finish: "Antique bronze, dove motif",
    priceUsd: 540,
    kind: "urn",
    description:
      "A sharing set of four small keepsake urns with dove engraving, so each child may keep a remembrance near.",
  },
];

export const casketById = (id: string) => CASKETS.find((c) => c.id === id);
