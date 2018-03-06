# Conditions parser

Serializa uma arvore de condiicoes formatada em JSON para SQL.

### Exemplo Payload
```JSON
[
  "AND",
  [
    "OR",
    { "field": "location", "value": "Bar", "operator": "regexp" },
    { "field": "location", "value": "Restaurante", "operator": "regexp" },
    { "field": "location", "value": [521322034717812, 1741000089494343, 645304445627169], "operator": "in" }
  ],
  [
    "OR",
    { "field": "tag", "value": "instaday", "operator": "=" },
    { "field": "mention", "value": "instagram", "operator": "=" },
    [
      "AND",
      { "field": "caption", "value": "bom dia", "operator": "contains" },
      { "field": "caption", "value": "link na bio", "operator": "ends_with" }
    ]
  ]
]
```
  - Type some Markdown on the left
  - See HTML in the right
  - Magic

### Uso
```Javascript
    parser = require('conditions-parser')
    logicalParser.parse(data)
```

### Operadores
operador | Exemplo output
--- | ---
*= != > <* | `name = 'john'` `value > 20`|
*not*| `name IS NOT null`|
*starts_with*| `desc ILIKE 'Hello%'`|
*ends_with*| `desc ILIKE '%Good Bye'`|
*contains*| `desc ILIKE '%in the middle of%'`|
*regexp*| `desc ~* '[ab]c?'`|
*in*| `number IN (1, 2, 3, 4, 5)`|