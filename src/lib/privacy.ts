export const PRIVACY_POLICY_VERSION = "2026-09-26";

export const privacyContact = {
  responsibleName:
    process.env.PRIVACY_RESPONSIBLE_NAME ?? "Hello Agencia Creativa",
  responsibleLocation:
    process.env.PRIVACY_RESPONSIBLE_LOCATION ??
    "Mar del Plata, Provincia de Buenos Aires, Argentina",
  email: process.env.PRIVACY_CONTACT_EMAIL?.trim() ?? "",
};
