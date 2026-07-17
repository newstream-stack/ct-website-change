export interface EventTicket {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export interface EventDetail {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  imageUrl: string;
  dateLabel: string;
  venue: string;
  tickets: EventTicket[];
}

export interface EventRegistrationRequest {
  ticketId: string;
  returnUrl: string;
  attendee: {
    name: string;
    title?: string;
    email: string;
    phone: string;
    organization?: string;
    remarks?: string;
  };
}

export interface EventRegistrationResponse {
  registrationId: string;
  status: 'payment_pending' | 'confirmed';
  paymentUrl?: string;
}
