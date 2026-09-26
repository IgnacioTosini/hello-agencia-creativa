export type AdminActivityKind =
  "created" | "updated" | "visibility" | "deleted";

export type AdminActivity = {
  id: string;
  message: string;
  kind: AdminActivityKind;
  createdAt: string;
};
