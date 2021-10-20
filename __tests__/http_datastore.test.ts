import HttpDatastore           from '../src/datastores/HttpDatastore';
import { Query, Limit, Eq, Gt, Lt } from 'rollun-ts-rql';
import { Headers, Response }   from 'node-fetch';
import { HttpClientInterface } from '../src/datastores/interfaces';

const _ = require('lodash');

// inject Headers object for testing with node.js

(global as any).Headers = Headers;

const testClient: HttpClientInterface = {
  get(uri?: string): Promise<Response> {
    switch (uri) {
      case '/1233':
        return new Promise(resolve => {
          resolve(new Response('{"id":"1233"}', {
            status:  201,
            headers: {
              'Content-Type': 'application/json'
            }
          }));
        });

      case '?limit(10,0)': {
        return new Promise(resolve => {
          const responseData = [
            { id: '1233', data: { a: 1, b: 2 } },
            { id: '1672', data: { a: 2, b: 3 } }
          ];
          resolve(new Response(JSON.stringify(responseData), {
            status:  201,
            headers: {
              'Content-Type': 'application/json'
            }
          }));
        });
      }
      case '?limit(1)': {
        return new Promise(resolve => {
          const responseData = [
            { id: '1233', data: { a: 1, b: 2 } }
          ];
          resolve(new Response(JSON.stringify(responseData), {
            status:  201,
            headers: {
              'Content-Type':  'application/json',
              'Content-Range': 'items 0-1/3'
            }
          }));
        });
      }
      case '?limit(1,1)': {
        return new Promise(resolve => {
          const responseData = [];
          resolve(new Response(JSON.stringify(responseData), {
            status:  201,
            headers: {
              'Content-Type':  'application/json',
              'Content-Range': 'items 0-1/3'
            }
          }));
        });
      }
      case '?eq(id,string:1233)': {
        return new Promise(resolve => {
          const responseData = [
            { id: '1233', data: { a: 1, b: 2 } }
          ];
          resolve(new Response(JSON.stringify(responseData), {
            status:  201,
            headers: {
              'Content-Type':  'application/json',
              'Content-Range': 'items 0-1/3'
            }
          }));
        });
      }
      case '?gt(number,1)': {
        return new Promise(resolve => {
          const responseData = [
            { id: '1233', number: 2, data: { a: 1, b: 2 } }
          ];
          resolve(new Response(JSON.stringify(responseData), {
            status:  201,
            headers: {
              'Content-Type':  'application/json',
              'Content-Range': 'items 0-1/3'
            }
          }));
        });
      }
      case '?lt(number,2)': {
        return new Promise(resolve => {
          const responseData = [
            { id: '1233', number: 1, data: { a: 1, b: 2 } }
          ];
          resolve(new Response(JSON.stringify(responseData), {
            status:  201,
            headers: {
              'Content-Type':  'application/json',
              'Content-Range': 'items 0-1/3'
            }
          }));
        });
      }
    }
  },
  post(): Promise<Response> {
    return new Promise(resolve => {
      resolve(new Response('{"id":"1233"}', {
        status:  201,
        headers: {
          'Content-Type': 'application/json'
        }
      }));
    });
  },
  put(): Promise<Response> {
    return new Promise(resolve => {
      resolve(new Response('{"id":"1233","data":{"a":1,"b":2}}', {
        status:  200,
        headers: {
          'Content-Type': 'application/json'
        }
      }));
    });
  },
  delete(): Promise<Response> {
    return new Promise(resolve => {
      resolve(new Response('{"id":"1233","data":{"a":1,"b":2}}', {
        status:  200,
        headers: {
          'Content-Type': 'application/json'
        }
      }));
    });
  },
  head(): Promise<Response> {
    return new Promise(resolve => {
      resolve(new Response('', {
        status:  200,
        headers: {
          'Content-Type': 'application/json'
        }
      }));
    });
  }
};

const datastore = new HttpDatastore('', { client: testClient });

test('create', () => {
  return new Promise((resolve, reject) => {
    try {
      datastore.create({ id: '1233' }).then((item) => {
        expect(_.isEqual(item, { id: '1233' })).toBeTruthy();
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
});
test('read', () => {
  return new Promise((resolve, reject) => {
    try {
      datastore.read('1233').then((item) => {
        expect(_.isEqual(item, { id: '1233' })).toBeTruthy();
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
});
test('update', () => {
  return new Promise((resolve, reject) => {
    try {
      datastore.update({
        id:   '1233',
        data: {
          a: 1,
          b: 2
        }
      }).then((item) => {
        expect(_.isEqual(item, {
          id:   '1233',
          data: {
            a: 1,
            b: 2
          }
        })).toBeTruthy();
        resolve();

      });
    } catch (error) {
      reject(error);
    }
  });
});
test('delete', () => {
  return new Promise((resolve, reject) => {
    try {
      datastore.delete('1233').then((item) => {
        expect(_.isEqual(item, {
          id:   '1233',
          data: {
            a: 1,
            b: 2
          }
        })).toBeTruthy();
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
});
test('query', done => {
  return new Promise((resolve, reject) => {
    try {
      datastore.query(new Query({ limit: new Limit(10, 0) })).then(
        (items) => {
          expect(_.isEqual(items, [
            { id: '1233', data: { a: 1, b: 2 } },
            { id: '1672', data: { a: 2, b: 3 } }
          ])).toBeTruthy();
          done();
          resolve();
        }
      );
    } catch (error) {
      reject(error);
    }
  });
});
test('query limit(1,1)', done => {
  return new Promise((resolve, reject) => {
    try {
      datastore.query(new Query({ limit: new Limit(1, 1) })).then(
        (items) => {
          expect(_.isEqual(items, [])).toBeTruthy();
          done();
          resolve();
        }
      );
    } catch (error) {
      reject(error);
    }
  });
});
test('query ?eq(id,string:1233)', done => {
  return new Promise((resolve, reject) => {
    try {
      datastore.query(new Query({ query: new Eq('id', '1233') })).then(
        (items) => {
          expect(_.isEqual(items, [
            { id: '1233', data: { a: 1, b: 2 } },
          ])).toBeTruthy();
          done();
          resolve();
        }
      );
    } catch (error) {
      reject(error);
    }
  });
});
test('query ?gt(number,1)', done => {
  return new Promise((resolve, reject) => {
    try {
      datastore.query(new Query({ query: new Gt('number', 1) })).then(
        (items) => {
          expect(_.isEqual(items, [
            { id: '1233', number: 2, data: { a: 1, b: 2 } },
          ])).toBeTruthy();
          done();
          resolve();
        }
      );
    } catch (error) {
      reject(error);
    }
  });
});
test('query ?lt(number,2)', done => {
  return new Promise((resolve, reject) => {
    try {
      datastore.query(new Query({ query: new Lt('number', 2) })).then(
        (items) => {
          expect(_.isEqual(items, [
            { id: '1233', number: 1, data: { a: 1, b: 2 } },
          ])).toBeTruthy();
          done();
          resolve();
        }
      );
    } catch (error) {
      reject(error);
    }
  });
});
test('count', () => {
  return new Promise((resolve, reject) => {
    try {
      datastore.count().then((count) => {
        expect(count).toEqual(3);
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
});
