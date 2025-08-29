export const getAllDynamoScriptsPropsQuery = `
      *[_type == 'dynamoscript'] | order(_createdAt desc) {
      _id,
    }`;
