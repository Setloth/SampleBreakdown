import { useState } from "react"
import PlaygroundLibrary from "./PlaygroundLibrary"
import SampleBreakdown from "./SampleBreakdown"
import { playgroundLibrary } from "../data/playground-library"

export default function Playground() {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <PlaygroundLibrary
        library={playgroundLibrary}
        activeId={selected?.id}
        onSelect={setSelected}
      />
      <SampleBreakdown
        loop={{editable: true, start: 0, end: null, enabled: false}}
        inFile={selected?.file}
        inTitle={selected?.title}
        single
        pads
      />
    </>
  )
}