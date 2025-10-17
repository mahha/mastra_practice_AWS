# Chapter5 : Mastra
## Chapter5-2 : Mastraの基本
### 基本形
以下の要素を組み立てる
- createTool
- createStep
- createWorkFlow
#### createToolの基礎
ツールの利用方法を定義する  
id, description, inputSchema, outputSchema, executeを定義する  
descriptionが具体的なことが重要  
    description: "Confluenceでページを検索します(CQLクエリ対応)"
#### createStepの基礎
そのステップで実行する事を定義する  
id, inputSchema, outputSchema, executeを定義する  
**createTool()のインスタンスを単独のステップにして必ず実行する**ことも可能  
AIを実行するときはagent.generateを非同期実行する (awaitを使う)
#### createWorkFlowの基礎
ワークフローを定義する  
id, inputSchema, outputSchema, executeを定義する  
createWorkFlow().then.then... でチェーン定義も可能

## Chapter5-3 : Next.jsとの連係
### Route Handler
app/の下の任意のディレクトリにroute.tsを配置するとAPIアクセスポイントになる。
例えば
- app/api/workflow/execute/route.ts を作成する
- /api/workflow/execute がHTTPのGET/POSTなどのエンドポイントになる
```ts
export async function POST(request: NextRequest) {
// POST時の内容
}
```
### use Client
Next.js 13以降ではサーバーサイドレンダリングが基本になっている。
この為、フォームなどインタラクティブ要素があるものは先頭に "use client"を付けてクライアント実行を明示する
### Component
ワークフローステップに沿ってコンポーネントしておくと良い
@/app/components/
- WorkflowInstrunctions.tsx : 案内
- WorkflowForm.tsx : 入力フォーム ※実行自体はonSubmit引数にハンドラを受け取る.ハンドラ自体はpages.tsx
- WorkflowResults.tsx : 検索結果をmapで表示する
@/app/types/workflow.ts
Next.js -> mastra のインタフェースを WorkflowFormData で定義
mastra -> Next.js のインタフェースを WorkflowResult で定義
@/app/pages.tsx
- workflow.tsで定義したインタフェースをuseStateでNext.jsの状態変数として定義する
- onInputChangeのハンドラで状態変数を更新する。以下のハンドラで複数フォームを一括更新できる
form側で各<input>にname="query"などの名称を付けておくこと
```ts
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 入力フィールドの名前の値を取得
    const { name, value } = e.target;
    // フォームデータの状態を更新
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
```
- onSubmitのハンドラでresult状態変数をクリアして try {fetch}でroute.tsにアクセスする
- インタフェースの為に **NextRequest**, **NextResponse**が用意されている. JSONが便利
- fetchを非同期実行してawaitした結果を状態変数resultに渡し、resultを引数に持つ
WorkflowResultコンポーネントに渡す事で結果が出次第表示される


## Chapter5-4 : AWSへデプロイ
### デプロイ環境の作成
1. amplify系をnpm install  
2. npm create amplify  
3. amplify/backend.tsを設定してcongnitoの認証をBedrockに紐づける  
@ amplify/backend.ts
4. npx ampx sandbox でAWS側にsandboxを作成 (分単位で時間がかかる)
この段階でACCESS_KEYなどを設定する
### Cognitoの利用
1. 上記のsandboxで作成されたamplify_outputs.jsonをインポートして  
サーバーランナーをインスタンス化する
```ts
import outputs from "../amplify_outputs.json"
createServerRunner({config:outputs})
```
### Bedrockとの紐づけ
@lib/aws-config.ts  
セッションの認証を参照してaccessKeyIdなどを取得してbedrockクライアントを生成する
```ts
    try {
        const { createAmazonBedrock } = await import("@ai-sdk/amazon-bedrock");
            // Bedrockクライアントを作成
        const bedrock = createAmazonBedrock({
            region,
            accessKeyId: session.credentials.accessKeyId,
            secretAccessKey: session.credentials.secretAccessKey,
            sessionToken: session.credentials.sessionToken,
        });
    }
```
### 認証プロバイダの作成
@app/providers.tsx  
@aws-amplify/ui-reactライブラリで apmlify_outputs.jsonをインポートし
<Authenticator>タグで全体を囲む

```tsx
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs, {ssr:true});

export const Providers = ({children}: {children: React.ReactNode}) => {
    return (
        <Authenticator>
            {children}
        </Authenticator>
    );
};
```

