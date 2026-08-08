import type { Schema } from "@/lib/schema.js";

export type Ticket = Schema<"Ticket">;
export type TicketStatus = Schema<"TicketStatus">;
export type TicketPriority = Schema<"TicketPriority">;
export type PaginatedTickets = Schema<"PaginatedTickets">;
export type CreateTicketRequest = Schema<"CreateTicketRequest">;
export type Sentiment = NonNullable<Ticket["sentiment"]>;
