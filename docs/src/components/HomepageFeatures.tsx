import useBaseUrl from '@docusaurus/useBaseUrl';
import clsx from 'clsx';
import React from 'react';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    image: '/img/easy.svg',
    description: (
      <>
        All the packages are well documented and crafted with ease of use in mind
      </>
    ),
  },
  {
    title: 'Multi Purpose',
    image: '/img/multi_purpose.svg',
    description: (
      <>
        Fauton's ecosystem provides various packages to do almost anything with automaton
      </>
    ),
  },
  {
    title: 'Typescript Support',
    image: '/img/ts_support.svg',
    description: (
      <>
        Typescript support right out of the box for static typechecking.
      </>
    ),
  },
];

function Feature({ image, title, description }: FeatureItem) {
  const imgUrl = useBaseUrl(image);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <img src={imgUrl} alt={title} />
      <h3 className="features__title text--center">{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
