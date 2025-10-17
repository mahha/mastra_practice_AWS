import {Agent} from "@mastra/core/agent"

// ローカルバージョン
// import {bedrock} from "@ai-sdk/amazon-bedrock"

// // エージェント定義
// export const assistantAgent = new Agent({
//     name: "assistant",
//     instructions: "あなたは親切で優秀なサポートアシスタントです。ユーザーからの質問に対して、適切な回答を提供してください。",
//     model: bedrock("us.anthropic.claude-3-7-sonnet-20250219-v1:0"),
// });

// Amplifyバージョン
import { getBedrockModel } from "../../../lib/aws-config";

const model = await getBedrockModel();

export const assistantAgent = new Agent({
    name: "assistant",
    instructions: "あなたは親切で優秀なサポートアシスタントです。ユーザーからの質問に対して、適切な回答を提供してください。",
    model: model,
});