-- DLE 社内ツールポータル Supabase スキーマ定義 (既存プロジェクト同居用)
-- Supabase の SQL Editor にコピー＆ペーストして「Run」を実行してください。

-- 1. dle_tools テーブル作成
CREATE TABLE IF NOT EXISTS public.dle_tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  color TEXT DEFAULT 'blue',
  description TEXT,
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

-- 2. dle_posts (掲示板メモ) テーブル作成
CREATE TABLE IF NOT EXISTS public.dle_posts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('バグ', '要望', '相談', '改修報告', 'その他')),
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. dle_favorites (お気に入り) テーブル作成
CREATE TABLE IF NOT EXISTS public.dle_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  tool_id TEXT NOT NULL REFERENCES public.dle_tools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_email, tool_id)
);

-- Row Level Security (RLS) 有効化
ALTER TABLE public.dle_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dle_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dle_favorites ENABLE ROW LEVEL SECURITY;

-- 既存ポリシーの削除（再実行時のエラー防止）
DROP POLICY IF EXISTS "Allow public read for dle_tools" ON public.dle_tools;
DROP POLICY IF EXISTS "Allow public read for dle_posts" ON public.dle_posts;
DROP POLICY IF EXISTS "Allow public read for dle_favorites" ON public.dle_favorites;

DROP POLICY IF EXISTS "Allow all for dle_tools" ON public.dle_tools;
DROP POLICY IF EXISTS "Allow all for dle_posts" ON public.dle_posts;
DROP POLICY IF EXISTS "Allow all for dle_favorites" ON public.dle_favorites;

-- 全ユーザーアクセスポリシー
CREATE POLICY "Allow all for dle_tools" ON public.dle_tools FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for dle_posts" ON public.dle_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for dle_favorites" ON public.dle_favorites FOR ALL USING (true) WITH CHECK (true);

-- 4. 初期ツールデータ投入 (DLEツール一覧 14件)
INSERT INTO public.dle_tools (id, name, category, color, description, url, sort_order) VALUES
('tool-1', 'TouchOnTime', '勤怠管理', 'blue', '出退勤の打刻や勤務時間、勤怠状況を確認・管理するためのツール。', 'https://touchontime.com/admin/IZqtty2LYH7onNXgBwNqp3H5CpHrEzXm', 1),
('tool-2', '楽楽販売（日報）', '勤怠管理', 'emerald', '業務日報を入力・確認するための社内ツール。', 'https://hncooper.rakurakuhanbai.jp/d2d3cna/top/main', 2),
('tool-3', '楽楽清算', '交通費・立替清算', 'indigo', '交通費や立替経費などの申請・精算を行うためのツール。', 'https://rsspeaker.rakurakuseisan.jp/gluge_gJdVa/', 3),
('tool-4', 'DLEScanサーバー', 'ファイル送付', 'violet', '社内外とのファイル受け渡しやファイル送付に利用するツール。', 'https://dle-connect2019.tw3.quickconnect.to/#/signin', 4),
('tool-5', '営業共有フォルダ', 'ファイル保管', 'amber', '営業関連の資料や各種データを保管・共有しているGoogle Driveの共有フォルダ。', 'https://drive.google.com/drive/u/1/folders/0AEsqP2nT0ZOuUk9PVA', 5),
('tool-6', 'ワークフロー', '稟議申請', 'rose', '稟議・承認などの社内申請を行うためのワークフローシステム。', 'https://dle.createwebflow-cloud.jp/XFV20/login', 6),
('tool-7', '楽楽販売', '案件管理・請求', 'emerald', '案件情報、売上、請求関連の情報などを管理するためのツール。', 'https://hncooper.rakurakuhanbai.jp/d2d3cna/top/main', 7),
('tool-8', 'ZAC', '案件管理・請求', 'purple', '案件・工数・売上・請求などを管理するための基幹業務システム。', 'https://secure.zac.ai/dle/Logon.aspx?ReturnUrl=%2fdle%2f', 8),
('tool-9', 'セールス管理シート', 'AP部案件管理', 'cyan', 'AP部の営業案件や進捗状況を管理するためのGoogleスプレッドシート。', 'https://docs.google.com/spreadsheets/d/1NxKlZkaSoKPqqVI72kfeKolhp9p2C4vCqz2V7WkaL1o/edit?gid=1874540829#gid=1874540829', 9),
('tool-10', '配配メール', 'リード管理', 'teal', 'メール配信や顧客へのメールマーケティングに使用するツール。', 'https://br-a09.hm-f.jp/yr9YRg/', 10),
('tool-11', '営業リスト', 'リード管理', 'green', '営業先候補・リード情報などを管理している営業リスト。', 'https://docs.google.com/spreadsheets/d/1PyTliLqSHPNfiEJQ08dbwtjSYer7nvclV3AvWRG_0ts/edit?gid=367980042#gid=367980042', 11),
('tool-12', 'アルテマブルー', 'リード管理', 'blue', '営業活動に利用する企業・リード情報関連ツール。', 'https://portal.ultimablue.jp/login/DLEDLE', 12),
('tool-13', 'Workportal', '営業ツール', 'orange', '営業業務や社内業務に利用する各種機能へアクセスするための社内ツール。', 'https://work-portal-topaz.vercel.app/', 13),
('tool-14', 'Social Insight', 'SNS管理ツール', 'pink', 'SNSアカウントの分析、投稿状況、フォロワーやエンゲージメントなどを確認するための分析ツール。', 'https://social-admin.userlocal.jp/accounts', 14)
ON CONFLICT (id) DO NOTHING;

-- 初期メモ投稿データ
INSERT INTO public.dle_posts (id, type, content, author_name, author_email) VALUES
('post-1', '改修報告', 'DLE社内ツールポータルをリリースしました！ツール追加のご要望は本メモ欄までお願いします。', 'ポータル管理者', 'admin@dle.jp'),
('post-2', '改修報告', '初期ツール14件（TouchOnTime、楽楽販売、ZAC、営業リスト等）を登録完了しました。', 'ポータル管理者', 'admin@dle.jp')
ON CONFLICT (id) DO NOTHING;
