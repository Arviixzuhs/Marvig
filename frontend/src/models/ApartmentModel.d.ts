import { IPaginationFilter } from "@/api/interfaces";

export interface ApartmentModel {
    id: number;
    floor: number;
    number: string;
    status: ApartmentStatus;
    bedrooms: number;
    bathrooms: number;
    squareMeters?: number | null;
    images?: IApartmentImage[] | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export enum ApartmentStatus {
    OCCUPIED = 'OCCUPIED',
    RESERVED = 'RESERVED',
    AVAILABLE = 'AVAILABLE',
    MAINTENANCE = 'MAINTENANCE'
}

export interface IApartmentImage {
    id: number;
    url: string;
    isPrimary: boolean;
    apartmentId: number;
}


export interface IApartmentFilter extends IPaginationFilter {
    search?: string;
    number?: string;
    floor?: number;
    status?: ApartmentStatus;
    bedrooms?: number;
    bathrooms?: number;
    minSquareMeters?: number;
    maxSquareMeters?: number;
}
