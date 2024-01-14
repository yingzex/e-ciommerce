import Link from 'next/link';


export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'sign up', href: '/auth/signup' },
    !currentUser && { label: 'sign in', href: '/auth/signin' },
    currentUser && { label: 'sign out', href: '/auth/signout' },
  ]
    .filter(linkConfig => linkConfig) // filter out any entries that are false
    .map(({ label, href }) => {
      return <li key={href} className='nav-item'>
        <Link href={href} className='nav-link'>
          {label}
        </Link>
      </li>;
    });
  return (
    <nav className="navbar navbar-light bg-light">
      <Link className="navbar-brand" href="/">
        GitTix
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links}
        </ul>
      </div>
    </nav>
  );
};