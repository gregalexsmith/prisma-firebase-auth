import { GraphQLClient } from 'graphql-request';
import gqlAuthHeader  from './utils/gqlAuthHeader';
import {createTestUser, deleteTestUser, updateTestUser, loginClient, setClientToken} from './utils/firebaseTasks';

const { 
  GRAPHQL_SERVER_URL, 
  FIREBASE_TEST_EMAIL
} = process.env;


beforeAll(async () => {
  await createTestUser();
  await loginClient()
  await setClientToken();
})

afterAll(async () => {
  await deleteTestUser();
})

test('should allow the creation of a user account with a valid ID Token', async () => {
  expect.assertions(2);
  const client = new GraphQLClient(GRAPHQL_SERVER_URL);
  
  const variables = {
    id_token: process.env.AUTH_CLIENT_ACCESS_TOKEN,
  };
  const SIGN_UP_MUTATION = `mutation ($id_token: String!) {
    signUp(idToken: $id_token) {
      id
      email
      emailVerified
    }
  }`;
  const data = await client.request(SIGN_UP_MUTATION, variables);
  expect(data).toHaveProperty('signUp.email', FIREBASE_TEST_EMAIL);
  expect(data).toHaveProperty('signUp.emailVerified', false);
});

test('should allow a user with an unverified email to get their profile', async () => {
  expect.assertions(2);
  const client = new GraphQLClient(GRAPHQL_SERVER_URL, gqlAuthHeader());
  const ME_QUERY = `{
    me {
      email
      emailVerified
    }
  }`;
  const data = await client.request(ME_QUERY);
  expect(data).toHaveProperty('me.email', FIREBASE_TEST_EMAIL);
  expect(data).toHaveProperty('me.emailVerified', false);
});

test('should not allow a user with an unverified email to delete their account', async () => {
  expect.assertions(1);
  const client = new GraphQLClient(GRAPHQL_SERVER_URL, gqlAuthHeader());
  const DELETE_ME_MUTATION = `mutation {
    deleteMe {
      id
    }
  }`;
  try {
    await client.request(DELETE_ME_MUTATION);
  } catch(e) {
    expect(e.response.errors[0].message).toEqual("Email not verified")
  }
});

describe('after verifying user email with firebase and fetching a new id_token, the server:', () => {
  // verify firebase user 
  beforeAll(async () => {
    await updateTestUser({
      emailVerified: true
    })
    await setClientToken();
  });

  test('should allow the user to pass the new id_token to verify their email', async () => {
    expect.assertions(1);
    const client = new GraphQLClient(GRAPHQL_SERVER_URL, gqlAuthHeader());
    const variables = {
      id_token: process.env.AUTH_CLIENT_ACCESS_TOKEN,
    };
    const VERIFY_EMAIL_MUTATION = `mutation ($id_token: String!) {
      verifyEmail(idToken: $id_token) {
        id
        email
        emailVerified
      }
    }`;
    const data = await client.request(VERIFY_EMAIL_MUTATION, variables);
    expect(data).toHaveProperty('verifyEmail.emailVerified', true);
  });

  test('should allow a user to delete their own account', async () => {
    expect.assertions(1);
    const client = new GraphQLClient(GRAPHQL_SERVER_URL, gqlAuthHeader());
    const DELETE_ME_MUTATION = `mutation {
      deleteMe {
        id
      }
    }`;
    const data = await client.request(DELETE_ME_MUTATION);
    expect(data).toHaveProperty('deleteMe.id');
  });
});
