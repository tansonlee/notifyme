import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromReq } from '../../../lib/auth/user';
import { getNotificationsByUserId } from '../../../lib/db/getters';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET') {
		return res.status(405).end('Method not allowed');
	}

	const user = await getUserFromReq(req);
	if (!user) {
		return res.status(401).end('Unauthorized');
	}

	const notifications = await getNotificationsByUserId(user.id);

	return res.status(200).json({ notifications });
};

export default handler;
