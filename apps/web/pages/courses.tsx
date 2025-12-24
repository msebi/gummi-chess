import HomePage, { getStaticProps } from './index';

// For this demo, we'll just re-export the HomePage component and its data fetching.
// This makes the /courses route render the exact same content as the homepage.
export { getStaticProps };
export default HomePage;

