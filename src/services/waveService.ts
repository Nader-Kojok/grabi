interface WaveCheckoutSession {
  id: string;
  amount: string;
  checkout_status: 'open' | 'complete' | 'expired';
  client_reference?: string;
  currency: string;
  error_url: string;
  last_payment_error?: {
    code: string;
    message: string;
  };
  business_name: string;
  payment_status?: 'processing' | 'cancelled' | 'succeeded';
  transaction_id?: string;
  aggregated_merchant_id?: string;
  success_url: string;
  wave_launch_url: string;
  when_completed?: string;
  when_created: string;
  when_expires: string;
}

interface CreateCheckoutSessionParams {
  amount: string;
  currency: string;
  success_url: string;
  error_url: string;
  client_reference?: string;
}

interface WaveApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class WaveService {
  private readonly supabaseUrl: string;

  constructor() {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    if (!this.supabaseUrl) {
      throw new Error('Supabase URL is not configured');
    }
  }

  /**
   * Create a new checkout session with Wave
   */
  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<WaveApiResponse<WaveCheckoutSession>> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/wave-payment/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating Wave checkout session:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Retrieve a checkout session by ID
   */
  async getCheckoutSession(sessionId: string): Promise<WaveApiResponse<WaveCheckoutSession>> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/wave-payment/session/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error retrieving Wave checkout session:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Check if a payment was successful
   */
  isPaymentSuccessful(session: WaveCheckoutSession): boolean {
    return session.checkout_status === 'complete' && session.payment_status === 'succeeded';
  }

  /**
   * Check if a payment failed
   */
  isPaymentFailed(session: WaveCheckoutSession): boolean {
    return (
      session.checkout_status === 'expired' ||
      (session.checkout_status === 'complete' && session.payment_status === 'cancelled')
    );
  }

  /**
   * Get the listing price from environment
   */
  getListingPrice(): number {
    return parseInt(import.meta.env.VITE_LISTING_PRICE || '500', 10);
  }

  /**
   * Format amount for Wave API (string representation)
   */
  formatAmount(amount: number): string {
    return amount.toString();
  }

  /**
   * Generate success URL for checkout
   */
  generateSuccessUrl(sessionId: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/payment/success?session_id=${sessionId}`;
  }

  /**
   * Generate error URL for checkout
   */
  generateErrorUrl(sessionId: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/payment/error?session_id=${sessionId}`;
  }
}

// Export singleton instance
export const waveService = new WaveService();

// Export types for use in other files
export type { WaveCheckoutSession, CreateCheckoutSessionParams, WaveApiResponse };
