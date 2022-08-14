import { UserFragment } from '../../interface/user';
import { fetchHasura } from './request';

export const getNotificationsByUserId = async (userId: string) => {
	const query = `
        query getNotificationsByUserId($userId: uuid!) {
            notification(where: {user_id: {_eq: $userId}}) {
                body
                created_at
                id
                title
                type
                updated_at
                user_id
            }
        }
    `;

	const variables = { userId };

	const response = await fetchHasura(query, variables);
	return response.data.notification;
};

export const getUserById = async (userId: string): Promise<UserFragment> => {
	const query = `
        query getUserById($id: uuid!) {
            user_by_pk(id: $id) {
                created_at
                email
                id
                updated_at
                api_key
            }
        }
    `;

	const variables = { id: userId };

	const response = await fetchHasura(query, variables);
	console.log('response', response);
	return response.data.user_by_pk;
};

export const getUserByApiKey = async (apiKey: string): Promise<UserFragment> => {
	const query = `
        query UserByApiKey($apiKey: uuid!) {
            user(where: {api_key: {_eq: $apiKey}}) {
                api_key
                created_at
                email
                id
                updated_at
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
                    api_key
                    created_at
                    email
                    id
                    updated_at
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
