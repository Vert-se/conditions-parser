const FIELD = 'field'
const VALUE = 'value'
const OP = 'operator'
const STARTSWITH_OP = 'starts_with'
const ENDSWITH_OP = 'ends_with'
const CONTAINS_OP = 'contains'
const REGEXP_OP = 'regexp'
const IN_OP = 'in'
const LOGICAL_OPS = ['OR', 'AND']
const CAPTION_FIELD = 'caption'
const MENTION_FIELD = 'mention'
const TAG_FIELD = 'tag'

const logicalParser = {

  buildCondition(cond) {
    let field = cond[FIELD]
    let operator = cond[OP]
    let value = cond[VALUE]

    switch(field) {

      case MENTION_FIELD:
        field = CAPTION_FIELD
        operator = REGEXP_OP
        value = `@${value}(?!\\w)`
        break

      case TAG_FIELD:
        field = CAPTION_FIELD
        operator = REGEXP_OP
        value = `#${value}(?!\\w)`
        break

      default:
    }

    switch(operator) {

      case STARTSWITH_OP:
        operator = 'ILIKE'
        value = `${value}%`
        break

      case ENDSWITH_OP:
        operator = 'ILIKE'
        value = `%${value}`
        break

      case CONTAINS_OP:
        operator = 'ILIKE'
        value = `%${value}%`
        break

      case REGEXP_OP:
        operator = '~*'
        value = value
        break

      case IN_OP:
        operator = 'IN'
        value = value.map(this.castType)
        break

      default:
    }    
    return `${field} ${operator} ${this.castType(value)}`
  },

  encapsulate(part) {
    return `(${typeof part === 'string' ? part : this.parse(part)})`
  },

  castType(value) {
    if(typeof value === 'string') return `'${value}'`
    if(value instanceof Array) return `(${value})`
    return value
  },

  parse(data) {
    if(!(data instanceof Array)) throw new Error('Bad JSON structure')
    const [logicalOp, ...conds] = data
    if(!(~LOGICAL_OPS.indexOf(logicalOp))) {
      throw new Error(`Bad logical operator (${logicalOp})`)
    }
    const parts = conds.map((cond) => {
      if(cond instanceof Array) {
        return this.encapsulate(cond)
      }
      return this.buildCondition(cond)

    })

    return parts.join(` ${logicalOp} `)
  }
}