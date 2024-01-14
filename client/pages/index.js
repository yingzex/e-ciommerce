import buildClient from '../api/build-client';

// component (client, browser)
const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>you are signed in</h1> : <h1>you are NOT signed in</h1>;
};

// server
// getInitialProps: Next JS will call the function while it is attempting to render application on the server. Be able to fetch data that the component needs during server side rendering process
// once getInitialProps invoked, any data returned from it will be provided to our component as a prop
// each component during server side rendering is just rendered once
LandingPage.getInitialProps = async (context) => {
  console.log('landing page');
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};
 
export default LandingPage;

/**
 * getInitialProps executed on the server
 *  hard refresh of page
 *  clicking link from different domain
 *  typing url into address bar
 * getInitialProps executed on the client
 *  navigating from one page to another while in the app
*/