import { ProfileDTO, ProfileUpdateDTO } from './types';

const BASE_URL = '/api/profiles';

const request = async <T>(url: string, opts?: RequestInit): Promise<T> => {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  if (res.status === 204 || res.headers.get('Content-Length') === '0') return {} as T;
  const json = await res.json();
  return json.data;
};

export const getProfile = (id: string) => 
  request<ProfileDTO>(`${BASE_URL}/${id}`);

export const createProfile = async () => {
  const data = await request<{ profile: ProfileDTO, token: string }>(BASE_URL, { method: 'POST' });
  return { profile: data.profile, token: data.token };
};

export const updateProfile = (id: string, token: string, data: ProfileUpdateDTO) =>
  request<ProfileDTO>(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  });

export const deleteProfile = (id: string, token: string) =>
  request<void>(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });