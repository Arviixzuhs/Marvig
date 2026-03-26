import { IPaginationFilter } from '@/api/interfaces'

export interface EmployeeModel {
    id: number;
    name: string;
    lastName: string;
    phone: string;
    email: string;
    address?: string | null;
    isDeleted?: boolean | null;
    deletedAt?: Date | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export interface IEmployeeFilter extends IPaginationFilter {
    search?: string;
    name?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    fromDate?: string;
    toDate?: string;
}
