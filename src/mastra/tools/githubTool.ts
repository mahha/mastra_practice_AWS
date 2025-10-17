import { createTool } from "@mastra/core/tools"
import { z } from "zod"
import { number } from "zod/v4";

// GitHubのAPIを実行するためのトークンは環境変数から取得
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""

export const githubCreateIssueTool = createTool({
    id: "githubCreateIssue",
    description: "GitHub丈で複数のIssueを作成します.バグ報告、機能要求、質問などに使用できます。",
    inputSchema: z.object({
        owner: z
            .string()
            .describe("リポジトリの所有者名(ユーザー名またはorganization名)"),
        repo: z.string().describe("リポジトリ名"),
        // issuesはタイトルと本文を持ったオブジェクトが入る配列
        issues: z.array(z.object({
            title: z.string().describe("Issueのタイトル"),
            body: z.string().optional().describe("Issueの本文・詳細説明"),
        })).describe("作成するIssueのリスト"),
    }),
    outputSchema: z.object({
        success: z.boolean(),
        // createdissuesも配列
        createdIssues: z.array(z.object({
            issueNumber: z.number().optional(),
            issueUrl: z.string().optional(),
            title: z.string(),
        })),
        errors: z.array(z.string()).optional(),
    }),
    execute: async ( {context} ) => {
        console.log("context", context);
        const { owner, repo, issues } = context;
        const createdIssues: Array<{ issueNumber?: number; issueUrl?: string; title: string }> = [];
        const errors: string[] = [];

        for (const issue of issues) {
            try {
                // issue作成APIを実行
                const response = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/issues`,
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/vnd.github+json",
                            Authorization: `Bearer ${GITHUB_TOKEN}`,
                            "X-GitHub-Api-Version": "2022-11-28",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            title: issue.title,
                            body: issue.body,
                        }),
                    }
                );
                // エラーハンドリング
                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = `GitHub API エラー: ${response.status} - ${errorData.message || "Unkown error"}`;
                    // 作成失敗したissueはerrorに追加
                    errors.push(`Failed to create issue: "${issue.title}":${errorMessage}`);
                    continue;
                }
                // issue作成に成功した場合はcreatedIssuesに追加
                const issueData = await response.json();
                createdIssues.push({
                    issueNumber: issueData.number,
                    issueUrl: issueData.html_url,
                    title: issueData.title,
                });
            } catch (error) {
                const errorMessage = `リクエスト失敗: ${error instanceof Error ? error.message : "Unknown error"} `;
                errors.push(`Error creating issue: "${issue.title}":${ errorMessage } `);
            }
        }
        return {
            success: createdIssues.length > 0,
            createdIssues,
            errors,
        };
    }
});