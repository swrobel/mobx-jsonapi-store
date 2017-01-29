import IDictionary from './interfaces/IDictionary';
import IJsonApiRecord from './interfaces/IJsonApiRecord';

/**
 * Iterate trough object keys
 *
 * @param {Object} obj - Object that needs to be iterated
 * @param {Function} fn - Function that should be called for every iteration
 */
function objectForEach(obj: Object, fn: Function): void {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      fn(key);
    }
  }
}

/**
 * Iterate trough one item or array of items and call the defined function
 *
 * @export
 * @template T
 * @param {(Object|Array<Object>)} data - Data which needs to be iterated
 * @param {Function} fn - Function that needs to be callse
 * @returns {(T|Array<T>)} - The result of iteration
 */
export function mapItems<T>(data: Object|Array<Object>, fn: Function): T|Array<T> {
  return data instanceof Array ? data.map((item) => fn(item)) : fn(data);
}

/**
 * Flatten the JSON API record so it can be inserted into the model
 *
 * @export
 * @param {IJsonApiRecord} record - original JSON API record
 * @returns {IDictionary<any>} - Flattened object
 */
export function flattenRecord(record: IJsonApiRecord): IDictionary<any> {
  const data: IDictionary<any> = {
    id: record.id,
    type: record.type,
  };

  objectForEach(record.attributes, (key) => {
    data[key] = record.attributes[key];
  });

  objectForEach(record.relationships, (key) => {
    if (record.relationships[key].links) {
      data[`${key}Links`] = record.relationships[key].links;
    }
  });

  return data;
}
