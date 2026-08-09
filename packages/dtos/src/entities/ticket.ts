import type { Schema } from "@/lib/schema.js";

export type Ticket = Schema<"Ticket">;
export type TicketStatus = Schema<"TicketStatus">;
export type TicketPriority = Schema<"TicketPriority">;
export type PaginatedTickets = Schema<"PaginatedTickets">;
export type CreateTicketRequest = Schema<"CreateTicketRequest">;
export type TicketActivity = Schema<"TicketActivity">;
export type TicketAssignment = Schema<"TicketAssignment">;
export type TicketSummary = Schema<"TicketSummary">;
export type TicketClassification = Schema<"TicketClassification">;
export type Sentiment = NonNullable<Ticket["sentiment"]>;
export type TicketActivityType = NonNullable<TicketActivity["type"]>;
export type ClassificationSource = NonNullable<TicketClassification["source"]>;
