import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import BannerOne from '@site/static/img/banner-1.png';
import BannerTwo from '@site/static/img/banner-2.png';
import BannerThree from '@site/static/img/banner-3.png';

const FeatureList = [
  {
    title: 'RoadRunner',
    img: BannerOne,
    description: (
      <>
        Built on top of RoadRunner, Beauty Framework brings high performance, zero-downtime reloads, persistent workers, queues, and gRPC support out of the box — no FPM required.
      </>
    ),
  },
  {
    title: 'PSR-compliant',
    img: BannerTwo,
    description: (
      <>
        Beauty Framework embraces PSR standards to give you clean architecture, powerful abstractions, and full compatibility with the modern PHP ecosystem.
      </>
    ),
  },
  {
    title: 'Modular',
    img: BannerThree,
    description: (
      <>
        Modular by design — Beauty Framework is split into focused packages, so you only use what you need.
      </>
    ),
  },
];

function Feature({img, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={img} className={styles.featureSvg} alt={title}/>
        {/*<Svg className={styles.featureSvg} role="img" />*/}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
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
