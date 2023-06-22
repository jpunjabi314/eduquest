# eduquest

> Motivating students, one point at a time

## usage

it's hosted at https://educal.tech

## running locally

- first off, clone the repo
- next, install all the dependencies with `yarn` (or `npm` i guess)
- setup a `.env` file with the following filled in:
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_APP_ID
GCLOUD_CREDENTIALS
```
- run `yarn dev` (or `npm run dev` i guess)

## hosting on vercel

- import from the repo url
- add the enviornment variables of:
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_APP_ID
GCLOUD_CREDENTIALS
```

## credits:

based off [this template](https://github.com/stacc-dev/next-typescript-swr-watercss-serverless-firebase-auth-template/) that [@kognise](https://github.com/kognise) and I worked on.
