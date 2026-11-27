declare module 'virtual:foundation-catalog' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports -- Keep this ambient declaration a script, not a module augmentation.
  const catalog: import('../../scripts/foundations-catalog').FoundationCatalog;
  export default catalog;
}
