const questions = [
    // カテゴリ: 秘密情報の管理
    {
        category: "秘密情報の管理",
        text: "APIキーやパスワードなどの秘密情報を、コード内に直接書いていませんか？",
        options: [
            { text: ".envファイルに分離し、環境変数として参照している", score: 3 },
            { text: "一部は.envに分けたが、まだコードに残っているものもある", score: 1 },
            { text: "コードに直接書いている・よくわからない", score: 0 }
        ]
    },
    {
        category: "秘密情報の管理",
        text: ".envファイルが誤ってGitHubに公開されないよう、対策していますか？",
        options: [
            { text: ".gitignoreに.envを追加済み＆確認している", score: 3 },
            { text: ".gitignoreは設定したが、正しく動いているか不安", score: 2 },
            { text: "対策していない・.gitignoreを知らない", score: 0 }
        ]
    },
    {
        category: "秘密情報の管理",
        text: "Claude Codeに秘密情報（APIキー等）を直接プロンプトで渡していませんか？",
        options: [
            { text: "渡さない。.envファイルや環境変数で管理し、Claude Codeには参照方法だけ伝える", score: 3 },
            { text: "たまに渡してしまうことがある", score: 1 },
            { text: "普通に渡している・何が問題かわからない", score: 0 }
        ]
    },
    // カテゴリ: Claude Codeのセキュリティ機能
    {
        category: "Claude Codeのセキュリティ機能",
        text: "/security コマンドを使って、プロジェクトのセキュリティチェックをしたことがありますか？",
        options: [
            { text: "定期的に実行して確認している", score: 3 },
            { text: "存在は知っているが、あまり使っていない", score: 1 },
            { text: "知らなかった", score: 0 }
        ]
    },
    {
        category: "Claude Codeのセキュリティ機能",
        text: "Claude Codeのパーミッション設定（許可するコマンドの制限）を確認・調整していますか？",
        options: [
            { text: "必要なコマンドだけ許可し、危険なものはブロックしている", score: 3 },
            { text: "デフォルトのまま、聞かれたら都度判断している", score: 2 },
            { text: "すべて許可している・設定を意識したことがない", score: 0 }
        ]
    },
    {
        category: "Claude Codeのセキュリティ機能",
        text: "Hooks（フック）機能を使って、コミット前のチェックや自動化をしていますか？",
        options: [
            { text: "秘密情報の漏洩チェックなどのhooksを設定している", score: 3 },
            { text: "Hooksの存在は知っているが未設定", score: 1 },
            { text: "Hooksを知らない", score: 0 }
        ]
    },
    // カテゴリ: 生成コードの確認
    {
        category: "生成コードの確認",
        text: "Claude Codeが生成したコードを、そのまま使っていますか？",
        options: [
            { text: "必ず内容を確認・理解してから使う", score: 3 },
            { text: "だいたい確認するが、長いコードはそのまま使うことも", score: 2 },
            { text: "基本そのまま使う・読んでもわからない", score: 0 }
        ]
    },
    {
        category: "生成コードの確認",
        text: "Claude Codeが提案するシェルコマンド（rm, chmod, git push --forceなど）を実行する前に、内容を確認していますか？",
        options: [
            { text: "必ず内容と影響を確認してから実行する", score: 3 },
            { text: "よくわからないコマンドだけ確認する", score: 2 },
            { text: "提案されたらそのまま実行する", score: 0 }
        ]
    },
    {
        category: "生成コードの確認",
        text: "Claude Codeが外部パッケージのインストールを提案したとき、どうしていますか？",
        options: [
            { text: "パッケージの信頼性（ダウンロード数、メンテナンス状況）を確認する", score: 3 },
            { text: "有名そうならそのままインストールする", score: 1 },
            { text: "提案されたものはすべてインストールする", score: 0 }
        ]
    },
    // カテゴリ: Git・公開リポジトリ管理
    {
        category: "Git・公開リポジトリ管理",
        text: "GitHubにpushする前に、秘密情報やプライベートな内容が含まれていないか確認していますか？",
        options: [
            { text: "git diffやgit statusで毎回確認してからpushする", score: 3 },
            { text: "たまに確認するが、毎回ではない", score: 1 },
            { text: "確認せずpushしている", score: 0 }
        ]
    },
    {
        category: "Git・公開リポジトリ管理",
        text: "リポジトリをPublic（公開）にするかPrivate（非公開）にするか、意識して選択していますか？",
        options: [
            { text: "内容に応じて意識的に選択している", score: 3 },
            { text: "よくわからないがPrivateにしている", score: 2 },
            { text: "デフォルトのまま・意識していない", score: 0 }
        ]
    },
    {
        category: "Git・公開リポジトリ管理",
        text: "過去に秘密情報をcommitしてしまった場合の対処法を知っていますか？",
        options: [
            { text: "キーの無効化＋履歴からの削除が必要なことを理解している", score: 3 },
            { text: "削除すればいいと思っている（履歴に残ることを知らない）", score: 1 },
            { text: "対処法を知らない", score: 0 }
        ]
    },
    // カテゴリ: プロジェクト設定・CLAUDE.md
    {
        category: "プロジェクト設定・CLAUDE.md",
        text: "CLAUDE.mdにセキュリティに関するルール（.envの扱い、秘密情報の管理方法など）を記載していますか？",
        options: [
            { text: "セキュリティルールを明記している", score: 3 },
            { text: "CLAUDE.mdはあるが、セキュリティについては書いていない", score: 1 },
            { text: "CLAUDE.mdを使っていない・知らない", score: 0 }
        ]
    },
    {
        category: "プロジェクト設定・CLAUDE.md",
        text: "Claude Codeがファイルを削除したり、重要な操作をする前に確認を求めるよう設定していますか？",
        options: [
            { text: "破壊的操作は確認を求めるルール or hooksを設定済み", score: 3 },
            { text: "パーミッション設定でブロックはしているが、ルールは書いていない", score: 2 },
            { text: "特に設定していない", score: 0 }
        ]
    },
    {
        category: "プロジェクト設定・CLAUDE.md",
        text: ".env.exampleファイルを用意して、チームメンバーや自分の環境構築に役立てていますか？",
        options: [
            { text: "ダミー値入りの.env.exampleを用意している", score: 3 },
            { text: "存在は知っているが作っていない", score: 1 },
            { text: "知らない・用意していない", score: 0 }
        ]
    }
];
