export type FrontPageImage = {
  readonly src: string;
  readonly alt: string;
};

export const frontPageImages = {
  hero: {
    src: "/vinoveil-frontpage-red-wine.png",
    alt: "VinoVeil glass cover protecting a red wine pour in a moody studio setting"
  },
  solution: {
    src: "/vinoveil-mesh-gold-halo.png",
    alt: "Close-up of the VinoVeil mesh and gold halo"
  },
  crafted: {
    src: "/vinoveil-lifestyle-2.png",
    alt: "VinoVeil glass cover with a polished gold top"
  },
  gallery: [
    {
      src: "/vinoveil-frontpage-paris-brunch.png",
      alt: "VinoVeil on a Paris cafe table with the Eiffel Tower in the distance"
    },
    {
      src: "/vinoveil-frontpage-paris-terrace.png",
      alt: "VinoVeil protecting sparkling wine on a Paris terrace"
    },
    {
      src: "/vinoveil-lifestyle-3.png",
      alt: "VinoVeil glass cover over red wine in a warm studio setting"
    }
  ]
} as const;

export const frontPageImageSlots: readonly FrontPageImage[] = [
  frontPageImages.hero,
  frontPageImages.solution,
  frontPageImages.crafted,
  ...frontPageImages.gallery
];

export function findDuplicateFrontPageImageSources(images = frontPageImageSlots) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const image of images) {
    if (seen.has(image.src)) {
      duplicates.add(image.src);
    }
    seen.add(image.src);
  }

  return [...duplicates];
}
