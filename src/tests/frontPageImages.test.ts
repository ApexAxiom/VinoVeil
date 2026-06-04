import { describe, expect, it } from "vitest";
import {
  findDuplicateFrontPageImageSources,
  frontPageImageSlots
} from "../config/frontPageImages";

describe("frontPageImages", () => {
  it("keeps front-page image sources unique", () => {
    expect(findDuplicateFrontPageImageSources()).toEqual([]);
    expect(new Set(frontPageImageSlots.map((image) => image.src)).size).toBe(
      frontPageImageSlots.length
    );
  });

  it("uses stable public image paths", () => {
    for (const image of frontPageImageSlots) {
      expect(image.src).toMatch(/^\/[a-z0-9][a-z0-9.-]*\.(png|jpe?g|webp)$/);
      expect(image.alt.trim()).not.toHaveLength(0);
    }
  });
});
