import { sign } from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserByApiKey } from '../../../lib/db/getters';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
	}

	console.log('POST /api/v1/generate-client-secret');

	try {
		const { groupId } = req.body;

		const apiKey = req.headers?.authorization?.split(' ')[1];
		if (!apiKey) {
			return res.status(401).json({ error: 'Unauthorized no API key passed' });
		}

		// get user from api key
		const user = await getUserByApiKey(apiKey);
		if (!user) {
			return res.status(401).json({ error: 'Unauthorized invalid API key' });
		}

		// generate a client secret with groupId,
		// and return it to the user
		const token = generateClientSecret(groupId, apiKey);
		return res.status(200).json({ clientSecret: token });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
}

const generateClientSecret = (groupId: string, apiKey: string) => {
	const expiresInSeconds = 60 * 60 * 24 * 7;
	const issuer = 'notifyr-tansonlee';

	if (!groupId) {
		throw new Error('userId must be provided');
	}

	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET must be set');
	}

	const payload = {
		groupId,
		apiKey,
	};

	return sign(payload, process.env.JWT_SECRET, {
		expiresIn: expiresInSeconds,
		issuer: issuer,
		subject: groupId,
	});
};
