import { atomWithStorage } from 'jotai/utils';

export const userEmailAtom = atomWithStorage<string>('userEmail', '');
