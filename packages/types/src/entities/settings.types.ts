export interface PlatformSettings {
  id: string;
  siteName: string;
  contactEmail: string | null;
  maintenance: boolean;
  updatedAt: Date;
}

export interface DestinationCountry {
  id: string;
  name: string;
  code: string | null;
  isActive: boolean;
  createdAt: Date;
}
