// ==================== PLATFORM SETTINGS DTOs ====================

export interface UpdatePlatformSettingsDto {
  siteName?: string;
  contactEmail?: string;
  maintenance?: boolean;
}

export interface PlatformSettingsResponseDto {
  id: string;
  siteName: string;
  contactEmail: string | null;
  maintenance: boolean;
  updatedAt: Date;
}

// ==================== DESTINATION COUNTRY DTOs ====================

export interface CreateDestinationCountryDto {
  name: string;
  code?: string;
  isActive?: boolean;
}

export interface BulkCreateDestinationCountriesDto {
  countries: CreateDestinationCountryDto[];
}

export interface UpdateDestinationCountryDto {
  name?: string;
  code?: string;
  isActive?: boolean;
}

export interface DestinationCountryResponseDto {
  id: string;
  name: string;
  code: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface DestinationCountryListQueryDto {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
