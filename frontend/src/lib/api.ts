import { EarlyAccessFormData } from '../types';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
}

export async function submitEarlyAccessApi(data: EarlyAccessFormData): Promise<ApiResponse<{ id: string }>> {
  try {
    const response = await fetch('/api/early-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to submit early access request');
    }
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please try again.');
  }
}
