import { describe, expect, it } from "vitest";
import { buildInquiryNotification } from "./inquiry-notification";

describe("buildInquiryNotification", () => {
  it("incluye los datos de la consulta y escapa el contenido HTML", () => {
    const notification = buildInquiryNotification({
      id: "inquiry-1",
      name: "Lara <script>",
      email: "lara@example.com",
      whatsapp: "2235550000",
      brandName: "Hello",
      budget: "$800.000",
      message: "Necesito <b>una web</b>",
      source: "CONTACT_FORM",
      serviceName: "Estrategia de contenido",
      createdAt: new Date("2026-09-28T15:00:00.000Z"),
      adminUrl: "https://example.com/admin/consultas",
    });

    expect(notification.subject).toBe("Nueva consulta de Lara <script>");
    expect(notification.text).toContain("lara@example.com");
    expect(notification.text).toContain("Estrategia de contenido");
    expect(notification.html).toContain("Lara &lt;script&gt;");
    expect(notification.html).toContain("Necesito &lt;b&gt;una web&lt;/b&gt;");
    expect(notification.html).not.toContain("Necesito <b>una web</b>");
  });
});
