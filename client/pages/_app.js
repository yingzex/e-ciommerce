// define custom app component

// 1. import global css
// 2. show some elements on the screen that will be visible on every single page
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return <div>
    <Header currentUser={currentUser} />
    <Component {...pageProps} />
  </div>;
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  // appContext.ctx: go to an indivitual pageProps.
  // appContext: go to AppComponent
  let pageProps;
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return {
    pageProps,
    ...data
  };

};

export default AppComponent;
