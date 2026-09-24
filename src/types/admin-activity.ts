export type AdminActivityKind = "created" | "updated" | "visibility";

export type AdminActivity = {
  id: string;
  message: string;
  kind: AdminActivityKind;
  createdAt: string;
};
