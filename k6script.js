import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export const requests = new Counter('http_reqs');

export const options = {
  vus : 100,
  duration: '15s',
}

const url = 'http://localhost:3030/reviews?product_id=1000000'
// const url = 'http://localhost:3030/reviews/meta?product_id=1000000'

export default function () {
  const res = http.get(url);
  check(res, {
    'is status 200' : r => r.status === 200,
    'transaction time < 50ms': r => r.timings.duration < 50,
    'transaction time < 100ms': r => r.timings.duration < 75,
  })
}