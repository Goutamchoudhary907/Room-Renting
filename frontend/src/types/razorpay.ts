declare interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler?: (response: any) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    theme?: {
      color?: string;
    };
  }
  
  declare class Razorpay {
    constructor(options: RazorpayOptions);
    on(event: string, callback: (response: any) => void): void;
    open(): void;
  }
  
  declare global {
    interface Window {
      Razorpay: typeof Razorpay;
    }
  }