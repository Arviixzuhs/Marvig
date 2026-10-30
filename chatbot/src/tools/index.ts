import { userService } from '@/services/user'
import { PromotionType } from '@/models/PromotionModel'
import { expenseService } from '@/services/exepense'
import { paymentService } from '@/services/payment'
import { getFileContent } from '@/utils/getFileContent'
import { ExpenseCategory } from '@/models/ExpenseModel'
import { ApartmentStatus } from '@/models/ApartmentModel'
import { employeeService } from '@/services/employee'
import { apartmentService } from '@/services/apartment'
import { defineTool, Type } from '@/utils/defineTool'
import { promotionService } from '@/services/promotion'
import { reservationService } from '@/services/reservation'
import type { ChatCompletionTool } from 'openai/resources/chat/completions'
import { PaymentMethod, PaymentStatus } from '@/models/PaymentModel'
import { RentalType, ReservationStatus } from '@/models/ReservationModel'

const todayTool = defineTool({
  schema: {
    name: 'get_today',
    description: 'Returns today date',
  },
  execute() {
    return new Date()
  },
})

const servicesTool = defineTool({
  schema: {
    name: 'get_services',
    description:
      'Returns the general services offered by Posada Marvig (water supply, Wi-Fi, parking, barbecue area, location). Use it for questions about the posada amenities in general. Does not include unit-specific amenities, prices or availability.',
  },
  async execute() {
    return getFileContent('skills/prompts/marvig', 'SERVICES.SKILL.md')
  },
})

const faqTool = defineTool({
  schema: {
    name: 'get_faq',
    description:
      'Returns the official policies and frequently asked questions of Posada Marvig: check-in/check-out times, cancellation policy, accepted payment methods, water and electricity backup, and pets. Use it for general questions about how a stay works or the posada rules.',
  },
  async execute() {
    return getFileContent('skills/prompts/marvig', 'FAQ.SKILL.md')
  },
})

const contactTool = defineTool({
  schema: {
    name: 'get_contact_info',
    description:
      'Returns the official contact channels of Posada Marvig (phone/WhatsApp, email, Instagram), its business hours and street address. Use it when the user asks how to contact the posada, its phone number, email, social media, business hours or where it is located.',
  },
  async execute() {
    return getFileContent('skills/prompts/marvig', 'CONTACT.SKILL.md')
  },
})

const userContextTool = defineTool({
  schema: {
    name: 'get_user_context',
    description:
      'Returns the current authenticated user profile, full name, system role, email, phone and createdAt.',
  },
  execute() {
    userService.findCurrent()
  },
})

const paymentFilterProperties = {
  search: {
    type: Type.STRING,
    description: 'A generic search text to match against payment references or descriptions.',
  },
  status: {
    type: Type.ARRAY,
    items: {
      type: Type.STRING,
      enum: [
        PaymentStatus.PENDING,
        PaymentStatus.CONFIRMED,
        PaymentStatus.FAILED,
        PaymentStatus.CANCELLED,
      ],
    },
    description:
      'Filter payments by one or multiple transaction statuses. Pass an array of values.',
  },
  method: {
    type: Type.ARRAY,
    items: {
      type: Type.STRING,
      enum: [
        PaymentMethod.CASH,
        PaymentMethod.PAYPAL,
        PaymentMethod.STRIPE,
        PaymentMethod.PAGO_MOVIL,
        PaymentMethod.DEBIT_CARD,
        PaymentMethod.CREDID_CARD,
        PaymentMethod.BANK_TRANSFER,
      ],
    },
    description: 'Filter payments by one or multiple payment methods. Pass an array of values.',
  },
  reservationId: {
    type: Type.INTEGER,
    description: 'Filter payments linked to a specific reservation ID.',
  },
  fromDate: {
    type: Type.STRING,
    description: 'Start date for filtering payments (ISO format, e.g., YYYY-MM-DD).',
  },
  toDate: {
    type: Type.STRING,
    description: 'End date for filtering payments (ISO format, e.g., YYYY-MM-DD).',
  },
  page: {
    type: Type.INTEGER,
    description: 'The page number to retrieve for pagination (only applicable for listing).',
  },
  pageSize: {
    type: Type.INTEGER,
    description: 'Number of items to return per page (only applicable for listing).',
  },
}

const listPaymentsTool = defineTool({
  schema: {
    name: 'list_payments',
    description: `
      Returns a paginated and filtered list of customer payments/transactions.
      Use this tool when the user asks to see history of payments, check if a specific 
      reservation was paid, search for references, or look up individual transaction records.
    `,
    parameters: {
      type: Type.OBJECT,
      properties: paymentFilterProperties,
    },
  },
  async execute(args) {
    return await paymentService.getAll(args)
  },
})

const getPaymentsPerformanceTool = defineTool({
  schema: {
    name: 'get_payments_performance',
    description: `
      Returns financial performance metrics, sales stats, chart data, trends, and profit overview.
      Use this tool ONLY when the user asks for analytical data, sales reports, weekly/daily 
      earnings performance, chart values, or financial statistics of the posada.
    `,
    parameters: {
      type: Type.OBJECT,
      properties: paymentFilterProperties,
    },
  },
  async execute(args) {
    return await paymentService.getPerformance(args)
  },
})

const listPromotionsTool = defineTool({
  schema: {
    name: 'list_promotions',
    description: `
      Returns a paginated and filtered list of active or past promotions, discounts, and offers 
      available in the vacation posada. Use this tool whenever the user asks for active deals, 
      discount codes, special pricing strategies, or wants to filter promotions by name or date range.
    `,
    parameters: {
      type: Type.OBJECT,
      properties: {
        search: {
          type: Type.STRING,
          description: 'A generic search text to match against promotion names or descriptions.',
        },
        type: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            enum: [PromotionType.FIXED, PromotionType.PERCENTAGE],
          },
          description:
            'Filter promotions by one or multiple types (e.g., FIXED, PERCENTAGE). Pass an array of values.',
        },
        name: {
          type: Type.STRING,
          description: 'Filter specifically by the promotion name.',
        },
        fromDate: {
          type: Type.STRING,
          description: 'Start date for filtering promotions (ISO format, e.g., YYYY-MM-DD).',
        },
        toDate: {
          type: Type.STRING,
          description: 'End date for filtering promotions (ISO format, e.g., YYYY-MM-DD).',
        },
        page: {
          type: Type.INTEGER,
          description: 'The page number to retrieve for pagination.',
        },
        pageSize: {
          type: Type.INTEGER,
          description: 'Number of items to return per page.',
        },
      },
    },
  },
  async execute(args) {
    return await promotionService.getAll(args)
  },
})

const listApartmentsTool = defineTool({
  schema: {
    name: 'list_apartments',
    description: `
      Returns a paginated and filtered list of apartments/rooms available in the vacation posada.
      Use this tool whenever the user asks to see available rooms, room prices, features (bathrooms/bedrooms), 
      or wants to filter by a specific status, room size, price range, or check availability for specific dates.

      IMPORTANT FOR DATE AVAILABILITY SEARCHES:
      When checking availability for specific dates (fromDate and toDate are provided):
      - Do NOT pass status: ["AVAILABLE"] alone, because apartments currently 'OCCUPIED' or 'RESERVED' might be free during the requested date range.
      - Pass status: ["AVAILABLE", "RESERVED", "OCCUPIED"] or omit status so the backend checks schedule overlap, but NEVER include "MAINTENANCE" as those are never rent-able.
    `,
    parameters: {
      type: Type.OBJECT,
      properties: {
        search: {
          type: Type.STRING,
          description: 'A generic search text to match against apartment details.',
        },
        number: {
          type: Type.STRING,
          description: 'The specific room or apartment number.',
        },
        floor: {
          type: Type.INTEGER,
          description: 'The specific floor level where the room is located.',
        },
        status: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            enum: [
              ApartmentStatus.AVAILABLE,
              ApartmentStatus.RESERVED,
              ApartmentStatus.OCCUPIED,
              ApartmentStatus.MAINTENANCE,
            ],
          },
          description:
            'Filter by one or multiple current statuses of the apartment. NOTE: When searching by date range (fromDate/toDate), exclude MAINTENANCE as those cannot be rented. Pass an array of values.',
        },
        bedrooms: {
          type: Type.INTEGER,
          description: 'Number of bedrooms required.',
        },
        bathrooms: {
          type: Type.INTEGER,
          description: 'Number of bathrooms required.',
        },
        minPrice: {
          type: Type.NUMBER,
          description: 'Minimum price per day filter.',
        },
        maxPrice: {
          type: Type.NUMBER,
          description: 'Maximum price per day filter.',
        },
        fromDate: {
          type: Type.STRING,
          description:
            'The check-in/start date for availability checks. Must be converted into ISO string format (YYYY-MM-DD). When provided with toDate, the service checks booking overlaps across all non-maintenance apartments.',
        },
        toDate: {
          type: Type.STRING,
          description:
            'The check-out/end date for availability checks. Must be converted into ISO string format (YYYY-MM-DD).',
        },
        minSquareMeters: {
          type: Type.INTEGER,
          description: 'Minimum size in square meters.',
        },
        maxSquareMeters: {
          type: Type.INTEGER,
          description: 'Maximum size in square meters.',
        },
        page: {
          type: Type.INTEGER,
          description: 'The page number to retrieve for pagination.',
        },
        pageSize: {
          type: Type.INTEGER,
          description: 'Number of items to return per page.',
        },
      },
    },
  },
  async execute(args) {
    return await apartmentService.getAll(args)
  },
})

const listReservationsTool = defineTool({
  schema: {
    name: 'list_reservations',
    description: `
      Returns a paginated and filtered list of booking reservations in the vacation posada.
      Use this tool whenever the user wants to see current, past, pending, or cancelled bookings,
      search for a client's reservation by name/email/phone, or filter by specific dates, 
      rental types (daily/seasonal), prices, and apartment IDs.
    `,
    parameters: {
      type: Type.OBJECT,
      properties: {
        search: {
          type: Type.STRING,
          description: "A generic search text to match against client's name, email, or phone.",
        },
        status: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            enum: [
              ReservationStatus.FAILED,
              ReservationStatus.PENDING,
              ReservationStatus.CONFIRMED,
              ReservationStatus.CANCELLED,
              ReservationStatus.COMPLETED,
            ],
          },
          description:
            'Filter reservations by one or multiple operational statuses. Pass an array of values.',
        },
        type: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            enum: [RentalType.DAILY, RentalType.FIXED_SEASON],
          },
          description:
            'Filter by one or multiple rental types: DAILY or FIXED_SEASON. Pass an array of values.',
        },
        userId: {
          type: Type.INTEGER,
          description: 'Filter reservations created by a specific system user ID.',
        },
        apartmentId: {
          type: Type.INTEGER,
          description: 'Filter reservations containing a specific apartment ID.',
        },
        startDate: {
          type: Type.STRING,
          description:
            'Filter reservations starting from this date (ISO format, e.g., YYYY-MM-DD).',
        },
        endDate: {
          type: Type.STRING,
          description: 'Filter reservations ending up to this date (ISO format, e.g., YYYY-MM-DD).',
        },
        minPrice: {
          type: Type.NUMBER,
          description: 'Minimum reservation total price filter.',
        },
        maxPrice: {
          type: Type.NUMBER,
          description: 'Maximum reservation total price filter.',
        },
        page: {
          type: Type.INTEGER,
          description: 'The page number to retrieve for pagination.',
        },
        pageSize: {
          type: Type.INTEGER,
          description: 'Number of items to return per page.',
        },
      },
    },
  },
  async execute(args) {
    return await reservationService.getAll(args)
  },
})

const listEmployeesTool = defineTool({
  schema: {
    name: 'list_employees',
    description: `
      Returns a paginated and filtered list of employees/staff members working at the vacation posada.
      Use this tool whenever the user asks about staff information, contact details of employees,
      wants to find a specific worker by name, email, or phone, or needs an overview of the active workforce.
    `,
    parameters: {
      type: Type.OBJECT,
      properties: {
        search: {
          type: Type.STRING,
          description:
            'A generic search text to match against any employee properties (name, lastname, email, phone).',
        },
        name: {
          type: Type.STRING,
          description: 'Filter specifically by the employee first name.',
        },
        lastName: {
          type: Type.STRING,
          description: 'Filter specifically by the employee last name.',
        },
        phone: {
          type: Type.STRING,
          description: 'Filter by a specific phone number.',
        },
        email: {
          type: Type.STRING,
          description: 'Filter by a specific email address.',
        },
        fromDate: {
          type: Type.STRING,
          description:
            'Filter employees registered/hired starting from this date (ISO format, e.g., YYYY-MM-DD).',
        },
        toDate: {
          type: Type.STRING,
          description:
            'Filter employees registered/hired up to this date (ISO format, e.g., YYYY-MM-DD).',
        },
        page: {
          type: Type.INTEGER,
          description: 'The page number to retrieve for pagination.',
        },
        pageSize: {
          type: Type.INTEGER,
          description: 'Number of items to return per page.',
        },
      },
    },
  },
  async execute(args) {
    return await employeeService.getAll(args)
  },
})

const listExpensesTool = defineTool({
  schema: {
    name: 'list_expenses',
    description: `
      Returns a paginated and filtered list of expenses recorded in the vacation posada system.
      Use this tool whenever the user asks about financial costs, spending, bills, maintenance costs,
      purchase, or needs to audit expenses by category, date range, specific apartment, or employee.
    `,
    parameters: {
      type: Type.OBJECT,
      properties: {
        search: {
          type: Type.STRING,
          description: 'A generic search text to match against expense descriptions.',
        },
        apartmentId: {
          type: Type.INTEGER,
          description: 'Filter expenses associated with a specific apartment ID.',
        },
        employeeId: {
          type: Type.INTEGER,
          description:
            'Filter expenses associated with a specific employee ID (who made or authorized the expense).',
        },
        category: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            enum: [
              ExpenseCategory.MAINTENANCE,
              ExpenseCategory.UTILITIES,
              ExpenseCategory.CLEANING,
              ExpenseCategory.TAXES,
              ExpenseCategory.SUPPLIES,
              ExpenseCategory.OTHER,
            ],
          },
          description:
            'Filter expenses by one or multiple operational categories. Pass an array of values.',
        },
        paymentMethod: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            enum: [
              PaymentMethod.CASH,
              PaymentMethod.PAYPAL,
              PaymentMethod.STRIPE,
              PaymentMethod.PAGO_MOVIL,
              PaymentMethod.DEBIT_CARD,
              PaymentMethod.CREDID_CARD,
              PaymentMethod.BANK_TRANSFER,
            ],
          },
          description:
            'Filter expenses by one or multiple payment methods used. Pass an array of values.',
        },
        minAmount: {
          type: Type.NUMBER,
          description: 'Minimum monetary value filter.',
        },
        maxAmount: {
          type: Type.NUMBER,
          description: 'Maximum monetary value filter.',
        },
        fromDate: {
          type: Type.STRING,
          description: 'Start date for filtering expenses (ISO format, e.g., YYYY-MM-DD).',
        },
        toDate: {
          type: Type.STRING,
          description: 'End date for filtering expenses (ISO format, e.g., YYYY-MM-DD).',
        },
        page: {
          type: Type.INTEGER,
          description: 'The page number to retrieve for pagination.',
        },
        pageSize: {
          type: Type.INTEGER,
          description: 'Number of items to return per page.',
        },
      },
    },
  },
  async execute(args) {
    return await expenseService.getAll(args)
  },
})

const getExpensesPerformanceTool = defineTool({
  schema: {
    name: 'get_expenses_performance',
    description: `
      Returns analytical performance data for expenses grouped by month and categories.
      Use this tool when the user wants to see trends, charts, or statistics about costs 
      (like maintenance, utilities, cleaning) distributed over time or specific date ranges.
    `,
    parameters: {
      type: Type.OBJECT,
      properties: {
        apartmentId: {
          type: Type.INTEGER,
          description: 'Filter performance data for a specific apartment ID.',
        },
        employeeId: {
          type: Type.INTEGER,
          description: 'Filter performance metrics generated by a specific employee.',
        },
        category: {
          type: Type.STRING,
          enum: [
            ExpenseCategory.MAINTENANCE,
            ExpenseCategory.UTILITIES,
            ExpenseCategory.CLEANING,
            ExpenseCategory.TAXES,
            ExpenseCategory.SUPPLIES,
            ExpenseCategory.OTHER,
          ],
          description: 'Filter performance details by a single operational category.',
        },
        fromDate: {
          type: Type.STRING,
          description:
            'Start date boundary for the analytics range (ISO format, e.g., YYYY-MM-DD).',
        },
        toDate: {
          type: Type.STRING,
          description: 'End date boundary for the analytics range (ISO format, e.g., YYYY-MM-DD).',
        },
      },
    },
  },
  async execute(args) {
    return await expenseService.getPerformance(args)
  },
})

const listUsersTool = defineTool({
  schema: {
    name: 'list_users',
    description: `
      Returns a paginated and filtered list of registered users/accounts in the system.
      Use this tool when an administrator wants to look up accounts, find users by name or email,
      audit system access, or review profiles registered within a specific date range.
    `,
    parameters: {
      type: Type.OBJECT,
      properties: {
        search: {
          type: Type.STRING,
          description: 'A generic search text to match against user names, last names, or emails.',
        },
        name: {
          type: Type.STRING,
          description: "Filter specifically by the user's first name.",
        },
        email: {
          type: Type.STRING,
          description: "Filter specifically by the user's email address.",
        },
        fromDate: {
          type: Type.STRING,
          description:
            'Filter users registered starting from this date (ISO format, e.g., YYYY-MM-DD).',
        },
        toDate: {
          type: Type.STRING,
          description: 'Filter users registered up to this date (ISO format, e.g., YYYY-MM-DD).',
        },
        page: {
          type: Type.INTEGER,
          description: 'The page number to retrieve for pagination.',
        },
        pageSize: {
          type: Type.INTEGER,
          description: 'Number of items to return per page.',
        },
      },
    },
  },
  async execute(args) {
    return await userService.getAll(args)
  },
})

export const tools = [
  faqTool,
  todayTool,
  contactTool,
  servicesTool,
  listUsersTool,
  userContextTool,
  listPaymentsTool,
  listExpensesTool,
  listEmployeesTool,
  listPromotionsTool,
  listApartmentsTool,
  listReservationsTool,
  getExpensesPerformanceTool,
  getPaymentsPerformanceTool,
]

export const apiTools: ChatCompletionTool[] = tools.map((t) => ({
  type: 'function' as const,
  function: t.declaration,
}))
