// クライアントコンポーネントの宣言
"use client";

import { WorkflowFormData } from "@/app/types/workflow";
// WorkflowFormコンポーネントのProps(引数)の型定義
interface WorkflowFormProps {
    formData: WorkflowFormData;
    isLoading: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

// WorkflowフォームんぼUIコンポーネント
export const WorkflowForm = ({
    formData,
    isLoading,
    onInputChange,
    onSubmit,
}: WorkflowFormProps) => {
    // 入力項目に不足がないかチェック
    const isFormValid = formData.query.trim() !== "" &&
        formData.owner.trim() !== "" &&
        formData.repo.trim() !== "";

    return (
        // フォームを定義
        <form onSubmit={onSubmit} className="space-y-6">
            {/* Confluence検索クエリ欄 */}
            <div className="group">
                <label htmlFor="query"
                    className="block text-sm font-semibold
                        text-gray-700 mb-2 transition-colors group-hover:text-blue-600">
                    🔍 検索クエリ
                </label>
                <input type="text"
                    id="query"
                    name="query"
                    value={formData.query}
                    onChange={onInputChange}
                    placeholder="例: AIについての情報"
                    className="w-full px-4 py-3 border-2 border-gray-200
                        rounded-xl shadow-sm transition-all duration-200
                        focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-300"
                    required
                />
            </div>
            {/* GitHubリポジトリ情報欄 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                    <label htmlFor="owner"
                        className="block text-sm font-semibold
                        text-gray-700 mb-2 transition-colors group-hover:text-blue-600">
                        👤 GitHub オーナー
                    </label>
                    <input type="text"
                        id="owner"
                        name="owner"
                        value={formData.owner}
                        onChange={onInputChange}
                        placeholder="例: mastra-inc"
                        className="w-full px-4 py-3 border-2 border-gray-200
                        rounded-xl shadow-sm transition-all duration-200
                        focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-300"
                        required
                    />
                </div>
                {/* GitHub リポジトリ名 */}
                <div className="group">
                    <label htmlFor="repo"
                        className="block text-sm font-semibold
                        text-gray-700 mb-2 transition-colors group-hover:text-blue-600">
                        Repository
                    </label>
                    <input type="text"
                        id="repo"
                        name="repo"
                        value={formData.repo}
                        onChange={onInputChange}
                        placeholder="例: mastra-practice"
                        className="w-full px-4 py-3 border-2 border-gray-200
                        rounded-xl shadow-sm transition-all duration-200
                        focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-300"
                        required
                    />
                </div>
            </div>
            {/* フォームの送信ボタン (ワークフローの実行ボタン) */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isLoading || !isFormValid}
                    className={`
                        px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform
                        ${isFormValid && !isLoading ?
                            'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <svg className="anmate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            </svg>
                            処理中。。。
                        </div>
                    ) : (
                        <span className="flex items-center">
                            ワークフローの実行 ✨
                        </span>
                    )}
                </button>
            </div>
        </form>
    );
};