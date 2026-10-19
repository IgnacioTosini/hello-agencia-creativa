import { afterEach, describe, expect, it, vi } from "vitest";
import { prepareImageUpload } from "./prepare-image-upload";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("prepareImageUpload", () => {
  it("conserva exactamente el archivo cuando entra en el límite de envío", async () => {
    const original = new File([new Uint8Array(500_000)], "foto.jpg", {
      type: "image/jpeg",
    });

    expect(await prepareImageUpload(original)).toBe(original);
  });

  it("conserva hasta 3840 px y prioriza calidad alta en archivos grandes", async () => {
    const revoke = vi.spyOn(URL, "revokeObjectURL");
    vi.stubGlobal(
      "Image",
      class {
        naturalWidth = 6000;
        naturalHeight = 4000;
        decode = async () => {};
      },
    );
    const canvas = {
      width: 0,
      height: 0,
      getContext: () => ({ drawImage: vi.fn() }),
      toBlob: vi.fn((callback: BlobCallback) => {
        callback(new Blob([new Uint8Array(3_000_000)], { type: "image/webp" }));
      }),
    };
    vi.stubGlobal("document", { createElement: () => canvas });
    const file = new File([new Uint8Array(5_000_000)], "foto.jpg", {
      type: "image/jpeg",
    });

    const result = await prepareImageUpload(file);

    expect(canvas.width).toBe(3840);
    expect(canvas.height).toBe(2560);
    expect(canvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      "image/webp",
      0.94,
    );
    expect(result.size).toBeLessThanOrEqual(4_000_000);
    expect(result.name).toBe("foto.webp");
    expect(revoke).toHaveBeenCalledOnce();
  });

  it("rechaza archivos por encima del límite aceptado por el administrador", async () => {
    const file = new File([new Uint8Array(11_000_000)], "foto.jpg", {
      type: "image/jpeg",
    });

    await expect(prepareImageUpload(file)).rejects.toThrow("10 MB");
  });
});
