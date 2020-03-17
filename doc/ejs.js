
const supportType = ['string', 'number', 'array', 'object', 'boolean', 'integer']

const json = {
  '*id': 'string',
  '*name': {
    'type': 'string',
    'enum': [
      'tom',
      'jay'
    ],
    'minLength': 1,
    'maxLength': 10
  },
  '*images': [
    {
      '*id': 'number',
      'names': {
        'type': 'array',
        'title': 'Images Collections.',
        'items': {
          '*id': 'string',
          '*name': 'string'
        }
      }
    }
  ],
  'abc': {
    'a': {
      'x': 'string',
      'y': {
        'type': 'number',
        'minimum': 400000,
        'maximum': 900000
      }
    }
  }
}

try {
  let result = ejs(json)
  result = JSON.stringify(result, null, 2)
  console.log(result)
} catch (err) {
  console.log(err)
}

function parse(json, schema) {
  if (Array.isArray(json)) {
    handleArray(json, schema)
  } else if (isPlainObject(json)) {
    handleObject(json, schema)
  } else {
    schema.type = getType(json)
  }
}

function ejs(data) {
  var JsonSchema = {}
  parse(data, JsonSchema)
  return JsonSchema
}

function getType(type) {
  if (!type) type = 'string'
  if (supportType.indexOf(type) !== -1) {
    return type
  }
  return typeof type
}

function handleArray(arr, schema) {
  schema.type = 'array'
  var props = schema.items = {}
  parse(arr[0], props)
}

function handleObject(json, schema) {
  if (isSchema(json)) {
    return handleSchema(json, schema)
  }
  schema.type = 'object'
  schema.required = []
  var props = schema.properties = {}
  for (var key in json) {
    var item = json[key]
    var curSchema = props[key] = {}
    if (key[0] === '*') {
      delete props[key]
      key = key.substr(1)
      schema.required.push(key)
      curSchema = props[key] = {}
    }
    parse(item, curSchema)
  }
}

function isSchema(object) {
  return supportType.indexOf(object.type) !== -1
}
function handleSchema(json, schema) {
  Object.assign(schema, json)
  if (schema.type === 'object') {
    delete schema.properties
    parse(json.properties, schema)
  }
  if (schema.type === 'array') {
    delete schema.items
    schema.items = {}
    parse(json.items, schema.items)
  }
}

function isPlainObject(obj) {
  return obj ? typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype : false
}
