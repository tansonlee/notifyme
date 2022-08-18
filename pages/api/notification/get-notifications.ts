import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromReq } from '../../../lib/auth/user';
import {
	getNotificationsByUserId,
	getNotificationsByUserIdAndGroupId,
} from '../../../lib/db/getters';
import { cors, runMiddleware } from '../auth/get-token';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res, cors);
	if (req.method !== 'GET') {
		return res.status(405).end('Method not allowed');
	}

	const user = await getUserFromReq(req);
	if (!user) {
		return res.status(401).end('Unauthorized');
	}

	const { groupId } = req.query;

	let notifications;
	if (groupId) {
		notifications = await getNotificationsByUserIdAndGroupId({
			userId: user.id,
			groupId: groupId as string,
		});
	} else {
		notifications = await getNotificationsByUserId(user.id);
	}

	return res.status(200).json({ notifications });
};

export default handler;
