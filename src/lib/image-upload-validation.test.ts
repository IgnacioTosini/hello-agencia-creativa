import { describe, expect, it } from "vitest";
import { MAX_IMAGE_BYTES, validateImageFile } from "./image-upload-validation";

describe("validateImageFile", () => {
  it("accepts supported images within the size limit", () => {
    expect(validateImageFile({ type: "image/webp", size: 1024 })).toBeNull();
  });

  it("rejects unsupported, empty and oversized files", () => {
    expect(validateImageFile({ type: "image/svg+xml", size: 1024 })).toMatch(
      /JPG, PNG o WebP/,
    );
    expect(validateImageFile({ type: "image/png", size: 0 })).toMatch(/vacía/);
    expect(
      validateImageFile({ type: "image/jpeg", size: MAX_IMAGE_BYTES + 1 }),
    ).toMatch(/10 MB/);
  });
});
