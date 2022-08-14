import { atom } from 'jotai';
import { UserFragment } from '../interface/user';

export const userAtom = atom<UserFragment | null>(null);
