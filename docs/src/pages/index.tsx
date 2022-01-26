import Head from "@docusaurus/Head";
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';
import HomepageFeatures from "../components/HomepageFeatures";
import styles from './index.module.css';

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <img src={imgUrl} alt={title} />
      <h3 className="features__title">{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig } = context;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="A whole ecosystem of npm packages to automate notion using typescript or javascript">
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <img className="hero__image mx-auto" height={200} style={{ transform: "scale(1.5)" }} src={"/img/logo.svg"} />
          <p className="hero__subtitle my-2"><b>{siteConfig.tagline}</b></p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/')}>
              Get Started
            </Link>
          </div>
          <img style={{
            margin: '10px 0'
          }} height="25" src="https://img.shields.io/github/stars/devorein/fauton?style=social" />
        </div>
      </header>
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

export default Home;
