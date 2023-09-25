function fn() {
  var config = {
    baseURL: 'https://reqres.in',
    email: 'janet.weaver@reqres.in',
    first_name: 'Janet',
    last_name: 'Weaver'
  };

  var env = karate.env;
  karate.log('Env is: ', env);

  if (env === 'dev') {
    config.baseURL = 'https://google.com';
  } else if (env === 'test') {
    config.baseURL = 'https://reqres.in';
  } else {
    karate.fail('Invalid environment: ' + env);
  }

  karate.configure('connectTimeout', 5000);
  karate.configure('readTimeout', 5000);

  return config;
}
