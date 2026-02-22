// thanks to https://github.com/biancarosa/lastfm-last-played for this API

const user = "vyteshark";
const url = `https://lastfm-api.vshark.xyz/${user}/latest-song`;
const songEl = document.querySelector("#song");
const statusEl = document.querySelector("#lastfm-status");

function truncateText(text, maxLength = 40) {
    return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
}

let lastTrack = null;
let lastValidHTML = null;
let lastStatus = null;

async function safeFetch(url, retries = 5) {
    for (let i = 0; i <= retries; i++) {
        try {
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res;
        } catch (e) {
            if (i === retries) throw e;
            console.warn(`[lastfm] retrying (${i + 1}/${retries})...`);
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}

async function updateSong() {
    try {
        console.log("[lastfm] fetching latest song...");
        const response = await safeFetch(url);
        const text = await response.text();

        let json;
        try {
            json = JSON.parse(text);
        } catch {
            throw new Error("invalid JSON");
        }

        const track = json?.track;
        if (!track) throw new Error("invalid track data");

        const title = truncateText(track.name, 20);
        const artistObj = track.artist;
        const artistFull = typeof artistObj === "string"
            ? artistObj
            : artistObj?.["#text"] || "Unknown Artist";
        const artist = truncateText(artistFull, 12);

        const trackUrl = track.url;
        let artistUrl;
        const match = trackUrl.match(/^https:\/\/www\.last\.fm\/music\/([^/]+)/);
        if (match) {
            artistUrl = `https://www.last.fm/music/${match[1]}`;
        } else {
            artistUrl = `https://www.last.fm/music/${encodeURIComponent(artist)}`;
        }

        const newTrack = `${title} - ${artist}`;
        const nowPlaying = track?.["@attr"]?.nowplaying === "true";

        if (newTrack !== lastTrack) {
            const html = `
                <a href="${trackUrl}" target="_blank" rel="noopener noreferrer">${title}</a>
                &nbsp;-&nbsp;
                <a href="${artistUrl}" target="_blank" rel="noopener noreferrer">${artist}</a>
            `.trim();
            console.log("[lastfm] updating:", html);
            songEl.innerHTML = html;
            lastTrack = newTrack;
            lastValidHTML = html;
        } else {
            console.log("[lastfm] same track, skipping update");
        }

        const newStatus = nowPlaying ? "now listening to" : "last listened to";
        if (newStatus !== lastStatus && statusEl) {
            statusEl.innerHTML = `<small><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3a7.png" class="emoji" alt="🎧" aria-label="🎧">  ${newStatus}`;
            lastStatus = newStatus;
        }

    } catch (e) {
        console.warn("[lastfm] fetch error:", e.message || e);

        if (lastValidHTML) {
            console.warn("[lastfm] keeping previous track (no valid update)");
            songEl.innerHTML = lastValidHTML;
        } else {
            songEl.textContent = "couldn't fetch latest track! TwT";
        }
    }
}

updateSong();
setInterval(updateSong, 15000);
