import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react';

const { ToastContainer } = createStandaloneToast();

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider>
			<Component {...pageProps} />
			<ToastContainer />
		</ChakraProvider>
	);
}

export default MyApp;
