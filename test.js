import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
  cloud: {
    // Project: Default project
    projectID: 3713380,
    // Test runs with the same name groups test runs together.
    name: 'Test (10/09/2024-06:58:00)'
  },
  thresholds: {
    // During the whole test execution, the error rate must be lower than 1%.
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<200']
  },
};

export default function() {
  http.get('http://localhost:8001/v1/api/product/all-product');
  sleep(1);
}