import { Box, Heading, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { userEmailAtom } from '../../atoms/auth';

const Profile = () => {
	const userEmail = useAtomValue(userEmailAtom);

	return (
		<Box>
			<Heading>Account</Heading>
			<Text>Welcome, {userEmail}</Text>
		</Box>
	);
};

export default Profile;
