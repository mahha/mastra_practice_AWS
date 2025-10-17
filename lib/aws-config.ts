import { AuthFetchAuthSessionServer } from "./amplify-server-utils";

export async function getBedrockModel() {
    try {
        const { createAmazonBedrock } = await import("@ai-sdk/amazon-bedrock");
        // BedrockモデルのIDとリージョンを設定
        const modelID = "us.anthropic.claude-3-7-sonnet-20250219-v1:0";
        const region = process.env.AWS_REGION || "us-west-2";
        // 認証セッションを取得
        const session = await AuthFetchAuthSessionServer();
        if (!session || !session.credentials) {
            throw new Error("Failed to get authentication session");
        }
        // Bedrockクライアントを作成
        const bedrock = createAmazonBedrock({
            region,
            accessKeyId: session.credentials.accessKeyId,
            secretAccessKey: session.credentials.secretAccessKey,
            sessionToken: session.credentials.sessionToken,
        });
        // モデルを取得
        const model = bedrock(modelID);
        return model;
    } catch (error) {
        console.error("Error getting Bedrock model:", error);
        throw error;
    }
}