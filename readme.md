# lie-parallel

## API

`npm install lie-parallel`

`var parallel = require('lie-parallel');`

###parallel

```javascript
parallel(array of values or promises (or promise for such)[, number, function])
```

A cross between lie-iter and lie-map, resolves the promises in parallel but only n of them at a time. Omitting the number is equivalent to map and setting it to 1 is the equivalent of lie-iter. Returns an array of the values produced or the first error.  If function is omitted it just resolves the promises sequentially (aka default function is `function(a){return a}`)

## License

  MIT
