import {gql, useLazyQuery} from "@apollo/client";

import Link from "next/link";
import styles from 'src/styles/Global.module.css'
import {useState} from "react";

export default function GetData() {

    const [products, setProducts] = useState([])

    const [getGraphQl] = useLazyQuery(gql`{
        products (first: 10) {
            edges {
                node {
                    id
                    title
                    priceRangeV2 {
                        maxVariantPrice {
                            amount
                            currencyCode
                        }
                        minVariantPrice {
                            amount
                            currencyCode
                        }
                    }
                }
            }
        }},
    `, {
        onCompleted: d => setProducts(d.products.edges)
    })

    const [message, setMessage] = useState('')

    const getApi = async (e) => {
        e.preventDefault()

        await fetch('/api/hello', {
            method: "GET"
        }).then(r => r.text()).then(r => setMessage(r))
    }

    return (
        <div className={styles.container}>
            <Link href={"/"}>
                <div className={styles.back}> &larr;</div>
            </Link>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Get Data
                </h1>
                <p className={styles.description}>
                    View the examples in{' '}
                    <code className={styles.code}>pages/app/get-data.js</code>
                </p>
                <div>
                    <div className={styles.card}>
                        <h2>Get Data from Shopify&apos;s GraphQL Api</h2>
                        <button className={styles.button} onClick={() => getGraphQl()}>Fetch</button>
                        {
                            products.map(p => {
                                return (
                                    <div key={p.node.id} className={styles.listItem}>
                                        <h2>{p.node.title}</h2>
                                        <p>{parseFloat(p.node.priceRangeV2.minVariantPrice.amount).toLocaleString("en-US", {
                                            style: "currency",
                                            currency: p.node.priceRangeV2.minVariantPrice.currencyCode
                                        })}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={styles.card}>
                        <h2>Get Data form your own Api</h2>
                        <button className={styles.button} onClick={getApi}>Fetch</button>
                        <h2>{message}</h2>
                    </div>
                </div>
            </main>
        </div>
    )
}