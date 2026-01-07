export type GroupItemType = 'sound' | 'group';

export interface BaseItem {
  type: GroupItemType;
  _id?: string;
}

export interface Sound extends BaseItem {
  type: 'sound';
  soundId: string;
  delay: number;
  volume: number;
  pitch: number;
  seed: number;
  enabled: boolean;
}

export interface Group extends BaseItem {
  type: 'group';
  name: string;
  enabled: boolean;
  items: (Sound | Group)[];
}

export interface ProfileDTO {
  id: string;
  name: string;
  rootGroup: Group;
}

export interface ProfileWithTokenDTO {
  profile: ProfileDTO;
  token: string;
}

export interface ProfileUpdateDTO {
  name: string;
  rootGroup: Group;
}

export interface StoredProfile {
  id: string;
  name: string;
  token: string;
}