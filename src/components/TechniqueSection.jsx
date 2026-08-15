import { Fragment } from 'react';
import './techniques.css'
import SampleBreakdown from './SampleBreakdown';

// `study.writeup` is an array of paragraph strings — your own words, one
// entry per <p>. `children` still works too, for the rare case study that
// needs something beyond plain paragraphs (a video embed, a pull quote,
// a second heading) — pass it when rendering <CaseStudy> by hand instead
// of through the mapped list.
export function CaseStudy({ study, children }) {
  return (
    <div className="case-study">
      <h3>{study.title} — {study.artist}{study.producer && ` (prod. ${study.producer})`}</h3>

      {study.writeup && study.writeup.map((para, i) => <p key={i}>{para}</p>)}
      {children}
{/*     
    id,
    inFile,
    outFile,
    inTitle,
    outTitle,
    inLabel = "Sample source",
    outLabel = "Used in",
    loop: loopProp,
    markers = [],
    timeMarkers = [50],
    className = "",
     */}
      {study.samples.map((s) => (
        <Fragment key={s.id}>
          {s.role && <p className="sample-role-label">{s.role}</p>}
            <SampleBreakdown
            id={s.id}
            inFile={s.inFile}
            inTitle={s.inTitle}
            outFile={s.outFile}
            outTitle={s.outTitle}
            loop={s.loop}
            markers={s.markers}
            timeMarkers={s.timeMarkers}
            initialZoom={s.initialZoom}
            />
        </Fragment>
      ))}
    </div>
  );
}

export default function TechniqueSection({ id, title, blurb, studies }) {
  return (
    <section id={id}>
      <h2>{title}</h2>
      <p>{blurb}</p>
      {studies.map((study) => <CaseStudy key={study.slug} study={study} />)}
    </section>
  );
}