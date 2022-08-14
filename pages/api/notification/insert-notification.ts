import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromReq } from '../../../lib/auth/user';
import { insertNotification } from '../../../lib/db/insert';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		return res.status(405).end('Method not allowed');
	}

	const user = await getUserFromReq(req);
	if (!user) {
		return res.status(401).end('Unauthorized');
	}

	const { title, body, type } = req.body;

	const notification = await insertNotification({
		userId: user.id,
		title,
		body,
		type,
	});

	return res.status(200).json({ notification });
};

export default handler;
