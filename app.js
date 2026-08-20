let songs = [];

const overallStats =
    document.getElementById("overallStats");

const yearStats =
    document.getElementById("yearStats");

const allCheck =
    document.getElementById("allCheck");

const allUncheck =
    document.getElementById("allUncheck");

const shareButton =
    document.getElementById("shareButton");


/* =========================
   songs.jsonを読み込む
========================= */

async function loadSongs() {

    try {

        const response = await fetch("songs.json");

        if (!response.ok) {
            throw new Error(
                "songs.jsonを読み込めませんでした。"
            );
        }

        songs = await response.json();

        displaySongs();

        updateStats();

    } catch (error) {

        console.error(error);

        overallStats.innerHTML =
            "楽曲データを読み込めませんでした。";
    }
}


/* =========================
   曲を画面に表示
========================= */

function displaySongs() {

    songs.forEach((song, index) => {

        /*
         * 曲のyearから
         * 対応する年代のグリッドを取得
         */
        const grid =
            document.getElementById(
                `songs-${song.year}`
            );


        /*
         * HTML側にその年代が存在しない場合
         */
        if (!grid) {

            console.warn(
                `${song.year}年の表示場所がありません。`
            );

            return;
        }


        /*
         * パネル作成
         */
        const panel =
            document.createElement("button");


        panel.type = "button";

        panel.className = "song-panel";

        panel.dataset.index = index;

        panel.dataset.year = song.year;


        /*
         * パネルの中身
         */
        panel.innerHTML = `
            <img
                src="${song.image}"
                alt="${song.title}"
                loading="lazy"
            >

            <span class="song-title">
                ${song.title}
            </span>
        `;


        /*
         * クリック時
         */
        panel.addEventListener(
            "click",
            () => toggleSong(panel)
        );


        grid.appendChild(panel);
    });
}


/* =========================
   曲の選択・解除
========================= */

function toggleSong(panel) {

    panel.classList.toggle("known");

    updateStats();
}


/* =========================
   全てチェック
========================= */

function checkAll() {

    const panels =
        document.querySelectorAll(".song-panel");


    panels.forEach(panel => {

        panel.classList.add("known");

    });


    updateStats();
}


/* =========================
   全て解除
========================= */

function uncheckAll() {

    const panels =
        document.querySelectorAll(".song-panel");


    panels.forEach(panel => {

        panel.classList.remove("known");

    });


    updateStats();
}


/* =========================
   知ってる率計算
========================= */

function updateStats() {

    /*
     * 全曲
     */
    const allPanels =
        [...document.querySelectorAll(".song-panel")];


    const total =
        allPanels.length;


    /*
     * 知っている曲
     */
    const known =
        allPanels.filter(panel =>
            panel.classList.contains("known")
        ).length;


    /*
     * 総合知ってる率
     */
    const overallPercent =
        total > 0
            ? ((known / total) * 100).toFixed(1)
            : "0.0";


    overallStats.innerHTML = `
        <div class="overall-percent">
            ${overallPercent}%
        </div>

        <div class="overall-detail">
            全${total}曲中${known}曲
        </div>
    `;


    /*
     * 年代別
     */

    yearStats.innerHTML = "";


    /*
     * HTMLに書かれている年代を取得
     */
    const sections =
        document.querySelectorAll(".year-section");


    sections.forEach(section => {

        const grid =
            section.querySelector(".song-grid");


        const year =
            section
                .querySelector("h2")
                .textContent
                .replace("年", "");


        /*
         * その年代の曲
         */
        const panels =
            [...grid.querySelectorAll(".song-panel")];


        const yearTotal =
            panels.length;


        const yearKnown =
            panels.filter(panel =>
                panel.classList.contains("known")
            ).length;


        /*
         * 年代別知ってる率
         */
        const percent =
            yearTotal > 0
                ? ((yearKnown / yearTotal) * 100).toFixed(1)
                : "0.0";


        /*
         * 年代別表示
         */
        const item =
            document.createElement("div");


        item.className = "year-stat";


        item.innerHTML = `
            <div class="year-stat-top">

                <span class="year-stat-year">
                    ${year}年
                </span>

                <span class="year-stat-percent">
                    ${percent}%
                </span>

            </div>

            <div class="year-stat-detail">
                ${yearTotal}曲中${yearKnown}曲
            </div>
        `;


        yearStats.appendChild(item);
    });
}


/* =========================
   X共有
========================= */

function shareOnX() {

    const panels =
        [...document.querySelectorAll(".song-panel")];


    const total =
        panels.length;


    const known =
        panels.filter(panel =>
            panel.classList.contains("known")
        ).length;


    const percent =
        total > 0
            ? ((known / total) * 100).toFixed(1)
            : "0.0";


    const text =
        `ボカロ曲知ってる率チェッカー\n` +
        `全${total}曲中${known}曲` +
        `（知ってる率${percent}%）\n` +
        '#ボカロ曲知ってる率チェッカー';


   const url =
    "https://twitter.com/intent/tweet" +
    `?text=${encodeURIComponent(text)}` +
    `&url=${encodeURIComponent(location.href)}`;

    window.open(
        url,
        "_blank"
    );
}

async function saveImage() {
    const target = document.getElementById("capture");

    try {
        const canvas = await html2canvas(target);

        const dataUrl = canvas.toDataURL("image/png");

        const link = document.getElementById("downloadLink");

        link.href = dataUrl;
        link.download = "result.png";

        link.click();

    } catch (error) {
        console.error(error);
        alert("画像の作成に失敗しました");
    }
}

/* =========================
   イベント
========================= */

allCheck.addEventListener(
    "click",
    checkAll
);

allUncheck.addEventListener(
    "click",
    uncheckAll
);

shareButton.addEventListener(
    "click",
    shareOnX
);


/* =========================
   起動
========================= */

loadSongs();