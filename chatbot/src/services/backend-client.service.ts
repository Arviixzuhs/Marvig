import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLClient, gql } from 'graphql-request';

@Injectable()
export class BackendClientService {
  private readonly logger = new Logger(BackendClientService.name);
  private readonly graphqlUrl: string;
  private readonly botApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.graphqlUrl = this.configService.get<string>('BACKEND_GRAPHQL_URL') || 'http://localhost:3000/graphql';
    this.botApiKey = this.configService.get<string>('BACKEND_API_KEY') || '';
  }

  private getClient(userToken?: string): GraphQLClient {
    const headers: Record<string, string> = {};

    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    } else if (this.botApiKey) {
      headers['X-Bot-Api-Key'] = this.botApiKey;
    }

    return new GraphQLClient(this.graphqlUrl, { headers });
  }

  async findApartments(filters: any, userToken?: string): Promise<any> {
    const query = gql`
      query FindApartments($filters: ApartmentFilterInput!) {
        findApartments(filters: $filters) {
          content {
            id
            floor
            number
            status
            bedrooms
            bathrooms
            pricePerDay
            squareMeters
          }
        }
      }
    `;

    try {
      const client = this.getClient(userToken);
      const data: any = await client.request(query, { filters });
      return data.findApartments;
    } catch (error: any) {
      this.logger.error(`Error en findApartments: ${error.message}`);
      throw error;
    }
  }

  async getExpensesPerformance(filters: any, userToken?: string): Promise<any> {
    const query = gql`
      query GetExpensesPerformance($filters: ExpenseFilterDto!) {
        getExpensesPerformance(filters: $filters) {
          month
          MAINTENANCE
          UTILITIES
          CLEANING
          TAXES
          SUPPLIES
          OTHER
        }
      }
    `;

    try {
      const client = this.getClient(userToken);
      const data: any = await client.request(query, { filters });
      return data.getExpensesPerformance;
    } catch (error: any) {
      this.logger.error(`Error en getExpensesPerformance: ${error.message}`);
      throw error;
    }
  }

  async createReservation(reservationData: any, userToken?: string): Promise<any> {
    const mutation = gql`
      mutation CreateReservation($data: ReservationDto!) {
        createReservation(data: $data) {
          id
          startDate
          endDate
          totalPrice
          status
        }
      }
    `;

    try {
      const client = this.getClient(userToken);
      const data: any = await client.request(mutation, { data: reservationData });
      return data.createReservation;
    } catch (error: any) {
      this.logger.error(`Error en createReservation: ${error.message}`);
      throw error;
    }
  }
}
