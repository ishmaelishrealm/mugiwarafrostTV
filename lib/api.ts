import { retry } from './utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// ============================
// 📌 Common Response Types
// ============================
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================
// 📌 Domain Models
// ============================
export interface Show {
  id: string;
  title: string;
  description: string;
  genre?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  id: string;
  title: string;
  number: number;
  showId: string;
  streamUrl?: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

// ============================
// 📌 API Client
// ============================
class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = { 'Content-Type': 'application/json' };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData: { message?: string } = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return this.request<T>(url.pathname + url.search);
  }

  async post<T, B = unknown>(endpoint: string, data?: B): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T, B = unknown>(endpoint: string, data?: B): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T, B = unknown>(endpoint: string, data?: B): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async uploadFile<T>(endpoint: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise<T>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText) as T;
            resolve(response);
          } catch {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Upload failed')));
      xhr.open('POST', `${this.baseURL}${endpoint}`);
      xhr.send(formData);
    });
  }

  async getWithRetry<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return retry(() => this.get<T>(endpoint, params));
  }

  setAuthToken(token: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      Authorization: `Bearer ${token}`,
    };
  }

  clearAuthToken() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Authorization, ...headers } = this.defaultHeaders as Record<string, string>;
    this.defaultHeaders = headers;
  }
}

export const apiClient = new ApiClient();

// ============================
// 📌 Specific API Functions
// ============================
export const showsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    genre?: string;
    search?: string;
    sort?: string;
  }) => apiClient.get<PaginatedResponse<Show>>('/shows', params),

  getById: (id: string) => apiClient.get<Show>(`/shows/${id}`),
  create: (data: Omit<Show, 'id' | 'createdAt' | 'updatedAt'>) => apiClient.post<Show>('/shows', data),
  update: (id: string, data: Partial<Show>) => apiClient.put<Show>(`/shows/${id}`, data),
  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/shows/${id}`),
};

export const episodesApi = {
  getAll: (params?: {
    showId?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get<PaginatedResponse<Episode>>('/episodes', params),

  getById: (id: string) => apiClient.get<Episode>(`/episodes/${id}`),
  create: (data: Omit<Episode, 'id' | 'createdAt' | 'updatedAt'>) => apiClient.post<Episode>('/episodes', data),
  update: (id: string, data: Partial<Episode>) => apiClient.put<Episode>(`/episodes/${id}`, data),
  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/episodes/${id}`),
};

export const playbackApi = {
  getToken: (episodeId: string) => apiClient.post<{ token: string }>('/playback/token', { episodeId }),
  getStreamUrl: (token: string) => apiClient.get<string>(`/playback/stream/${token}`),
};

export const authApi = {
  signIn: (email: string, password: string) =>
    apiClient.post<{ token: string; user: User }>('/auth/signin', { email, password }),

  signUp: (data: { username: string; email: string; password: string }) =>
    apiClient.post<{ token: string; user: User }>('/auth/signup', data),

  signOut: () => apiClient.post<ApiResponse<null>>('/auth/signout'),
  refreshToken: () => apiClient.post<{ token: string }>('/auth/refresh'),
  getProfile: () => apiClient.get<User>('/auth/profile'),
};

export const uploadApi = {
  uploadVideo: (file: File, onProgress?: (progress: number) => void) =>
    apiClient.uploadFile<ApiResponse<{ url: string }>>('/upload/video', file, onProgress),

  uploadImage: (file: File, onProgress?: (progress: number) => void) =>
    apiClient.uploadFile<ApiResponse<{ url: string }>>('/upload/image', file, onProgress),
};