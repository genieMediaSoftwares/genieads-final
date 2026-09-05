export interface EarlyAccessSubmission {
  id: string;
  name: string;
  workEmail: string;
  companyBrand: string;
  url?: string;
  interest: 'Social Intelligence' | 'Growth Intelligence' | 'Managed Growth' | 'Not sure yet';
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
}
