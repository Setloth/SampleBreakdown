// playground-library.js
//
// A small, hand-picked set of short clips visitors can drop into the
// playground player without needing their own audio on hand. Keep these
// SHORT (a few seconds to ~20s) — they're meant to be chop-able snippets,
// not full songs, and short files also mean fast decode on every visitor's
// first click.
//
// Add your own by dropping a file in /public/audio/playground/ and adding
// an entry below — no code changes needed beyond this list.

export const playgroundLibrary = [
  {
    category: "Drum Breaks",
    clips: [
      { id: "pg-break-1", title: "11.08AM", file: "/audio/playground/drums/11.08am DB.WAV" },
      { id: "pg-break-2", title: "Black and Blue", file: "/audio/playground/drums/black_and_blue.WAV" },
      { id: "pg-break-3", title: "Chocolate Buttermilk", file: "/audio/playground/drums/Chocolate Buttermilk DB.WAV" },
      { id: "pg-break-4", title: "Breakthrough", file: "/audio/playground/drums/Isaac Hayes - Breakthrough.WAV" },
      { id: "pg-break-5", title: "Hit or Miss", file: "/audio/playground/drums/Odessa - Hit or Miss DB.WAV" },
    ],
  },
  {
    category: "Vocals",
    clips: [
      { id: "pg-vocal-1", title: "Goldenera Choir", file: "/audio/playground/vocal/goldenera_melodic_Vocal_Choir_Soul.WAV" },
      { id: "pg-vocal-2", title: "Moving Along", file: "/audio/playground/vocal/moving_along.WAV" },

    ],
  },
  {
    category: "Instrumentals",
    clips: [
      { id: "pg-inst-1", title: "EDM Synth Loop", file: "/audio/playground/instrumental/EDM-Loop-Synth.WAV" },
      { id: "pg-inst-2", title: "Groovy Bassline", file: "/audio/playground/instrumental/groovy-low-bassline.WAV" },
      { id: "pg-inst-3", title: "Stray", file: "/audio/playground/instrumental/Stray - Astrud GilbertoR.WAV" },
      { id: "pg-inst-4", title: "Brass Loop", file: "/audio/playground/instrumental/Brass_Loop_Futuristic.WAV" },

    ],
  },
  {
    category: "Songs",
    clips: [
      { id: "pg-song-1", title: "Adoro - Pearly Queen", file: "/audio/playground/songs/Adoro - Pearly Queen.WAV" },
      { id: "pg-song-2", title: "Airing - The Black Fire ", file: "/audio/playground/songs/BlackFire-Airing.WAV" },
      { id: "pg-song-3", title: "I Know Myself - The Sylvers", file: "/audio/playground/songs/I Know Myself - The Sylvers.WAV" },
      { id: "pg-song-4", title: "MacArthur Park", file: "/audio/playground/songs/MacArthurPark.WAV" },
      { id: "pg-song-5", title: "Sinnerman - Nina Simone", file: "/audio/playground/songs/Sinnerman Main Sample.WAV" },
    ],
  },
];