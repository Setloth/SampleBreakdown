import { Fragment,useState } from 'react'

import './App.css'

import { Quote } from 'lucide-react'

import SamplingHero from './components/SamplingHero'
import { HistoryTracklist, NumberedSection, TechTimeline, HistoryFigure } from './components/HistoryUI'
import { Disc3, Grid3x3, AudioWaveform, HelpCircle } from 'lucide-react'
import TechniqueSection, { CaseStudy} from "./components/TechniqueSection"
import { techniqueSections } from './data/techniques-data'
import Playground from "./components/Playground"



function App() {

  return (
    <>
      {/*
      Nav Bar: [Sampling]             [History  Techniques  Playground]
      */
      }
      <section id="title" className="navbar">
        <h1>Sampling</h1>

        <nav className="site-nav">
          <a href="#history">History</a>
          <a href="#techniques">Techniques</a>
          <a href="#examples-playground">Playground</a>
        </nav>
        <section id="spacer"></section>

      </section>

      <section id="subtitle">
        <SamplingHero>
                  <span className="site-eyebrow">Liner Notes</span>
          <p>This project was inspired by a few tools I use myself to learn about musical sampling.</p>
          <p><a href="https://whosampled.com">WhoSampled</a> is a website with a community-built catalog of songs and their samples, a useful tool to figure out what your favorite track or artist sampled, and what other songs have done the same. The fact that it is run off of community contributions means it is growing and changing all the time, allowing for professionals and beginners to get into the wide world of samples at any time. </p>
          <p><a href="https://www.youtube.com/tracklib">Tracklib</a> is a web platform that hosts samples for producers to use in their songs, and those samples - real songs - are legally cleared for use, making it really easy for anyone to use them in their work and then release it online. Tracklib also posts YouTube videos that break down samples, in a popular series, that has informed me a lot about the techniques producers use to transform samples into new beats. </p>
          <p>Both of these platforms have inspired me to want to create this project, to share my own view of sampling, and to present not only a textual presentation of its history and culture, but also audible and visual examples of the music and techniques that make it so special.</p>
{/*           
          <p>These two platforms have been instrumental to me as I have been learning about sampling over the last many years, especially as someone who has been dabbling with sample-based music creation after not playing musical instruments for a long time. The art of sampling, as born from hip-hop legends in the 20th century, inspired me to want to create in the same untraditional way that these pioneers did. When it came to it, WhoSampled and Tracklib stood out as primary references for seeing into the minds of these talented producers, as well as exploring new samples. But, I felt like they both did the same task in different ways; Tracklib was very visual, but lacked the extensive community database of WhoSampled. </p>
          <p>With this project, I wanted to take what I enjoyed most about both platforms, the visual grab of seeing the song chopped up and marked, with the hands on players that allow you to listen back and examine in your own time and space. While also being an informative platform for those that don't know much about sampling, I wanted to expose people to this form of musical creation not just by text and history, but by the music itself and the techniques that make it so special.</p>
            */}
        </SamplingHero>
      </section>

      <section className="text-section" id="history">
        {/* 
              Briefly (5 short sections) words, discuss the history of sampling as it birthed from limitations, the basic techniques of turntablism and crate digging, and its place in modern production
                      Goal is to set the scene for anyone that doesn't know about sampling, its history, or its fundamental process


              
        */}
        <h1>History</h1>
        <p className="sub">The origin of sampling as a tool for music creation follows five key cornerstone developments and critical factors that shaped the environment that allowed for sampling culture to be born</p>
        <div className="content-divider" />

        <HistoryTracklist>
          <NumberedSection index={1} title="The Constraint">
            <p>In the twentieth century, the ability to capture, manipulate and mass-distribute sound itself allowed listeners to "hear performers they could not see and music they could not normally bring into their homes" (Katz, 12). Recording studio technology evolved into something more powerful than just putting music on a disc, producers in the studio could be the architects of layered soundscapes, creating laboratories of sound manipulation. An industry was built around this creation, putting a price on musical experimentation.</p>
            <br/>
            <blockquote className="pull-quote">
              <Quote size={16} />
              <div>
                <p>Studio time, as well as musicians' fees, cost money, and technological delays could be frustrating and costly.</p>
                <cite>— Horning, 118</cite>
              </div>
            </blockquote>

            <p>Studio technology was a major breakthrough for pioneering the musical scenes listeners had access to, but the economic barriers that surrounded these technologies meant that only select industry creators had access to the best equipment</p>

          </NumberedSection>
          <NumberedSection index={2} title="Turntablism">
            <p>In the summer of 1973, legendary disc jockey Clive Campbell, aka DJ Kool Herc, hosted the "Back to School Jam" in the Bronx. Campbell had made an ingenious discovery; if he connected two turntables via an audio mixing device, he could rewind one record silently while the other one played. By using the audio mixer to control which turntable was outputting, he could play one record, switch to the other, rewind, and 'loop' a section of the song over and over.</p>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/FakAknt5KlI?si=cCQ7aZHj0K22-7LY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

            <p>With the addition of some big speakers, instead of having to get studio time to record their own music, these early hip-hop legends could just reuse the music they already had access to, and create their own energy outside of the studio</p>
          
          </NumberedSection>
          <NumberedSection index={3} title="Machines Arrived">
            <p>Turntables may have invented the workflow for sampling beats of records, but hip-hop didn't stop there. In the 1980s, other equipment like drum machines and audio samplers provided more sophisticated sound manipulation previously only accessible in a recording studio. </p> 
            <HistoryFigure
              src="https://upload.wikimedia.org/wikipedia/commons/b/be/Roland_TR-808_drum_machine.jpg"
              alt="Roland TR-808 drum machine"
              sourceHref="https://commons.wikimedia.org/wiki/File:Roland_TR-808_drum_machine.jpg"
              sourceLabel="Wikimedia Commons"
            /> 
            <p>The Roland TR-808 and its iconic synthesized drum sounds provided customizable drum effects, like the iconic <a>808 Kick</a>, provided producers with palette to take their sampled loops even further. Hip-hop producers could take a sampled record and add their own percussive sounds over the music, rather than being limited to sampled drums first. </p>
            <HistoryFigure
              src="https://upload.wikimedia.org/wikipedia/commons/4/46/E-mu_SP-1200_%28111607sp1200%29.jpg"
              alt="E-mu SP-1200 Sampler"
              sourceHref="https://commons.wikimedia.org/wiki/File:E-mu_SP-1200_(111607sp1200).jpg"
              sourceLabel="Wikimedia Commons"
            /> 
            <p>The E-mu SP-1200 took things a step deeper, allowing producers to load sampled audio into different pad banks that could then be played back in a unique order, effectively 'chopping' up a song into different sonic moments. </p>

            <TechTimeline steps={[
              { id: "turntable", label: "Turntable", era: "1973", icon: <Disc3 size={26}/>, caption: "Looped a break by ear, live." },
              { id: "drum-machine", label: "Drum Machines", era: "1980s", icon: <Grid3x3 size={26}/>, caption: "Added programmable percussion over a sample." },
              { id: "sampler", label: "Samplers", era: "Late 1980s", icon: <AudioWaveform size={26}/>, caption: "Chopped and replayed audio in a new order." },
              { id: "unknown", label: "???", icon: <HelpCircle size={26}/>, caption: "Where's it going next?" },
            ]} />
              {/* Timeline
            <p>[ Turntable ] → [ Drum Machines ] → [ Samplers ] → [ ??? ] </p>
            <p>Turntables provided the basics of re-composed music, looping musical phrases as new compositions</p>
            <p>Drum Machines allowed more creative development with sound effects on top of sampled music</p>
            <p>Samplers allowed for musical artifacts to be manipulated, broken up and reused in a new order</p> */}

            <p>These machines were all built for different purposes, turntables as listening devices, drum machines to provide percussion to organ players, samplers as idea-developing in-studio productions, all converted into musical tools for hip-hop producers to create new complete music from.</p>
        
          </NumberedSection>
          <NumberedSection index={4} title="Legal Reckoning">
            {
              // correct the first person I choice to a more legal focused historical approach rather than adding in the "I need to make note"
            }
            <p>These technologies laid the foundation for the techniques that became hip-hop music, and as these techniques have grown over time and become more popular, I need to make note of what that means for musical creation. Many artists have taken offense to hip-hop producers using their work as samples, it has brought up many debates about the legality of reusing someone else's music for your own creation. The legal world, after many incidents, has come to the conclusion that to use someone else's music for monetary gain, you need permission. In the early days, it was about creativity and exploration, not about exposure and monetization. But as the genre and demand grew, it was impossible to avoid the collision of creation and the legal limitations of sampling. </p>
            <p>Now, companies like Splice make business off of creating safe-to-use samples, royalty-free music, that are legally cleared to be used by anyone. But, the heart of hip-hop and sampling culture has always been to take what was already there, the music, the technology, the culture and create it into something new.</p>
          
          </NumberedSection>
          <NumberedSection index={5} title="Democratization">
            <p>Looking back, in 1970, you needed a massive room of expensive studio equipment to record a well-polished track. Now, you only need a laptop. Modern digital audio workstations (DAWs), are exactly that - digital software that allows you to do everything you would be able to do in a large studio. Ultimately, this has allowed producers of all genres to create music on the go, but has also opened up new opportunities for sampling to more precise and accessible. Now that you no longer need stockpiles of cash to record a single song, the process of music production and recording has become far more democratized than it was half a century ago. Anyone with a laptop can utilize free software and online services to record and share their music, and the rare and expensive tools of the past, are now the default tools for anyone with a laptop.</p>

          </NumberedSection>
        </HistoryTracklist>

      </section>

      <section className="text-section" id="techniques">
        <h1>Techniques</h1>
        <div className="content-divider" />
        <p> What sampling is truly, is a way to create from an already existing palette of music, something new and bold- but, ultimately uniquely personal. </p>
        <p> However, how the sampling is done, is vastly unlimited in approach. What I want to do now, is to highlight some common possible techniques by way of showcasing a selection of hip-hop and alternative musical sampling examples</p>

        {techniqueSections.map((t) => (
          <TechniqueSection key={t.id} id={t.id} title={t.title} blurb={t.blurb} studies={t.studies} />
        ))}

        {/* Section 1: Drum breaks */}
        {/* etc... */}
        {/*   The true meat of the project, going into depth about specific sampling techniques (or processes for creating a beat from samples):
              - drum breaks
              - sample flips
              - layered chops
              
              The idea is not to get super technical on exactly *how* a sample was transformed, but to highlight the processes that producers utilize to convert a sample into a beat
              Like, taking drums from one song and adding instrumental chops over it, or starting with a sample flip and layering in more drums

              Songs to think about could be:
                My Homie - prod. Alchemist (by ScHoolBoyQ)
                  -> song uses multiple samples
                  -> 1 sample for intro
                  -> 1 drum break
                  -> 1 instrumental-like sample ontop of the drums
                  => perfect breakdown 
                
                Stop - J Dilla
                  -> flip of one song
                  => perfect comparitive analysis

                Two Can Win - J Dilla
                  -> flip of one song
                  => same as above

                (honestly any songs off of Donuts that are flips are amazing as examples; Welcome to the Show, Last Donut of the Night, U-Love)

                Chocolate Buttermilk - Kool & The Gang
                  -> Drum Break

                The Corner - Common & Kanye West
                  -> Drum Break + layered sample

                Runnin' - The Pharcyde (prod. J Dilla)
                  -> Drums, and multiple instrumental + vocal samples

                For Keeps - JID 
                  -> Black Ivory Dont Turn Around
                  -> sample flip / chop with added drums (not a sample)

        */}
      </section>

          {/*
          
              if there are extra songs from above that dont really serve the dissection of the techniques, add some more playground examples here
              could also be an area for users to upload their own audio / youtube link and play around with the dev tool version of the player 
                  - chops and loops to allow them to mess around a little bit (might not be super efficient, but a neat idea)

              also maybe some closing thoughts about sampling and my desire to create this project

          */}
      <section className="text-section" id="examples-playground">
        <h1>Playground</h1>
        <div className="content-divider" />
        <p>Pick a clip below and try chopping it yourself — drop a few pads, loop a section, break out of the loop by hitting a different pad.</p>
        <Playground />
      </section>

      <section className="text-section" id="closer">
        <h1>Closing Thoughts</h1>
        <div className="content-divider" />
        <p>So, what's next? First, I hope this project was able to be as interactive as informative, I hope anyone here learned a little, but also got to mess around a little and explore the world of musical sampling. I hope to continue working on this as a project for an online sampling tool, as well as a place to curate and store samples for future use. Like WhoSampled, I hope to have a community of samplers here, but I know that isn't easy. For now, I want to use this as a tool for myself and my creative processes. In the future, it would be amazing if I could use this tool as a portable music maker, or simply as a catalog of samples that I have used or wish to use.</p>
        <p>At the end of it, thank you for reading and playing along. I hope it was as enjoyable for you as it was for me to put this all together. <br/>Thank you.</p>
      </section>

      <section className="text-section" id="bibliography">
                        <div className="content-divider"/>


        <p>
          AnkofunkTV1. (2012, January 30). Kool Herc & Grandwizard Theodor @ Viva Freestyle ft Storm [Video]. YouTube. https://www.youtube.com/watch?v=FakAknt5KlI E-MU SP-1200 (111607SP1200). (n.d.). https://commons.wikimedia.org/wiki/File:E-mu_SP-1200_(111607sp1200).jpg Horning, S. S. (2013). Chasing sound: Technology, Culture, and the Art of Studio Recording from Edison to the LP. JHU Press. Roland TR-808 drum machine. (n.d.). https://commons.wikimedia.org/wiki/File:Roland_TR-808_drum_machine.jpg
        </p>
           
      </section>

      <section id="author">
         <br/>
            <p>Seth Weintraub</p>
      </section>
      {/* <section id="examples-playground">
        <h1>Playground</h1>
         
the playground is going to be a section with the opportunity for users to mess around with samples - i want to have some box sections for different audios - drums, vocals, instruments, and sfx. and they can take any of these and load them into the waveform players - but just the lefthand side of the player, the actual waveform player. they can then add loops, add markers - which act as chops and create buttons to then playback those specific markers - and they can then add multiple of these as 'tracks' to kind of mix some music together.
might be a bit WIP by the time i launch this, but its the idea.
          
      </section> */}
    </>
  )
}

export default App
