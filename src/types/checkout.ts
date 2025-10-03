export interface CheckoutSession {
  id: string;
  wave_session_id: string;
  user_id: string;
  amount: number;
  currency: string;
  checkout_status: 'open' | 'complete' | 'expired';
  payment_status?: 'processing' | 'cancelled' | 'succeeded';
  transaction_id?: string;
  wave_launch_url: string;
  success_url: string;
  error_url: string;
  client_reference?: string;
  listing_data: ListingFormData;
  when_created: string;
  when_completed?: string;
  when_expires: string;
}

export interface ListingFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  subcategory: string;
  location: string;
  condition: string;
  phone: string;
  images: string[]; // Changed from File[] to string[] (URLs)
}

export interface CreateCheckoutRequest {
  listing_data: ListingFormData;
  amount: number;
  client_reference?: string;
}
