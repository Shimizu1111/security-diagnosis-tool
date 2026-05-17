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

        const scoreValue = document.getElementById('score-value');
        const scoreRing = document.getElementById('score-ring');
        const scoreLabel = document.getElementById('score-label');

        scoreValue.textContent = percentage;

        const circumference = 339.292;
        const offset = circumference - (circumference * percentage / 100);
        setTimeout(() => {
            scoreRing.style.strokeDashoffset = offset;
        }, 100);

        let label, levelClass;
        if (percentage >= 80) {
            label = 'セキュリティ対策バッチリ！安全にClaude Codeを使えています';
            levelClass = 'level-high';
        } else if (percentage >= 50) {
            label = '基本はできていますが、強化ポイントがあります';
            levelClass = 'level-mid';
        } else {
            label = 'セキュリティリスクが高い状態です。すぐに対策しましょう';
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
            '秘密情報の管理': [
                'APIキーやパスワードは必ず.envファイルに分離し、コードには環境変数参照で書きましょう。',
                '.gitignoreに.envを追加し、秘密情報がGitHubに公開されないようにしましょう。',
                'Claude Codeのプロンプトに直接秘密情報を貼り付けるのは避けましょう。'
            ],
            'Claude Codeのセキュリティ機能': [
                '/security コマンドでプロジェクトのセキュリティ状態を定期的にチェックしましょう。',
                'パーミッション設定を見直し、不要なコマンドの自動実行を制限しましょう。',
                'Hooks機能を活用して、コミット前に秘密情報の漏洩を自動チェックしましょう。'
            ],
            '生成コードの確認': [
                'Claude Codeが生成したコードは必ず目を通し、理解してから使いましょう。',
                'rm -rf や git push --force など破壊的なコマンドは、実行前に影響範囲を確認しましょう。',
                '外部パッケージの追加時は、npm/GitHub上での信頼性を確認する癖をつけましょう。'
            ],
            'Git・公開リポジトリ管理': [
                'pushする前にgit diffで変更内容を確認し、秘密情報が含まれていないかチェックしましょう。',
                '秘密情報を含むリポジトリは必ずPrivateに設定しましょう。',
                '一度commitした秘密情報はgit履歴に残ります。漏洩した場合はキーの無効化が最優先です。'
            ],
            'プロジェクト設定・CLAUDE.md': [
                'CLAUDE.mdに「秘密情報をハードコードしない」「.envはgitに含めない」等のルールを明記しましょう。',
                '破壊的操作（ファイル削除、force pushなど）の前に確認を求めるルールを設定しましょう。',
                '.env.exampleを用意して、必要な環境変数を文書化しましょう（値はREPLACE_MEで）。'
            ]
        };

        Object.entries(categories).forEach(([name, data]) => {
            const catPercent = (data.total / (data.count * maxScorePerQuestion)) * 100;
            if (catPercent < 80 && thresholds[name]) {
                const items = thresholds[name];
                if (catPercent < 40) {
                    advice.push(...items);
                } else if (catPercent < 70) {
                    advice.push(items[0], items[1]);
                } else {
                    advice.push(items[0]);
                }
            }
        });

        return advice;
    }
});
