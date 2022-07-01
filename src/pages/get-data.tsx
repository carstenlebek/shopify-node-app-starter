import { Card, IndexTable, Layout, Page, TextStyle } from '@shopify/polaris';
import { CurrencyCode, useGetProductsQuery } from '@graphql/generated';

export default function GetData() {
	const { data, isLoading } = useGetProductsQuery(
		{
			first: 10,
		}
	);

	const getApi = async (e) => {
		e.preventDefault();

		await fetch('/api/hello', {
			method: 'GET',
		}).then((r) => r.text());
	};

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
		<Page breadcrumbs={[{ content: 'Home', url: '/' }]} title='Get data'>
			<Layout>
				<Layout.AnnotatedSection title='Get data from the Admin API'>
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
				<Layout.AnnotatedSection title='Get data from your own API'></Layout.AnnotatedSection>
			</Layout>
		</Page>
	);
}
