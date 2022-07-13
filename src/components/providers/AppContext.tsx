import { DisplayText, Spinner, Stack } from '@shopify/polaris';
import { ReactNode, createContext, useContext } from 'react';

import { OnlineAccessInfo } from '@lib/utils/loadCurrentSession';
import { trpc } from '@lib/utils/trpc';

const AppContext = createContext<{
	shop: string;
	user: Partial<OnlineAccessInfo['associated_user']> | undefined;
}>({ shop: '', user: {} });

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
	const { data: appContext, isLoading } = trpc.useQuery(['appContext'], {
		staleTime: 3000,
	});

	if (isLoading) {
		return (
			<div
				style={{
					height: '100vh',
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Stack
					vertical
					alignment='center'
					distribution='center'
					spacing='extraLoose'
				>
					<Spinner size='large' />
					<DisplayText>App is loading...</DisplayText>
				</Stack>
			</div>
		);
	}

	return (
		<AppContext.Provider
			value={{
				shop: appContext?.shop || '',
				user: appContext?.user,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	return useContext(AppContext);
};
