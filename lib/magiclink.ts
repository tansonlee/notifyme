import { Magic } from 'magic-sdk';

let magicLink: Magic | null = null;

export const initializeMagicLink = () => {
	if (typeof window === 'undefined') {
		throw new Error('Magic initialized on server');
	}
	if (!process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY) {
		throw new Error('Magic publishable key not set');
	}
	if (magicLink) {
		return magicLink;
	}
	// magicLink = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
	magicLink = new Magic('pk_live_71236082FA2C077A', {
		network: 'mainnet',
	});
	return magicLink;
};
