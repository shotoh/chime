import type { ProfileDTO, ProfileUpdateDTO, ProfileWithTokenDTO } from './types';

const BASE_URL = '/api/profiles'; 

export async function getProfile(id: string): Promise<ProfileDTO> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.data;
}

export async function createProfile(): Promise<ProfileWithTokenDTO> {
  const res = await fetch(BASE_URL, { method: 'POST' });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return { profile: json.data.profile, token: json.data.token };
}

export async function updateProfile(id: string, token: string, data: ProfileUpdateDTO): Promise<ProfileDTO> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.data;
}

export async function deleteProfile(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
}