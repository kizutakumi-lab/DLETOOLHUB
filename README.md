# DLE社内ツールポータル (DLE TOOL PORTAL)

DLE社内で利用している各種Webツールを一元管理し、社員が迷わず迅速にアクセスできるダッシュボード型Webアプリケーションです。

---

## 📌 1. アプリ概要

社内に分散する各種ツール（勤怠管理、交通費清算、案件管理、営業ツールなど）をコンパクトなカード形式で一覧表示し、新入社員でも一目で用途が分かるポータルサイトです。

### 主な特徴
- **Google OAuth認証 (`@dle.jp` 限定)**: ドメイン検証により社外からのアクセスをシャットアウト。未ログイン状態ではアプリ内部情報を一切非公開。
- **コンパクトなモダンダッシュボードUI**: PC画面 (1920×1080等) でスクロール量を抑え、横4〜5列のグリッドで多くのツールを一覧表示。
- **リアルタイム検索 & カテゴリフィルター**: ツール名、用途、説明文をリアルタイム検索。カテゴリ別の絞り込みにも対応。
- **お気に入り機能 (★)**: ユーザー単位でお気に入りツールを上部エリアに登録可能。
- **ツール管理 (CRUD & 表示順)**: 管理者権限によるツールの追加・編集・削除（誤削除防止ダイアログ付き）・順序並び替え。
- **掲示板風メモ欄**: バグ報告、ツール追加リクエスト、改修報告などの社内連絡掲示板（種別バッジ付き、投稿者・管理者の編集/削除機能）。

---

## 🛠️ 2. 使用技術

- **フロントエンド**: Next.js 14 (App Router), React 18, TypeScript
- **スタイリング**: Tailwind CSS, Lucide Icons
- **認証**: NextAuth.js (Google OAuth Provider, `@dle.jp` ドメインフィルタリング)
- **データベース**: Supabase (PostgreSQL) / ローカルフォールバック機能付き
- **デプロイ**: Vercel

---

## 🚀 3. ローカル起動方法

### 手順
1. **リポジトリのクローン・移動**
   ```bash
   cd d:\アンチグラビティ_ツール大全
   ```

2. **依存パッケージのインストール**
   ```bash
   npm install
   ```

3. **環境変数の設定**
   `.env.example` をコピーして `.env.local` を作成します。
   ```bash
   cp .env.example .env.local
   ```

4. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   ブラウザで `http://localhost:3000` にアクセスします。

> **💡 テストログイン機能について**:
> `.env.local` 内の `NEXT_PUBLIC_ENABLE_MOCK_AUTH=true` が有効な場合、Google OAuthキー未設定の環境でもログイン画面から `@dle.jp` のテストアカウントで即時にログイン・全機能のテストが可能です。

---

## 🗄️ 4. Supabase 設定方法

1. [Supabase](https://supabase.com/) にサインインし、新規プロジェクトを作成します。
2. **SQL Editor** を開き、プロジェクト直下にある `supabase_schema.sql` の内容を貼り付けて実行します。
   - `tools` (ツール一覧テーブル)
   - `posts` (掲示板メモテーブル)
   - `favorites` (お気に入りテーブル)
   - 初期シードデータ (14個の標準ツールデータ)
   が作成されます。
3. **Project Settings** ＞ **API** から以下の情報を取得し、環境変数に設定します。
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

---

## 🔑 5. Google OAuth 設定方法 (`@dle.jp` 限定認証)

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセスし、プロジェクトを選択/作成します。
2. **APIs & Services** ＞ **OAuth consent screen** で同意画面を作成します。
3. **Credentials** ＞ **Create Credentials** ＞ **OAuth client ID** を選択します。
   - **Application type**: Web application
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `https://<your-vercel-domain>.vercel.app`
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://<your-vercel-domain>.vercel.app/api/auth/callback/google`
4. 発行された `Client ID` と `Client Secret` を環境変数 `GOOGLE_CLIENT_ID` と `GOOGLE_CLIENT_SECRET` に設定します。

> **セキュリティ**: アプリケーション側（NextAuth `signIn` コールバックおよびAPI Route）で、メールアドレスが `@dle.jp` で終わるかどうかの検証を常に行うため、他ドメインのGoogleアカウントでのサインインは自動的に遮断されます。

---

## 📝 6. 環境変数一覧 (`.env.example`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# 管理者メールアドレス (カンマ区切り)
ADMIN_EMAILS=admin@dle.jp,manager@dle.jp
```

---

## 👤 7. 管理者権限の追加方法

1. `.env.local` (および Vercel の Environment Variables) の `ADMIN_EMAILS` に管理者に設定したい社員のメールアドレスをカンマ区切りで追加します。
   ```env
   ADMIN_EMAILS=admin@dle.jp,yamada@dle.jp,sato@dle.jp
   ```
2. 管理者権限を持つユーザーでログインすると、以下の特権機能が有効化されます。
   - 「＋ ツールを追加」ボタンの表示・新規登録
   - 各ツールカードの「...」メニューから「編集」「削除」「順序並び替え」
   - 掲示板メモの全投稿削除権限

---

## 📊 8. ツールデータの管理方法

- **ツールの追加**: 画面右上または「すべてのツール」ヘッダーの「＋ ツールを追加」ボタンからモーダルを開いて登録します。既存カテゴリ選択に加え、新しいカテゴリ名も直接入力可能です。
- **ツールの編集・削除**: カード上の「...」アイコンをクリックし、「編集」または「削除」を選択します。削除実行時には確認ダイアログが表示されます。
- **表示順の変更**: カードの「...」メニュー内の「前に移動」「後に移動」操作、または編集画面での数値管理により表示順序を変更可能です。

---

## 🌐 9. Vercel デプロイ方法

1. GitHub 等のリポジトリに本ソースコードを push します。
2. [Vercel](https://vercel.com/) で **Import Project** を選択し、リポジトリを接続します。
3. **Environment Variables** に上記の環境変数をセットします。
4. **Deploy** ボタンを押してデプロイを完了させます。
5. Google Cloud Console の承認済みのリダイレクト URI に `https://<your-app>.vercel.app/api/auth/callback/google` を追加してください。
