// techniques-data.js
//
// One entry per <TechniqueSection>. Each technique holds one or more case
// studies; each case study holds one or more samples (most songs have one —
// "My Homie" is a multi-sample shape, stacking labeled players under a
// single write-up rather than teaching SampleBreakdown to juggle several
// sources itself).
//
// Audio paths are absolute (leading "/") since they live in /public/audio —
// relative paths would resolve against whatever route the visitor is on
// (e.g. "/dev") rather than the site root, breaking anywhere but "/".

export const techniqueSections = [
  {
    id: "drum-breaks",
    title: "Drum Breaks",
    blurb:
      "Isolating the percussive section of a record and looping or chopping it into the backdrop of a new beat — the foundational move turntablism was built on.",
    studies: [
      {
        slug: "straight-outta-compton",
        title: "Straight Outta Compton",
        artist: "NWA",
        producer: "Dr. Dre",
        writeup: [
          "One of the most influential samples of all time is the 'Amen Break' from the track 'Amen, Brother' by the Winstons. It has been sampled in almost 8000 songs, according to WhoSampled.com's database.",
          "Notably sampled by artists like NWA, Dr. Dre, Tyler, The Creator, Oasis, Jay-Z and many more, it was one of the first songs ever to blow up as a universal sample. All because of its iconic drum solo section in the middle of the track, take a listen:",
        ],
        samples: [
          {
            id: "amen-break",
            role: null,
            inFile: "audio/the-winstons-amen-brother.mp3",
            inTitle: "The Winstons - Amen, Brother",
            outFile: "audio/nwa-straight-outta-compton.mp3",
            timeMarkers: [4],
            loop: { start: 86.84, end: 93.52, enabled: true },
            markers: [],
            initialZoom: { start: 78.71, end: 101.48 },
          },
        ],
      },
      {
        slug: "the-corner",
        title: "The Corner",
        artist: "Common",
        producer: "Kanye West",
        writeup: [
          "Another example of a drum break, while maybe not as iconic, but the same idea of taking an isolated instrumental percussive section and breaking it up and looping it to serve as the foundation for a new track.",
        ],
        samples: [
          {
            id: "corner-drums",
            role: null,
            inFile: "audio/the-temptations-what-it-is.mp3",
            outFile: "audio/common-the-corner.mp3",
            loop: { start: 72, end: 82, enabled: true },
            timeMarkers: [4],
          },
        ],
      },
    ],
  },

  {
    id: "sample-flips",
    title: "Sample Flips",
    blurb:
      "Taking one record and chopping and reordering its own pieces into an entirely new progression.",
    studies: [
      {
        slug: "stop",
        title: "Stop",
        artist: "J Dilla",
        producer: "J Dilla",
        writeup: [
          "Now we start getting into the real fun, instead of just using one song as the foundational piece to an ultimately bigger track, sampling also takes an approach at reusing one song to make something entirely new.",
          "This approach is foundational to sampling, looping parts of one record not just over and over, but to create a new story altogether.",
          "In this example next, we see how J Dilla often mastered this technique, picking apart a song from all over into an entirely new composition.",
        ],
        samples: [
          {
            id: "stop-flip",
            role: null,
            inFile: "audio/dionne-warwick-youre-gonna-need-me.mp3",
            outFile: "audio/j-dilla-stop.mp3",
            timeMarkers: [0, 9, 50, 68],
            loop: { start: 62.8, end: 70.37, enabled: false },
            markers: [
              { id: "m-1786741819660", time: 0, label: "Intro" },
              { id: "m-1786741834796", time: 11.49, label: "Main Vocals 1" },
              { id: "m-1786741934968", time: 16.02, label: "Main Vocals 2" },
              { id: "m-1786741977850", time: 62.73, label: "Stop Loop" },
              { id: "m-1786742017149", time: 92.17, label: "My Way" },
              { id: "m-1786742094029", time: 106.53, label: "Need Me" },
              { id: "m-1786742138419", time: 152.96, label: "Stop Loop 2" },
              { id: "m-1786742158218", time: 160.86, label: "Well Give A Little Back" },
              { id: "m-1786742186186", time: 183.77, label: "Instrumental" },
            ],
            initialZoom: { start: 0, end: 270 },
          },
        ],
      },
      {
        slug: "avalanches-sunshine",
        title: "Sunshine",
        artist: "The Avalanches",
        producer: null,
        writeup: [
          "The Australian alternative group The Avalanches builds all their music solely by using samples. A unique approach that separates them from the primarily hip-hop dominated field of sampled music.",
          "In this example, there is a standout sample flip, but it is surrounded and supported by many other samples to build out a brand new beautiful composition. This next example, Sunshine, is one of these beautiful collages of discovered sounds:",
        ],
        samples: [
          {
            id: "sunshine-flip",
            role: null,
            inFile: "audio/fuzz-leave-it-all-behind-me.mp3",
            inTitle: "Leave It All Behind Me",
            outFile: "audio/avalanches-sunshine.mp3",
            timeMarkers: [2, 96],
            loop: { start: 78.42, end: 82.58, enabled: true },
            markers: [
              { id: "m-1786743784390", time: 41.64, label: "Once We Shared" },
              { id: "m-1786743806825", time: 64.07, label: "Went Away" },
              { id: "m-1786743881542", time: 76.6, label: "Taking My" },
              { id: "m-1786743887476", time: 82.61, label: "From Up Above" },
            ],
            initialZoom: { start: 19.05, end: 116.33 },
          },
        ],
      },
      {
        slug: "whatever-you-say",
        title: "Whatever You Say",
        artist: "Little Brother",
        producer: "9th Wonder",
        writeup: [
          "Another more traditional approach to sample flipping with 9th Wonder taking apart this Cleo Laine track.",
          "Often, this approach sees one part of the song be used as an intro, and then surrounding sections get chopped up and reorganized to create the beat.",
        ],
        samples: [
          {
            id: "whatever-you-say-flip",
            role: null,
            inFile: "audio/cleo-laine-source.mp3",
            inTitle: "I Believe You",
            outFile: "audio/little-brother-whatever-you-say.mp3",
            outTitle: "Whatever You Say",
            markers: [{ id: "m-0", time: 100.5, label: "First Time" }],
            timeMarkers: [0, 15],
            loop: { start: 106.91, end: 115.12, enabled: true },
          },
        ],
      },
    ],
  },

  {
    id: "layered-chops",
    title: "Sample Layering",
    blurb:
      "Combining a drum break with one or more additional samples layered on top — a break and a flip working together on top of each other to create new music.",
    studies: [
      {
        slug: "my-homie",
        title: "My Homie",
        artist: "ScHoolboy Q",
        producer: "The Alchemist",
        writeup: [
          "This song has a lot of personal inspiration for me, it was one of the first tracks that I really dug into trying to figure out just how exactly the beat was constructed.",
          "The Alchemist is known for his almost hypnotic sample selections, and everything from the intro sample to the way he chops up the drums on this track are exactly that - hypnotic.",
          "The process he took for this track isn't the most complicated, the main instrumental sample is just layered directly over the rhythm of his drum chops, but the choice of samples make it so smooth.",
        ],
        samples: [
          {
            id: "my-homie-intro",
            role: "Intro sample",
            inTitle: "Clearlight - Way",
            inFile: "audio/clearlight-way.mp3",
            outFile: "audio/alchemist-my-homie.mp3",
            timeMarkers: [0],
            loop: { start: 3.23, end: 18.72, enabled: true },
          },
          {
            id: "my-homie-break",
            role: "Drum break",
            inTitle: "Superfine From Behind Lady",
            inFile: "audio/cleveland-wrecking-superfine-from-behind-lady.mp3",
            outFile: "audio/alchemist-my-homie.mp3",
            timeMarkers: [6],
            loop: { start: 0.88, end: 6.74, enabled: true },
            markers: [],
          },
          {
            id: "my-homie-lead",
            role: "Instrumental layer",
            inTitle: "Entrance - Italian Slides",
            inFile: "audio/entrance-italian-slides.mp3",
            outFile: "audio/alchemist-my-homie.mp3",
            loop: { start: 1.8, end: 7.48, enabled: true },
            initialZoom: { start: 0.6, end: 11.62 },
          },
        ],
      },
    ],
  },
];