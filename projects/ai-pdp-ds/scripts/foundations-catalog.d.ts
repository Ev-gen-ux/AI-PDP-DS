export interface TokenRecord {
  id: string;
  category: string;
  primitive: boolean;
  cssVar: string;
  type: string;
  values: Record<string, string>;
  raw: Record<string, string>;
  sources: string[];
  direct: { file: string; line: number }[];
  candidates: { file: string; line: number }[];
  dependencies: string[];
}
export interface FoundationCatalog {
  sourceFiles: number;
  tokens: TokenRecord[];
}
export function createCatalog(root: string): Promise<FoundationCatalog>;
