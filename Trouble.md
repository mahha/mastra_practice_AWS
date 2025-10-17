# Chapter5: Mastra
## Case1: GitHubのツール定義でexecuteが型エラーになる
- 症状: execute:が型変換でLintエラーになる
- 原因: outputSchemaで宣言している変数の型と、executeの型が異なっていた

```ts
    outputSchema: z.object({
        success: z.boolean(),
        // createdissuesも配列
        createdIssues: z.array(z.object({
            issueNumber: z.number().optional(),
            issueUrl: z.number().optional(), // ここでTypoしてNumberにしている
            title: z.string(),
        })),
        errors: z.array(z.string()).optional(),
    }),
    execute: async ( {context} ) => {
        console.log("context", context);
        const { owner, repo, issues } = context;
        const createdIssues: Array<{ 
                issueNumber?: number; 
                issueUrl?: string; // ここでstring受けしているので型エラーになる
                title: string 
            }> = [];
```

## Case2: AWS sandboxでワークフローを実行するとAuthが取れない
- 現象: 実行時に以下のエラーが出てログインした認証が利用できない
```
Error getting Bedrock model: Error: Failed to get authentication session
    at getBedrockModel (lib/aws-config.ts:12:18)
    at async eval (src/mastra/agents/assistantAgent.ts:16:14)
  10 |         const session = await AuthFetchAuthSessionServer();
  11 |         if (!session || !session.credentials) {
> 12 |             throw new Error("Failed to get authentication session");
     |                  ^
  13 |         }
  14 |         // Bedrockクライアントを作成
  15 |         const bedrock = createAmazonBedrock({
```
- 原因: importする階層を間違えていた。何故かエラーチェックに引っ掛からないが仕様違い？
@lib/amplify-server-utils.ts  
誤)import { fetchAuthSession } from "aws-amplify/auth";  
正)import { fetchAuthSession } from "aws-amplify/auth/server";  
- 対策: 上記のようにimportのパスを修正すると動作した
