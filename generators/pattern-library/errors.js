var errors = {
    'configDestMissing': 'Destination is required. Please add the `dest` option to your settings object as a path to your destination or `none`.',
    'configSectionArrayMissing': 'A section array of one or more objects is required. Please add a section object to the sections array.',
    'configSectionObjectMissing': 'Section objects are required in the sections array. Please add a section object to the section array.',
    'configSectionTitleMissing': 'Title is required. Please add a `title` option to section object',
    'configSectionFileMissing': 'Files is required. Please add a `files` option to section object',
    'configPrefixAssetsMissing': '`Prefix.assets` are required in order to use `prefix.selector`. Please add `prefix.selector` to the settings object if you wish to add a prefixed selector.',
    'configTemplateOptionsMissing': 'Template options are required in order to use `prefix.selector`. Please add a template.layout, template.partials or template.assets to the settings object if you wish to add a prefixed selector.'
};
module.exports = errors;