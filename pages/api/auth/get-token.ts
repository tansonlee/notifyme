import { Magic } from '@magic-sdk/admin';
import { NextApiRequest, NextApiResponse } from 'next';
import { generateUserJwt } from '../../../lib/auth/user';
import { getUserByApiKey, getUserByEmail } from '../../../lib/db/getters';
import { insertUser } from '../../../lib/db/insert';
import Cors from 'cors';

const magicAdmin = new Magic(process.env.MAGIC_SECRET_KEY);

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
export const cors = Cors({
	methods: ['POST', 'GET', 'HEAD'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result: any) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res, cors);

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}
	console.log('POST /api/auth/get-token');

	try {
		const { apiKey, didToken } = req.body;

		if (!apiKey && !didToken) {
			return res.status(400).json({ error: 'No apiKey or didToken given' });
		}

		let userId: string | null = null;

		if (apiKey) {
			const user = await getUserByApiKey(apiKey);

			if (!user) {
				return res.status(401).json({ error: 'Invalid apiKey' });
			}
			userId = user.id;
		} else if (didToken) {
			const { email } = await magicAdmin.users.getMetadataByToken(didToken);
			if (!email) {
				return res.status(401).json({ error: 'Invalid didToken' });
			}
			let user = await getUserByEmail(email);

			if (!user) {
				user = await insertUser({
					email,
				});
			}
			if (!user) {
				throw new Error('Could not create user');
			}
			userId = user.id;
		}

		if (!userId) {
			throw new Error('No userId');
		}

		console.log({ userId });

		const token = generateUserJwt(userId);
		console.log({ token });

		return res.status(200).json({ token });
	} catch (e) {
		console.log('Error /api/auth/get-token', e);
		return res.status(500).json({ error: e });
	}
};

export default handler;
