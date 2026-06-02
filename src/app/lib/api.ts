const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('reloop_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Lỗi kết nối' }));
    throw new Error(err.error || 'Lỗi kết nối');
  }

  return res.json();
}

export type VerificationStatus = 'NONE' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  phone?: string | null;
  avatar?: string | null;
  verificationStatus?: VerificationStatus;
  createdAt?: string;
}

export interface UserProfile extends User {
  address?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  bio?: string | null;
  cccdNumber?: string | null;
  cccdFullName?: string | null;
  cccdDateOfBirth?: string | null;
  cccdGender?: string | null;
  cccdNationality?: string | null;
  cccdPlaceOfOrigin?: string | null;
  cccdPlaceOfResidence?: string | null;
  cccdIssueDate?: string | null;
  cccdExpiryDate?: string | null;
  cccdFrontImage?: string | null;
  cccdBackImage?: string | null;
  verificationNote?: string | null;
  verifiedAt?: string | null;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number | null;
  category: string;
  condition: 'NEW' | 'GOOD' | 'FAIR' | 'POOR';
  conditionLabel: string;
  location: string;
  images: string[];
  status: 'PENDING' | 'ACTIVE' | 'SOLD' | 'REJECTED';
  views: number;
  createdAt: string;
  seller: { id: string; name: string; email: string; phone?: string | null; avatar?: string | null; verificationStatus?: VerificationStatus };
}

export interface AdminStats {
  totalUsers: number;
  totalListings: number;
  pendingListings: number;
  activeListings: number;
  soldListings: number;
  pendingVerifications?: number;
}

export interface Comment {
  id: string;
  content: string;
  listingId: string;
  userId: string;
  createdAt: string;
  user: { id: string; name: string };
}

export interface Conversation {
  id: string;
  listing: { id: string; title: string; images: string[]; price: number };
  otherUser: { id: string; name: string };
  lastMessage: { content: string; createdAt: string } | null;
  unread: number;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  readAt: string | null;
  sender: { id: string; name: string };
}

export const api = {
  auth: {
    register: (data: { email: string; password: string; name: string; phone?: string }) =>
      request<{ token: string; user: UserProfile }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request<{ token: string; user: UserProfile }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    me: () => request<UserProfile>('/auth/me'),
  },
  profile: {
    get: () => request<UserProfile>('/profile'),
    update: (data: Record<string, string>) =>
      request<UserProfile>('/profile', { method: 'PUT', body: JSON.stringify(data) }),
    updateAvatar: (avatar: string) =>
      request<UserProfile>('/profile/avatar', { method: 'PUT', body: JSON.stringify({ avatar }) }),
    submitVerification: (data: Record<string, string>) =>
      request<UserProfile>('/profile/verify', { method: 'POST', body: JSON.stringify(data) }),
  },
  listings: {
    getAll: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<Listing[]>(`/listings${query}`);
    },
    getMy: () => request<Listing[]>('/listings/my'),
    getById: (id: string) => request<Listing>(`/listings/${id}`),
    create: (data: Record<string, unknown>) =>
      request<Listing>('/listings', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      request<Listing>(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<{ message: string }>(`/listings/${id}`, { method: 'DELETE' }),
  },
  comments: {
    getByListing: (listingId: string) => request<Comment[]>(`/listings/${listingId}/comments`),
    create: (listingId: string, content: string) =>
      request<Comment>(`/listings/${listingId}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),
    delete: (id: string) => request<{ message: string }>(`/listings/comments/${id}`, { method: 'DELETE' }),
  },
  messages: {
    getConversations: () => request<Conversation[]>('/conversations'),
    getUnreadCount: () => request<{ count: number }>('/conversations/unread-count'),
    startConversation: (listingId: string) =>
      request<{ id: string }>('/conversations', { method: 'POST', body: JSON.stringify({ listingId }) }),
    getMessages: (conversationId: string) => request<ChatMessage[]>(`/conversations/${conversationId}/messages`),
    send: (conversationId: string, content: string) =>
      request<ChatMessage>(`/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
  },
  upload: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));
    const token = getToken();
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error('Upload thất bại');
    const data = await res.json();
    return data.urls as string[];
  },
  admin: {
    stats: () => request<AdminStats>('/admin/stats'),
    users: () => request<(User & { isActive: boolean; _count: { listings: number } })[]>('/admin/users'),
    updateUser: (id: string, data: { role?: string; isActive?: boolean }) =>
      request<User>(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    listings: (status?: string) => {
      const query = status ? `?status=${status}` : '';
      return request<(Listing & { user: { id: string; name: string; email: string } })[]>(`/admin/listings${query}`);
    },
    updateListing: (id: string, status: string) =>
      request(`/admin/listings/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    deleteListing: (id: string) =>
      request(`/admin/listings/${id}`, { method: 'DELETE' }),
    verifications: (status?: string) => {
      const query = status ? `?status=${status}` : '';
      return request<UserProfile[]>(`/admin/verifications${query}`);
    },
    verifyUser: (id: string, status: 'VERIFIED' | 'REJECTED', verificationNote?: string) =>
      request<UserProfile>(`/admin/users/${id}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ status, verificationNote }),
      }),
  },
};

export function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins || 1} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}
