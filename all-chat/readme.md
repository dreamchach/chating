## error

```bash
export const addUser = ({id, username, room}) => {
^^^^^^

SyntaxError: Unexpected token 'export'
```

해결
```javascript
const addUser = ({id, username, room}) => {
...

module.exports = {
    addUser,
    getUsersInRoom,
    getUser,
    removeUser
}
```

```bash
Failed to find a valid digest in the 'integrity' attribute for resource 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js' with computed SHA-512 integrity '+H4iLjY3JsKiF2V6N366in5IQHj2uEsGV7Pp/GRcm0fn76aPAk5V8xB6n8fQhhSonTqTXs/klFz4D0GIn6Br9g=='. The resource has been blocked.
```

cdn script태그의 'integrity' 속성으로 인한 문제.
해당 속성을 지워주면 된다.