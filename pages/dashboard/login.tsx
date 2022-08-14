import { Box, Button, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { userAtom } from '../../atoms/auth';
import { PROFILE_ROUTE } from '../../interface/routes';
import { authFetchUser } from '../../lib/auth/authFetchUser';
import { initializeMagicLink } from '../../lib/magiclink';
import { storeUserToken } from '../../lib/storage';
import { errorToast } from '../../lib/toast';

const Login = () => {
	const router = useRouter();
	const [email, setEmail] = useState<string>('');
	const [, setUser] = useAtom(userAtom);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSubmit = async () => {
		setIsLoading(true);
		const magic = initializeMagicLink();
		const isAlreadyLoggedIn = await magic.user.isLoggedIn();
		if (!isAlreadyLoggedIn) {
			await magic.auth.loginWithMagicLink({ email });
		}

		const didToken = await magic.user.getIdToken();
		if (!didToken) {
			errorToast({ description: 'Error logging in.' });
			return;
		}

		const response = await fetch('/api/auth/get-token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				didToken,
			}),
		});

		const { token, error } = await response.json();
		if (error) {
			errorToast({ description: error });
			return;
		}
		if (!token) {
			errorToast({ description: 'Error logging in.' });
			return;
		}

		storeUserToken(token);

		const { user } = await authFetchUser({
			endpoint: '/api/user/get-user',
			method: 'GET',
		});

		console.log('USER', user);

		setUser(user);
		router.push(PROFILE_ROUTE);
		setIsLoading(false);
	};

	return (
		<Box>
			<Heading textAlign='center'>Login to NotifyMe</Heading>

			<Box w='50%' m='0 auto' mt={8}>
				<Stack>
					<Text textAlign='center' fontSize='lg'>
						Email
					</Text>
					<Input
						placeholder='richard@piedpiper.com'
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
					<Button isLoading={isLoading} onClick={handleSubmit}>
						Submit
					</Button>
				</Stack>
			</Box>
		</Box>
	);
};

export default Login;
