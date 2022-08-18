import { notificationColumns, NotificationFragment } from '../../interface/notification';
import { userColumns, UserFragment } from '../../interface/user';
import { fetchHasura } from './request';

export const getNotificationsByUserId = async (userId: string): Promise<NotificationFragment[]> => {
	const query = `
        query getNotificationsByUserId($userId: uuid!) {
            notification(where: {user_id: {_eq: $userId}}) {
                ${notificationColumns}
            }
        }
    `;

	const variables = { userId };

	const response = await fetchHasura(query, variables);
	return response.data.notification;
};

export const getUserById = async (userId: string): Promise<UserFragment | null> => {
	const query = `
        query getUserById($id: uuid!) {
            user_by_pk(id: $id) {
                ${userColumns}
            }
        }
    `;

	const variables = { id: userId };

	const response = await fetchHasura(query, variables);
	console.log('response', response);
	return response.data.user_by_pk;
};

export const getUserByApiKey = async (apiKey: string): Promise<UserFragment | null> => {
	const query = `
        query UserByApiKey($apiKey: uuid!) {
            user(where: {api_key: {_eq: $apiKey}}) {
                ${userColumns}
            }
        }
    `;

	const variables = { apiKey };

	const response = await fetchHasura(query, variables);
	console.log('response', response);
	return response.data.user[0];
};

export const getUserByEmail = async (email: string): Promise<UserFragment | null> => {
	try {
		const query = `
            query UserByEmail($email: String!) {
                user(where: {email: {_eq: $email}}) {
                    ${userColumns}
                }
            }
        `;

		const variables = { email };

		const { error, data } = await fetchHasura(query, variables);
		if (error) {
			console.log('Error getUserByEmail', error);
			return null;
		}
		return data.user[0];
	} catch (e) {
		console.log('Error getting user by email', e);
		return null;
	}
};

export const getNotificationsByUserIdAndGroupId = async ({
	groupId,
	userId,
}: {
	userId: string;
	groupId: string;
}): Promise<NotificationFragment[]> => {
	const query = `
        query GetNotificationsByUserIdAndGroupId($userId: uuid!, $groupId: String!) {
            notification(where: {user_id: {_eq: $userId}, _and: {group_id: {_eq: $groupId}}}) {
                ${notificationColumns}
            }
        }
      
    `;

	const variables = { userId, groupId };

	const { data, error } = await fetchHasura(query, variables);
	if (error) {
		throw new Error(error);
	}

	return data.notification;
};
