import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // window object only exist in browser, not in node.js environment
    // we are on the server
    // request should be made to http://ingress-nginx.ingress-nginx...
    // from client in 'default' namespace, reach out to ingress-nginx in 'ingress-nginx' namespace
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // we are on the browser
    // request can be made with a base url of '', browser would put on base domain for us
    return axios.create({
      baseUrl: '/',
    });
  }
};
