import { Button, Redirect, TitleBar } from '@shopify/app-bridge/actions';

import { useAppBridge } from '@shopify/app-bridge-react';

export const useShopifyTitlebar = ({
	title,
	breadCrumbs,
}: {
	title: string;
	breadCrumbs?: {
		label?: string;
		path?: string;
	};
}) => {
	const app = useAppBridge();
	const redirect = Redirect.create(app);
	let breadcrumb;
	if (breadCrumbs) {
		breadcrumb = Button.create(app, { label: breadCrumbs.label || '' });
        breadcrumb.subscribe(Button.Action.CLICK, () => {
			redirect.dispatch(Redirect.Action.APP, breadCrumbs.path || '');
		});
	}

	const titleBarOptions = {
		title,
		breadcrumbs: breadcrumb,
	};
	return TitleBar.create(app, titleBarOptions);
};
