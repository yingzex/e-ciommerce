import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
 
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email, password
    },
    // revoked if request is successful
    // go back to landing page
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async event => {
    event.preventDefault();
    await doRequest();
  }

  return <form onSubmit={onSubmit}>
    <h1>sign in</h1>
    <div className="form-group">
      <label>Email address</label>
      <input value={email} onChange={e => setEmail(e.target.value)}    className="form-control" />
    </div>
    <div className="form-group">
      <label>password</label>
      <input type="password" onChange={e => setPassword(e.target.value)} className="form-control" />
    </div>
    {errors}    
    <button className="btn btn-primary">Sign in</button>
  </form>;
};
 
export default Signup;