export type Service = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  problemSolved?: string | null;
  whatIncludes?: string | null;
  recommendedFor?: string | null;
  icon?: string | null;
  active: boolean;
  displayOrder: number;
};

export type ServiceViewModel = Omit<Service, "whatIncludes"> & {
  whatIncludes: string[];
};
