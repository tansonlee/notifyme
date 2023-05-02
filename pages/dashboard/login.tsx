import { Box, Button, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { FormEventHandler, useEffect, useState } from 'react';
import { userAtom } from '../../atoms/auth';
import { Layout } from '../../components/layouts';
import { PROFILE_ROUTE } from '../../interface/routes';
import { authFetchUser } from '../../lib/auth/authFetchUser';
import { initializeMagicLink } from '../../lib/magiclink';
import { storeUserToken } from '../../lib/storage';
import { errorToast } from '../../lib/toast';

const Login = () => {
	const router = useRouter();
	const [email, setEmail] = useState<string>('');
	const [, setUser] = useAtom(userAtom);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			const magic = initializeMagicLink();
			if (!magic) {
				errorToast({ description: 'Unexpected error please try refreshing the page.' });
				setIsLoading(false);
				return;
			}
			const isAlreadyLoggedIn = await magic.user.isLoggedIn();
			if (!isAlreadyLoggedIn) {
				setIsLoading(false);
				return;
			}

			const didToken = await magic.user.getIdToken();
			if (!didToken) {
				setIsLoading(false);
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
			if (error || !token) {
				setIsLoading(false);
				return;
			}

			storeUserToken(token);

			const { user } = await authFetchUser({
				endpoint: '/api/user/get-user',
				method: 'GET',
			});

			setUser(user);
			router.push(PROFILE_ROUTE);
			setIsLoading(false);
		})();
	}, [router, setUser]);

	const handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault();
		setIsLoading(true);
		const magic = initializeMagicLink();

		if (!magic) {
			errorToast({ description: 'Unexpected error please try refreshing the page.' });
			setIsLoading(false);
			return;
		}

		const isAlreadyLoggedIn = await magic.user.isLoggedIn();
		if (!isAlreadyLoggedIn) {
			await magic.auth.loginWithMagicLink({ email });
		}

		const didToken = await magic.user.getIdToken();
		if (!didToken) {
			errorToast({ description: 'Error logging in.' });
			setIsLoading(false);
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
			setIsLoading(false);
			return;
		}
		if (!token) {
			errorToast({ description: 'Error logging in.' });
			setIsLoading(false);
			return;
		}

		storeUserToken(token);

		const { user } = await authFetchUser({
			endpoint: '/api/user/get-user',
			method: 'GET',
		});

		setUser(user);
		router.push(PROFILE_ROUTE);
		setIsLoading(false);
	};

	return (
		<Layout>
			<Box>
				<Heading textAlign='center' mt={4}>
					Dashboard
				</Heading>
				<Text textAlign='center'>Send notifications, get your API key, and more!</Text>

				<Box
					border='1px solid #eee'
					w={500}
					m='0 auto'
					mt={8}
					p={8}
					borderRadius='lg'
					boxShadow='lg'
				>
					<form onSubmit={handleSubmit}>
						<Stack>
							<Text fontSize='lg'>Email</Text>
							<Input
								placeholder='richard@piedpiper.com'
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
							<Button isLoading={isLoading} type='submit'>
								Submit
							</Button>
						</Stack>
					</form>
				</Box>
			</Box>
		</Layout>
	);
};

export default Login;
