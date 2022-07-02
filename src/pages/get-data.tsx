import {
	Button,
	Card,
	DisplayText,
	IndexTable,
	Layout,
	Page,
	PageActions,
	Spinner,
	Stack,
	TextField,
	TextStyle,
} from '@shopify/polaris';
import { CurrencyCode, useGetProductsQuery } from '@graphql/generated';
import { useCallback, useState } from 'react';

import { TitleBar } from '@shopify/app-bridge-react';
import { trpc } from '@lib/utils/trpc';

export default function GetData() {
	const { data, isLoading } = useGetProductsQuery({
		first: 10,
	});

	const [text, setText] = useState('');
	const handleChange = useCallback((newValue: string) => setText(newValue), []);
	const [query, setQuery] = useState('');

	const { data: trpcData, isLoading: trpcIsLoading } = trpc.useQuery([
		'hello',
		{ text: query },
	]);

	const formatPrice = ({
		amount,
		currencyCode,
	}: {
		amount: any;
		currencyCode: CurrencyCode;
	}) =>
		parseInt(amount).toLocaleString('en-US', {
			style: 'currency',
			currency: currencyCode,
		});

	const rowMarkup = data?.products.nodes.map(
		(
			{ id, title, priceRangeV2: { minVariantPrice, maxVariantPrice } },
			index
		) => (
			<IndexTable.Row id={id} key={id} position={index}>
				<IndexTable.Cell>
					<TextStyle variation='strong'>{title}</TextStyle>
				</IndexTable.Cell>
				<IndexTable.Cell>
					{formatPrice(minVariantPrice)}
					{' - '}
					{formatPrice(maxVariantPrice)}
				</IndexTable.Cell>
			</IndexTable.Row>
		)
	);

	return (
		<Page breadcrumbs={[{ content: 'Home', url: '/' }]} title='Get Data'>
			<TitleBar
				title='Get Data'
				breadcrumbs={{ content: 'Dashboard', url: '/' }}
			/>
			<Layout>
				<Layout.AnnotatedSection
					title='Get data from the Admin API'
					description='Just write your GraphQl Queries and @graphql-codegen will generate typesafe custom hooks for you.'
				>
					<Card>
						<IndexTable
							resourceName={{ singular: 'product', plural: 'products' }}
							itemCount={data ? data.products.nodes.length : 0}
							headings={[{ title: 'Name' }, { title: 'Price range' }]}
							selectable={false}
							loading={isLoading}
						>
							{rowMarkup}
						</IndexTable>
					</Card>
				</Layout.AnnotatedSection>
				<Layout.AnnotatedSection
					title='Get data from your own API'
					description='Write fully typesafe APIs with tRPC.'
				>
					<Card sectioned>
						{trpcIsLoading ? (
							<Stack alignment='center' distribution='center'>
								<Spinner size='large' />
							</Stack>
						) : (
							<Stack vertical>
								<DisplayText>{trpcData?.greeting}</DisplayText>
								<TextField
									label='Type your name here and click submit'
									value={text}
									onChange={handleChange}
									autoComplete='off'
								/>
								<Button primary onClick={() => setQuery(text)}>
									Submit
								</Button>
							</Stack>
						)}
					</Card>
				</Layout.AnnotatedSection>
			</Layout>
			<PageActions />
		</Page>
	);
}
