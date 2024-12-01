import yaml from 'yamljs';
import fm from 'front-matter';
import marked from 'marked';
import { validate as validate } from 'jsonschema';
import parseMarkdown from './parse-markdown.js';
import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { selectAll } from 'unist-util-select';
import { u } from 'unist-builder';

/**
 * Validate the options object
 * @param {object} options
 */
function validateOptions(options) {
  const result = validate(options, {
    type: 'object',
    properties: {
      'hiddenColumns': {
        type: 'array',
        items: { type: 'string' }
      },
      'startedColumns': {
        type: 'array',
        items: { type: 'string' }
      },
      'completedColumns': {
        type: 'array',
        items: { type: 'string' }
      },
      'sprints': {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            'start': { type: 'date' },
            'name': { type: 'string' },
            'description': { type: 'string' }
          },
          required: ['start', 'name']
        }
      },
      'defaultTaskWorkload': { type: 'number' },
      'taskWorkloadTags': {
        type: 'object',
        patternProperties: {
          '^[\w ]+$': { type: 'number' }
        }
      },
      'columnSorting': {
        type: 'object',
        patternProperties: {
          '^[\w ]+$': {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                'field': { type: 'string' },
                'filter': { type: 'string' },
                'order': {
                  type: 'string',
                  enum: [
                    'ascending',
                    'descending'
                  ]
                }
              },
              required: ['field']
            }
          }
        }
      },
      'taskTemplate': { type: 'string' },
      'dateFormat': { type: 'string' },
      'customFields': {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            'name': { type: 'string' },
            'type': {
              type: 'string',
              enum: [
                'boolean',
                'string',
                'number',
                'date'
              ]
            },
            'updateDate': {
              type: 'string',
              enum: [
                'always',
                'once',
                'none'
              ]
            }
          },
          required: ['name', 'type']
        }
      },
      'views': {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            'name': { type: 'string' },
            'filters': { type: 'object' },
            'columns': {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  'name': { type: 'string' },
                  'filters': { type: 'object' },
                  'sorters': {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        'field': { type: 'string' },
                        'filter': { type: 'string' },
                        'order': {
                          type: 'string',
                          enum: [
                            'ascending',
                            'descending'
                          ]
                        }
                      },
                      required: ['field']
                    }
                  }
                },
                required: ['name']
              },
              minItems: 1
            },
            'lanes': {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  'name': { type: 'string' },
                  'filters': { type: 'object' }
                },
                required: ['name']
              }
            }
          },
          required: ['name']
        }
      }
    }
  });
  if (result.errors.length) {
    throw new Error(result.errors.map(error => `\n${error.property} ${error.message}`).join(''));
  }
}

/**
 * Validate the columns object
 * @param {object} columns
 */
function validateColumns(columns) {
  const result = validate(columns, {
    type: 'object',
    patternProperties: {
      '^[\w ]+$': {
        type: 'array',
        items: { type: 'string' }
      }
    }
  });
  if (result.errors.length) {
    throw new Error(result.errors.map(error => `${error.property} ${error.message}`).join('\n'));
  }
}

export default {

  /**
   * Convert markdown into an index object
   * @param {string} data
   * @return {object}
   */
  md2json(data) {
    let options = {};
    // Check data type
    ({ options, data } = initializeIndexData(data, options));

    if (options.indexVersion === 2) {
      return this.md2json_v2(data, options);
    } else {
      return this.md2json_v1(data, options);
    }
  },

  /**
   * Convert markdown into an index object
   * @param {string} data
   * @return {object}
   */
  md2json_v1(data, options) {
    let name = '', description = '', columns = {};
    try {
      // Parse markdown to an object
      let index = null;
      try {
        index = parseMarkdown(data);
      } catch (error) {
        throw new Error(`invalid markdown (${error.message})`);
      }

      // Check resulting object
      const indexHeadings = Object.keys(index);
      if (indexHeadings.length === 0 || indexHeadings[0] === 'raw') {
        throw new Error('data is missing a name heading');
      }

      // Get name
      name = indexHeadings[0];

      // Get description
      description = name in index ? index[name].content.trim() : '';

      // Parse options
      // Options will be serialized back to front-matter, this check remains here for backwards-compatibility
      if ('Options' in index) {

        // Get embedded options and make sure it's an object
        const embeddedOptions = yaml.parse(index['Options'].content.trim().replace(/```(yaml|yml)?/g, ''));
        if (typeof embeddedOptions !== 'object') {
          throw new Error('invalid options content');
        }

        // Merge with front matter options
        options = Object.assign(options, embeddedOptions);
      }
      validateOptions(options);

      // Parse columns
      const columnNames = Object.keys(index).filter(column => ['raw', 'Options', name].indexOf(column) === -1);
      if (columnNames.length) {
        columns = Object.fromEntries(columnNames.map(columnName => {
          try {
            return [
              columnName,
              index[columnName].content
                ? marked.lexer(index[columnName].content)[0].items.map(item => item.tokens[0].tokens[0].text)
                : []
            ];
          } catch (error) {
            throw new Error(`column "${columnName}" must contain a list`);
          }
        }));
      }
    } catch (error) {
      throw new Error(`Unable to parse index: ${error.message}`);
    }

    // Assemble index object
    return { name, description, options, columns };
  },
  
  /**
   * Convert markdown into an index object
   * @param {string} data
   * @return {object}
   */
  md2json_v2(data, options) {
    let name = '', description = '', columns = {};
    try {
      // Parse markdown to an object
      let indexTree = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkStringify)
        .parse(data, { entities: 'escape' });

      // Get name and descriptions
      name = selectAll('heading[depth="1"] text', indexTree)?.map(n => n.value).join("\n");
      description = selectAll('heading[depth="1"] ~ *:not(table) text', indexTree)?.map(n => n.value).join("\n");

      validateOptions(options);

      // Parse columns
      const [ headings, ...rows ] = selectAll('tableRow', indexTree);
      const columnNames = selectAll("tableCell text", headings)?.map(cell => cell.value);
      if (columnNames.length) {
        columns = Object.fromEntries(columnNames.map((columnName, columnIndex) => {
          try {
            return [
              columnName,
              selectAll(`tableCell:nth-child(${columnIndex + 1}) text`, { children: rows }).map(c => c.value)
            ];
          } catch (error) {
            console.log(error)
            throw new Error(`column "${columnName}" must contain a list`);
          }
        }));
      }
    } catch (error) {
      console.log(error)
      throw new Error(`Unable to parse index: ${error.message}`);
    }

    // Assemble index object
    return { name, description, options, columns };
  },

  /**
   * Convert an index object into markdown
   * @param {object} data
   * @param {boolean} [ignoreOptions=false]
   * @return {string}
   */
  json2md(data, ignoreOptions = false) {
    let result;
    try {
      result = this.initializeIndexFile(data, ignoreOptions);

      // Check columns
      if (!('columns' in data)) {
        throw new Error('data object is missing columns');
      }
      validateColumns(data.columns);

      // Add columns
      for (let column in data.columns) {
        result.push(
          `## ${column}`,
          data.columns[column].map(task => `- [${task}](tasks/${task}.md)`).join('\n')
        );
      }
    } catch (error) {
      throw new Error(`Unable to build index: ${error.message}`);
    }

    // Filter empty lines and join into a string
    return `${result.filter(l => !!l).join('\n\n')}\n`;
  },


  /**
   * Convert an index object into markdown
   * @param {object} data
   * @param {boolean} [ignoreOptions=false]
   * @return {string}
   */
  json2md_v2(data, ignoreOptions = false) {
    const result = this.initializeIndexFile(data, ignoreOptions);

    const table = u("table", []);

    // Add columns
    table.children.push(
      u("tableRow", Object.keys(data.columns).map(value => u("tableCell", [u("text", value )])))
    )

    for (let i = 0; i < Math.max(...Object.values(data.columns).map(c => c.length)); i++) {        
      table.children.push(u(
        "tableRow",
        Object.values(data.columns)
          .map(c => c[i] 
            ? u("link", { url: `tasks/${c[i]}.md` }, [u("text", c[i])])
            : undefined
          )
          .map(value => u("tableCell", value ? [value] : []))
      ))
    }

    const strigifiedTable = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkStringify)
      .stringify(table, { entities: 'escape' });

    return  `${result.filter(l => !!l).join('\n\n')}\n\n${strigifiedTable}\n` 
  },

  initializeIndexFile(data, ignoreOptions) {
    const result = []

    // Check data type
    if (!data) {
      throw new Error('data is null or empty');
    }
    if (typeof data !== 'object') {
      throw new Error('data is not an object');
    }

    // Check required fields
    if (!('name' in data)) {
      throw new Error('data object is missing name');
    }

    // Add options as front-matter content if present and not ignoring
    if ('options' in data && data.options !== null && !ignoreOptions) {
      validateOptions(data.options);
      if (Object.keys(data.options).length) {
        result.push(
          `---\n${yaml.stringify(data.options, 4, 2).trim()}\n---`
        );
      }
    }

    // Add name and description
    result.push(`# ${data.name}`);
    if ('description' in data) {
      result.push(data.description);
    }

    return result;
  }
};
function initializeIndexData(data, options) {
  if (!data) {
    throw new Error('data is null or empty');
  }
  if (typeof data !== 'string') {
    throw new Error('data is not a string');
  }

  // Get YAML front matter if any exists
  if (fm.test(data)) {
    ({ attributes: options, body: data } = fm(data));

    // Make sure the front matter contains an object
    if (typeof options !== 'object') {
      throw new Error('invalid front matter content');
    }
  }

  return { options, data };
}

