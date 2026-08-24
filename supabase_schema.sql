-- DLE 社内ツールポータル Supabase スキーマ定義 & 初期データ

-- 1. tools テーブル作成
CREATE TABLE IF NOT EXISTS public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

-- 2. posts (掲示板メモ) テーブル作成
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('バグ', '要望', '相談', '改修報告', 'その他')),
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. favorites (お気に入り) テーブル作成
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_email, tool_id)
);

-- Row Level Security (RLS) 有効化
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 全ユーザー参照用ポリシー (読み取りは全員可能)
CREATE POLICY "Allow public read for tools" ON public.tools FOR SELECT USING (true);
CREATE POLICY "Allow public read for posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow public read for favorites" ON public.favorites FOR SELECT USING (true);

-- 書き込み・変更ポリシー (サービスロールまたはAPI経由制御)
CREATE POLICY "Allow authenticated insert for tools" ON public.tools FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update for tools" ON public.tools FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete for tools" ON public.tools FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert for posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update for posts" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete for posts" ON public.posts FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert for favorites" ON public.favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated delete for favorites" ON public.favorites FOR DELETE USING (true);

-- 4. 初期データシード (DLEツール一覧.xlsx 準拠 14件)
INSERT INTO public.tools (name, category, description, url, sort_order) VALUES
('TouchOnTime', '勤怠管理', '出退勤の打刻や勤務時間、勤怠状況を確認・管理するためのツール。', 'https://touchontime.com/admin/IZqtty2LYH7onNXgBwNqp3H5CpHrEzXm', 1),
('楽楽販売（日報）', '勤怠管理', '業務日報を入力・確認するための社内ツール。', 'https://hncooper.rakurakuhanbai.jp/d2d3cna/top/main', 2),
('楽楽清算', '交通費・立替清算', '交通費や立替経費などの申請・精算を行うためのツール。', 'https://rsspeaker.rakurakuseisan.jp/gluge_gJdVa/', 3),
('DLEScanサーバー', 'ファイル送付', '社内外とのファイル受け渡しやファイル送付に利用するツール。', 'https://dle-connect2019.tw3.quickconnect.to/#/signin', 4),
('営業共有フォルダ', 'ファイル保管', '営業関連の資料や各種データを保管・共有しているGoogle Driveの共有フォルダ。', 'https://drive.google.com/drive/u/1/folders/0AEsqP2nT0ZOuUk9PVA', 5),
('ワークフロー', '稟議申請', '稟議・承認などの社内申請を行うためのワークフローシステム。', 'https://dle.createwebflow-cloud.jp/XFV20/login', 6),
('楽楽販売', '案件管理・請求', '案件情報、売上、請求関連の情報などを管理するためのツール。', 'https://hncooper.rakurakuhanbai.jp/d2d3cna/top/main', 7),
('ZAC', '案件管理・請求', '案件・工数・売上・請求などを管理するための基幹業務システム。', 'https://secure.zac.ai/dle/Logon.aspx?ReturnUrl=%2fdle%2f', 8),
('セールス管理シート', 'AP部案件管理', 'AP部の営業案件や進捗状況を管理するためのGoogleスプレッドシート。', 'https://docs.google.com/spreadsheets/d/1NxKlZkaSoKPqqVI72kfeKolhp9p2C4vCqz2V7WkaL1o/edit?gid=1874540829#gid=1874540829', 9),
('配配メール', 'リード管理', 'メール配信や顧客へのメールマーケティングに使用するツール。', 'https://br-a09.hm-f.jp/yr9YRg/', 10),
('営業リスト', 'リード管理', '営業先候補・リード情報などを管理している営業リスト。', 'https://docs.google.com/spreadsheets/d/1PyTliLqSHPNfiEJQ08dbwtjSYer7nvclV3AvWRG_0ts/edit?gid=367980042#gid=367980042', 11),
('アルテマブルー', 'リード管理', '営業活動に利用する企業・リード情報関連ツール。', 'https://portal.ultimablue.jp/login/DLEDLE', 12),
('Workportal', '営業ツール', '営業業務や社内業務に利用する各種機能へアクセスするための社内ツール。', 'https://work-portal-topaz.vercel.app/', 13),
('Social Insight', 'SNS管理ツール', 'SNSアカウントの分析、投稿状況、フォロワーやエンゲージメントなどを確認するための分析ツール。', 'https://social-admin.userlocal.jp/accounts', 14)
ON CONFLICT DO NOTHING;

-- 初期メモ投稿データ
INSERT INTO public.posts (type, content, author_name, author_email) VALUES
('改修報告', 'DLE社内ツールポータルをリリースしました！ツール追加のご要望は本メモ欄までお願いします。', 'ポータル管理者', 'admin@dle.jp'),
('改修報告', '初期ツール14件（TouchOnTime、楽楽販売、ZAC、営業リスト等）を登録完了しました。', 'ポータル管理者', 'admin@dle.jp')
ON CONFLICT DO NOTHING;
