// lolex and jest don't consider promises to be "timers"

(global as any).Promise = (window as any).Promise = require('promise/setimmediate/es6-extensions');

// deterministic random bytes that works with mock timers

let randomBytesIndex = 0;
const randomBytes = Buffer.from(
  'ReDv8N7rOnM4OoPJ2Nkb3IG5zSaouy24or6a+QHk9qpdOWvinqyRtoOdGGEZGUgeHJWMvkHGVV++HIXsvWz7EkuA+5AcLUi6gB0XnKOGpPY/cR2cm9JwFaZX/nb3nJHvUaIQLIcVI/DHwi/uiYRVNV5/S/K52/PqfTevk9PJA8n14uHQonHohfZJIdYbRqpJEzuFDF2rFkQ5weLuraXL6c7jL/KMQI98eESX0FiqPFqJjrIqeE7PMNWcKUBtEP+0ro3lC0uhzSjfRQ6Ab5GXQcw1gKiZ8wg/yatlNl/jIDaadTc9EQSuZREwKQUp8KVF1Q2MyjQEfiqglJIwMnDrzlBzEL60LjE6j3iU1wjwF6GlA6Fnz/csSXgYnZuaV84SshUCucRe2cQmv5lhi7WZ4HEiME8otue6YHGy83vMFph8ulQIdwiR9B6/aMLJ3R7l5tYWbS4nvjZ48a369yy6CHs3Y9MpbJ4yV8n5oNh8m6QYM3mnJRWfVQXHJ7XajUqtR579ce+KTpZS9RMARVRyWMr8mJcyL2kMpJsjoxkBXbxhr+hnX/ZgNMAKzxNCn50Nmx6Papyy6CMnKYysQvlLGJ2yo5vUyevEmkmnDztiIzs9iIIQQ5jkhdVmMrOLCWwvRGBx1QWFoQC0Q+THt3jsd7geby0wUM934Lsg88/1cAdQQxzfdFsyDNLpVpjj3DsScMkYkrWYpfANlF3iJC1NHCp13gcp72NK8raq5B7rjkIxC5VKSOkvOjdjrRoGTxwMLhrK3xdoklBTSQ39fpDR6i1D2OhvwdIdHF/0oZZul0ZYXEESHIf406P6VytOxJvLpWV4k9vePaLIqnwG0h/61QHvQMCSPSKZ9I7cAHjZUNNREycfGSoO20crunuX0VZpmMIBq9APL5IOPdTiRfwVCCNY/GQDteOAHuaF9iK829cb6XLzrTRPyoFX6hNcnrXLX3NPmfKk9uqpw92C7N6+EytvFL7wHZDaQCfGggu3tdjM9LZmTjgHgCgOcZZCJ1Y2aG06BlNzgzRZ3F1L3AMligQAhCWYXelT6XqSPMWV/EQyBOVMpQZnflT05CyXwY9sa1ZPIMV5DRfr5TqtPpdCrGTnz9hyBOjdVPItQKY1B59WuxPFOuF3SgDpj/fw6SxATGjfrLYdw1cmCshIZM9yEX4hVoKR++04uVkUEhM89ols4So3fgVWCVWpCmRs8JsO1VOyTD8r6r1RlfjKZ0/p0b4zPi0YTgSgNLL+xV98Y1j8+XwcIcil36iMUqKO0Zv0DsXRnu4VVsgI9mURI0sBuakzOK95gG2ztL0a9Ea+9m7IHsdCewjj26Ds3lb/KKH7xb9a8oGnBrTTzTJZI5pc1zTd',
  'base64',
);

jest.mock('crypto', () => {
  const c = jest.requireActual('crypto');
  return {
    ...c,
    randomBytes(
      count: number,
      cb?: (err: Error | null, buffer: Buffer) => void,
    ) {
      if (randomBytesIndex + count >= randomBytes.length) {
        randomBytesIndex = 0;
      }
      const bytes = Buffer.alloc(count);
      randomBytes.copy(bytes, 0, randomBytesIndex, randomBytesIndex + count);
      randomBytesIndex += count;
      if (!cb) {
        return bytes;
      } else {
        setImmediate(() => cb(null, bytes));
      }
    },
  };
});

// make uuid function deterministic

jest.mock('../__demo__/shared/utils', () => {
  let index = 0;
  const uuids = [
    '82985d45-4b5d-43f4-b982-f6b0e0b51239',
    'd6b3e582-6c63-4aba-8fac-ba29654d32bd',
    '973683e1-5de8-4612-9077-112863c5e3b7',
    '1700fa01-161d-4b64-8dc4-0bd71172e1ab',
    '4027c848-b4a9-4111-8811-20769d45284a',
    'eb0a6571-43c4-4051-b52b-076b5a0c1a28',
    '39532e37-8214-4b19-ac1a-a5c44ffb6c67',
    '38ecce66-1568-4cd2-96ac-251f99325b09',
    '17b1faa8-9cd2-4a28-98f2-19c76a85737f',
    'c38e4c5b-c6bb-4b2f-b7ff-575f62d5f218',
    'f1a807f0-6147-432a-9e0d-ee8a4c082901',
    '8874e596-f684-4f24-a38b-6c5b88e8b4e0',
    '62fea923-51ec-4b7a-9a07-b85ba599bf26',
    'e348b783-56d5-4ffc-8881-bf767899629e',
    'b892405c-4fa9-42bb-956e-e94dd57042ec',
    '679c44ae-21a7-4b41-a46e-714bd6e640f0',
    '69537e9f-6da6-4089-ae27-f10023bca0f7',
    '2dd6354c-b767-4918-ab03-ab7c703e35a9',
    '1c120d7d-bfa9-452f-9216-9eda0fdb73ec',
    '5be8020c-2cab-4864-97b6-4f5f5e87da0c',
    'a907c833-cefc-431f-8f10-0c567f9a2f6c',
    '3095f12f-209e-4740-aba1-9c949509ce53',
    '1edda096-df3f-4aa0-b15b-242881f6941a',
    'cd22be11-23eb-41c2-859f-2965ef655c81',
    'cc50e109-3f1a-4504-b623-2db7a473e6d9',
    '9d3dfa64-b65e-4656-838d-b8cae0be0fde',
    'fef1bf6c-f12b-47da-808f-472eccfc0487',
    '914552dc-60bc-4d4f-b3a1-8e81bc1a06f6',
    '638c1b70-8cbc-4a1f-b9a9-9e1351c26bfa',
    'f8a08753-79f7-4eda-ac79-1fab7b933fa2',
    'aacb177e-1277-48ed-88a2-83463103156e',
    'd4f94efd-a282-44e5-953e-dc1dbdcaf45c',
    'e986c929-09cb-4be4-aff2-1e993d2c3e2e',
    'ddd4bbc7-8466-4e7e-a06d-8a3bc40274c4',
    '3271497a-b6b6-46c6-9624-082dbcd9a70c',
    'cd6d1d54-e44d-485f-99cc-96c3ab96c14d',
    '0c7bfe6e-e2b1-4687-afbb-b701ecc67576',
    '023fe34a-9632-47ed-8436-8837c1cb6804',
    '24a00e57-cefc-40b0-a5c7-b32b363254a2',
    '711ac9bd-037c-47fd-9b2b-d6070dfc27ad',
    '55d4a1b5-83c3-452c-961b-bd38f2446048',
    'da210437-1454-43cc-9fd5-36d4acec809c',
    '68feb4ca-d4a6-4c48-95bb-758400923cb3',
    '1b54bf82-b012-4b06-bfef-5b7cef870f50',
    '6e2f69b6-d493-4551-b958-27e1dfa60138',
    '36a59810-45fb-4468-af00-ab1689b737c6',
    '40d2f6ba-bf76-43d5-b714-b69b668282f5',
    'd8c1bcfc-f0bb-4504-833b-4a966d466c04',
    '91b68d74-9071-448f-9cfb-a0771a907920',
    'e5c052df-f1e7-4911-b908-8f60074f4eff',
    'e8f2216e-cc50-4d5f-83da-e3a982aa864e',
    '67078e5d-8332-4f03-9213-da389f1159b8',
    '71da5b41-98e8-4e28-a475-56a3e72fdb35',
    '7509fead-e860-479c-a76d-ab2f7e313699',
    '2b83a117-adb1-4684-a0a1-b97145f58dbc',
    '031474d0-17df-4e77-8455-26c0144ed0ab',
    '6893cc64-183e-412b-99f7-d279433f8471',
    '938a39a0-8549-488f-b275-fcf7c10a4b55',
    'd4084998-1b89-47de-9f70-6ac85dd55540',
    'fe513618-f7e1-4c9b-b7a3-395ab2264cec',
    '2d9cef53-241c-431a-8465-b2e9ebf73887',
    '76fb6b8d-f5fe-43c8-a045-4d406b066718',
    'bf38a4c8-7fd5-4027-b723-28a344f19319',
    '5a5d5749-3226-4857-84da-2b0a621aa34f',
    'c7f2e567-54e9-46d4-bbdd-f96bc418d56d',
    'd3969733-2ca3-4fed-bb01-d989d41f1d6a',
    '02f9d697-979f-4a2f-b7e4-1db6a3350f18',
    '288829c6-ebca-4209-b7d0-8cb353626280',
    '463f3301-7a04-4de4-aa30-a54256fbef7f',
    '28dc0786-f780-4612-9ed2-d44c4713b5b1',
    'b6f7aa36-83eb-4497-bd2f-7971e9e83d15',
    'd16d85b6-fb40-484b-b358-5003ee488c07',
    '55321fce-3ae0-4f7c-992f-1457db590ca5',
    '97ff3293-c070-4db9-afe2-dc487d271733',
    '22433ee4-3d98-4f06-ab32-d9d5399f8806',
    '25224b26-bd68-4e3f-8c34-80d576cac86e',
    '55a378cb-9bfe-4858-a561-d7e63e6115fe',
    '4380937f-2676-4bed-aa05-c9b950cde1f1',
    '7c3e4760-6648-4101-b247-1c6e938f182b',
    '28edc3b8-9134-40a9-99d7-01ff25cd4c5a',
    '85de985e-e6af-4850-bc28-5e16043ed76d',
    '00a4ab38-56b5-4d22-8894-1d310e6d9681',
    'd115b1ce-077f-48e5-8bd3-6d83f640feb4',
    'b4933a9f-2817-45fa-a13a-222e05f3ad05',
    '79d80f95-17cd-4212-ab7a-baf78f1c92f1',
    '256f50d6-b07a-4781-8bdb-104e2bb0deed',
    '18dea04f-8be1-424c-9c8f-9d90acfd50a3',
    '438c5c91-22a8-49f0-ab87-de79fbb3bbc4',
    'd935c393-03b4-4e9a-9cc0-a813c0d0edf3',
    '2bbcc70e-7a75-465f-98c6-7baf6f56428c',
    'bfc6916b-7089-48a0-8bba-d5905b7d0c2a',
    '982b44d6-7499-4e13-8067-e85572d42400',
    '13cff94d-f49e-4f9e-9034-3f8a8b86ef52',
    'bf037fee-dc48-4f8d-beba-a0c7ce3703f5',
    '5afece19-82c0-40c4-bd30-3b30d4b70f09',
    '625323e3-6c7d-4de3-a37a-7c815010a8c0',
    'e0f395e2-2bdc-4e08-82ff-2133ebdcadc4',
    'f8b16167-ef9c-40ab-b931-6a9a3661080d',
    '93cd628d-4acb-4abb-865b-33bb801af06e',
    '7ab53c71-ac66-4bb5-aa13-71c5a4ec252a',
  ];
  return {
    ...jest.requireActual('../__demo__/shared/utils'),
    uuid: () => uuids[index++],
  };
});
