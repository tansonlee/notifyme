import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react';
import { initializeApollo } from '../lib/apollo';

const { ToastContainer } = createStandaloneToast();

function MyApp({ Component, pageProps }: AppProps) {
	const client = initializeApollo();
	return (
		<ChakraProvider>
			<Component {...pageProps} />
			<ToastContainer />
		</ChakraProvider>
	);
}

export default MyApp;
