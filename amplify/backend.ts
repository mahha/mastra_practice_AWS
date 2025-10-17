import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import {ManagedPolicy} from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  auth,
});

// 認証済ユーザーのIAM Roleを取得
const authenticatedRole = backend.auth.resources.authenticatedUserIamRole;

// Bedrock用のAWSマネージドポリシーを追加
authenticatedRole.addManagedPolicy(
  ManagedPolicy.fromAwsManagedPolicyName('AmazonBedrockFullAccess')
);

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
// defineBackend({
//   auth,
//   data,
// });
