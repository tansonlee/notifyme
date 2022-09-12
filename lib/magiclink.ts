import { Magic } from 'magic-sdk';

let magicLink: Magic | null = null;

export const initializeMagicLink = () => {
	if (typeof window === 'undefined') {
		return;
	}
	if (!process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY) {
		throw new Error('Magic publishable key not set');
	}
	if (magicLink) {
		return magicLink;
	}
	magicLink = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
		network: 'mainnet',
	});
	return magicLink;
};
