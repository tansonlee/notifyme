import { Box, Heading, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { userAtom } from '../../atoms/auth';
import { authFetchUser } from '../../lib/auth/authFetchUser';
import { errorToast } from '../../lib/toast';

const Profile = () => {
	const user = useAtomValue(userAtom);
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			errorToast({ description: 'You are not logged in.' });
			router.push('/dashboard/login');
		}
	}, [router, user]);

	if (!user) {
		return null;
	}

	return (
		<Box>
			<Heading>Account</Heading>
			<Text>Welcome, {user.email}</Text>
			<Text>Your api key is: {user.api_key}</Text>
		</Box>
	);
};

export default Profile;
