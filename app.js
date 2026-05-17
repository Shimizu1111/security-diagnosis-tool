document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const questionScreen = document.getElementById('question-screen');
    const resultScreen = document.getElementById('result-screen');
    const startBtn = document.getElementById('start-btn');
    const retryBtn = document.getElementById('retry-btn');
    const progressFill = document.getElementById('progress-fill');
    const currentQEl = document.getElementById('current-q');
    const totalQEl = document.getElementById('total-q');
    const categoryLabel = document.getElementById('category-label');
    const questionText = document.getElementById('question-text');
    const optionsEl = document.getElementById('options');

    let currentIndex = 0;
    let answers = [];
    const maxScorePerQuestion = 3;
    const totalMaxScore = questions.length * maxScorePerQuestion;

    totalQEl.textContent = questions.length;

    startBtn.addEventListener('click', startQuiz);
    retryBtn.addEventListener('click', () => {
        currentIndex = 0;
        answers = [];
        showScreen(startScreen);
    });

    function showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }

    function startQuiz() {
        showScreen(questionScreen);
        showQuestion();
    }

    function showQuestion() {
        const q = questions[currentIndex];
        currentQEl.textContent = currentIndex + 1;
        progressFill.style.width = ((currentIndex) / questions.length * 100) + '%';
        categoryLabel.textContent = q.category;
        questionText.textContent = q.text;

        optionsEl.innerHTML = '';
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt.text;
            btn.addEventListener('click', () => selectOption(i));
            optionsEl.appendChild(btn);
        });
    }

    function selectOption(optionIndex) {
        const q = questions[currentIndex];
        answers.push({
            category: q.category,
            score: q.options[optionIndex].score
        });

        currentIndex++;
        if (currentIndex < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        showScreen(resultScreen);

        const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
        const percentage = Math.round((totalScore / totalMaxScore) * 100);

        // Animate score
        const scoreValue = document.getElementById('score-value');
        const scoreRing = document.getElementById('score-ring');
        const scoreLabel = document.getElementById('score-label');

        scoreValue.textContent = percentage;

        const circumference = 339.292;
        const offset = circumference - (circumference * percentage / 100);
        setTimeout(() => {
            scoreRing.style.strokeDashoffset = offset;
        }, 100);

        // Score label
        let label, levelClass;
        if (percentage >= 80) {
            label = 'セキュリティ意識が高い！';
            levelClass = 'level-high';
        } else if (percentage >= 50) {
            label = 'もう少し対策を強化しましょう';
            levelClass = 'level-mid';
        } else {
            label = 'セキュリティ対策が不足しています';
            levelClass = 'level-low';
        }
        scoreLabel.textContent = label;
        scoreLabel.className = 'score-label ' + levelClass;

        // Category breakdown
        const categories = {};
        answers.forEach(a => {
            if (!categories[a.category]) {
                categories[a.category] = { total: 0, count: 0 };
            }
            categories[a.category].total += a.score;
            categories[a.category].count++;
        });

        const categoryResultsEl = document.getElementById('category-results');
        categoryResultsEl.innerHTML = '';

        Object.entries(categories).forEach(([name, data]) => {
            const catPercent = Math.round((data.total / (data.count * maxScorePerQuestion)) * 100);
            let barClass = 'high';
            if (catPercent < 50) barClass = 'low';
            else if (catPercent < 80) barClass = 'mid';

            const item = document.createElement('div');
            item.className = 'category-result-item';
            item.innerHTML = `
                <span class="category-name">${name}</span>
                <div class="category-bar-wrapper">
                    <div class="category-bar">
                        <div class="category-bar-fill ${barClass}" style="width: 0%"></div>
                    </div>
                    <span class="category-percent">${catPercent}%</span>
                </div>
            `;
            categoryResultsEl.appendChild(item);

            setTimeout(() => {
                item.querySelector('.category-bar-fill').style.width = catPercent + '%';
            }, 200);
        });

        // Advice
        const adviceEl = document.getElementById('advice');
        const adviceItems = generateAdvice(categories);
        if (adviceItems.length > 0) {
            adviceEl.innerHTML = `
                <h3>改善ポイント</h3>
                <ul>${adviceItems.map(a => `<li>${a}</li>`).join('')}</ul>
            `;
        } else {
            adviceEl.innerHTML = '<h3>素晴らしい！現在の対策を維持しましょう。</h3>';
        }
    }

    function generateAdvice(categories) {
        const advice = [];
        const thresholds = {
            'パスワード管理': [
                'パスワードマネージャーの導入を検討しましょう。すべてのパスワードを安全に管理できます。',
                'サービスごとに異なる長いパスワードを使いましょう（12文字以上推奨）。'
            ],
            '二段階認証・ログイン保護': [
                '重要なサービス（メール、銀行、SNS）には必ず二段階認証を設定しましょう。',
                '身に覚えのないログイン通知は、不正アクセスの可能性があります。すぐにパスワードを変更してください。'
            ],
            'フィッシング・詐欺対策': [
                'メールやSMSのリンクは安易にクリックせず、公式サイトに直接アクセスする癖をつけましょう。',
                '「至急」「停止」などの緊急性を煽るメールは詐欺の可能性が高いです。落ち着いて対処しましょう。'
            ],
            'デバイス・ソフトウェア管理': [
                'OSやアプリのアップデートにはセキュリティ修正が含まれます。できるだけ早く更新しましょう。',
                '使っていないアプリやアカウントは情報漏洩のリスクになります。定期的に整理しましょう。'
            ],
            'Wi-Fi・ネットワーク': [
                'フリーWi-Fiでは通信が盗み見られる可能性があります。ログインや決済は避けましょう。',
                '自宅Wi-Fiのパスワードは初期設定から変更し、推測されにくいものにしましょう。'
            ],
            'データ保護・バックアップ': [
                '大切なデータは複数箇所にバックアップしましょう（クラウド + 外付けHDDなど）。',
                'SNSのプライバシー設定を確認し、意図しない情報公開を防ぎましょう。'
            ]
        };

        Object.entries(categories).forEach(([name, data]) => {
            const catPercent = (data.total / (data.count * maxScorePerQuestion)) * 100;
            if (catPercent < 80 && thresholds[name]) {
                const items = thresholds[name];
                if (catPercent < 50) {
                    advice.push(...items);
                } else {
                    advice.push(items[0]);
                }
            }
        });

        return advice;
    }
});
