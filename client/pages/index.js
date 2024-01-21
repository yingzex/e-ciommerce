import Link from 'next/link';

// component (client, browser)
const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            View
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

// server
// getInitialProps: Next JS will call the function while it is attempting to render application on the server. Be able to fetch data that the component needs during server side rendering process
// once getInitialProps invoked, any data returned from it will be provided to our component as a prop
// each component during server side rendering is just rendered once
LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
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