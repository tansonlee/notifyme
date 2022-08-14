import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

let client: ApolloClient<NormalizedCacheObject> | null = null;

export const initializeApollo = () => {
	if (!client) {
		client = new ApolloClient({
			uri: 'https://notifyme.hasura.app/v1/graphql',
			cache: new InMemoryCache(),
		});
	}

	return client;
};
