# Account API Library

## Usage

```
import {AccountService} from 'matris-account-api';
...


const service = AccountService({url: 'http://localhost:3000/graphql'});

const user = await service.get({email: 'mail@email.com'});

```


## Todo

- Update docs

## Test

```
npm run test
```