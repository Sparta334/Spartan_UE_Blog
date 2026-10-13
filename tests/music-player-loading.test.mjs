import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

const storeSource = await readFile(
	new URL("../src/stores/musicPlayerStore.ts", import.meta.url),
	"utf8",
);
const constantsSource = await readFile(
	new URL(
		"../src/components/widgets/music-player/constants.ts",
		import.meta.url,
	),
	"utf8",
);
const coverImageSource = await readFile(
	new URL(
		"../src/components/widgets/music-player/atoms/CoverImage.svelte",
		import.meta.url,
	),
	"utf8",
);
const playlistItemSource = await readFile(
	new URL(
		"../src/components/widgets/music-player/atoms/PlaylistItem.svelte",
		import.meta.url,
	),
	"utf8",
);
const sidebarTrackSource = await readFile(
	new URL(
		"../src/components/widgets/music-sidebar/components/TrackListItem.svelte",
		import.meta.url,
	),
	"utf8",
);
const { resolveAssetUrl } = await import("../src/utils/asset-url.ts");

function methodSource(name, nextName) {
	const start = storeSource.indexOf(`\tprivate ${name}`);
	const end = storeSource.indexOf(`\tprivate ${nextName}`, start + 1);
	assert.notEqual(start, -1, `${name} should exist`);
	assert.notEqual(end, -1, `${nextName} should exist after ${name}`);
	return storeSource.slice(start, end);
}

describe("Music player media loading boundary", () => {
	it("keeps initialization metadata-only and disables media preload", () => {
		assert.match(storeSource, /this\.audio\.preload = "none"/);
		assert.match(
			storeSource,
			/this\.selectSong\(this\.state\.playlist\[0\], false\)/,
		);

		const selectSong = methodSource("selectSong", "releaseAudioSource");
		assert.doesNotMatch(selectSong, /\.src\s*=/);
		assert.doesNotMatch(selectSong, /\.load\(\)/);
	});

	it("assigns the real source only through an explicit media-loading path", () => {
		const ensureAudioSource = methodSource(
			"ensureAudioSource",
			"requestPlayback",
		);
		assert.match(ensureAudioSource, /this\.audio\.src = sourceUrl/);
		assert.match(ensureAudioSource, /this\.audio\.load\(\)/);
		assert.match(storeSource, /this\.ensureAudioSource\(\)/);
	});

	it("preserves remote audio URLs and only roots relative local paths", () => {
		const signedUrl =
			"https://media.example.com/song.flac?token=a%2Fb&expires=123";
		assert.equal(resolveAssetUrl(signedUrl), signedUrl);
		assert.equal(
			resolveAssetUrl("//media.example.com/song.mp3?version=2"),
			"//media.example.com/song.mp3?version=2",
		);
		assert.equal(
			resolveAssetUrl("/assets/music/song.mp3"),
			"/assets/music/song.mp3",
		);
		assert.equal(
			resolveAssetUrl("assets/music/song.mp3"),
			"/assets/music/song.mp3",
		);
	});

	it("bounds automatic retries to one playlist traversal", () => {
		assert.match(storeSource, /this\.playbackErrorCount \+= 1/);
		assert.match(storeSource, /this\.playbackErrorCount < maxAttempts/);
		const handleAudioError = methodSource(
			"handleAudioError",
			"handleAudioLoaded",
		);
		assert.match(
			handleAudioError,
			/if \(!this\.state\.willAutoPlay\)\s*{\s*return/,
		);
		const pause = storeSource.slice(
			storeSource.indexOf("\tpause(): void"),
			storeSource.indexOf("\tnext(", storeSource.indexOf("\tpause(): void")),
		);
		assert.match(pause, /this\.resetErrorRetryBudget\(\)/);
	});

	it("uses a real fallback URL when external playlists omit cover art", () => {
		assert.match(
			constantsSource,
			/DEFAULT_COVER_URL\s*=\s*"\/favicon\/favicon\.ico"/,
		);
		assert.match(
			storeSource,
			/cover:\s*\(song\.pic as string \| undefined\) \|\| DEFAULT_COVER_URL/,
		);
		for (const source of [
			coverImageSource,
			playlistItemSource,
			sidebarTrackSource,
		]) {
			assert.match(source, /resolveAssetUrl\([^\n]*\|\| DEFAULT_COVER_URL\)/);
		}
	});

	it("ships non-zero metadata for built-in songs without constraining external playlists", () => {
		const literalPlaylist = constantsSource.match(
			/export const LOCAL_PLAYLIST:\s*Song\[\]\s*=\s*\[([\s\S]*?)\n\];/,
		);
		if (!literalPlaylist) {
			assert.match(
				constantsSource,
				/export const LOCAL_PLAYLIST:\s*Song\[\]\s*=\s*[A-Za-z_$][\w$]*/,
			);
			return;
		}

		const durations = [
			...literalPlaylist[1].matchAll(/duration:\s*(\d+)/g),
		].map((match) => Number(match[1]));
		assert.ok(durations.length > 0);
		assert.ok(durations.every((duration) => duration > 0));
	});
});
