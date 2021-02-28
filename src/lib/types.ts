export type CommandOpts = {
  cwd: string;
  configFilePath?: string;
};

export type CreatedPathsBase = {
  // "tsx" stands for `.ts(x)`s generated by GraphQL code generator as intermediate artifacts
  tsxRelPath: string;
  tsxFullPath: string;
  // "dts" stands for `.d.ts`s generated by graphql-let
  dtsRelPath: string;
  dtsFullPath: string;
};

export type CodegenContextBase<
  type extends 'document-import' | 'schema-import' | 'gql-call' | 'load-call'
> = {
  type: type;
  gqlHash: string;
  // If true, cache is fresh, so we don't need to generate new one.
  skip: boolean;
};

/**
 * Assumes `.graphql`s and `.graphqls`s
 */
export type FileCreatedPaths = CreatedPathsBase & {
  gqlRelPath: string;
  gqlFullPath: string;
};

/**
 * Assumes `gql(`query {}`)` calls in `.ts(x)`s
 */
export type LiteralCreatedPaths = CreatedPathsBase & {
  srcRelPath: string;
  srcFullPath: string;
};

export type FileCodegenContext = CodegenContextBase<'document-import'> &
  FileCreatedPaths;
export type FileSchemaCodegenContext = CodegenContextBase<'schema-import'> &
  FileCreatedPaths;

export type LiteralCodegenContext = {
  type: 'gql-call';
  gqlContent: string;
  resolvedGqlContent: string;
  strippedGqlContent: string;
} & CodegenContextBase<'gql-call'> &
  LiteralCreatedPaths;

export type LoadCodegenContext = {
  type: 'load-call';
  gqlPathFragment: string; // load(gqlPathFragment)
  srcRelPath: string;
  srcFullPath: string;
  gqlRelPath: string;
  gqlFullPath: string;
} & CodegenContextBase<'load-call'> &
  CreatedPathsBase;

export type CodegenContext =
  | FileCodegenContext
  | FileSchemaCodegenContext
  | LiteralCodegenContext
  | LoadCodegenContext;

export function isLiteralContext({ type }: CodegenContext): boolean {
  return type === 'gql-call';
}

export function isAllSkip(codegenContext: CodegenContext[]): boolean {
  return codegenContext.findIndex(({ skip }) => !skip) != 0;
}
