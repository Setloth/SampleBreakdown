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
        inFile={selected?.file}
        inTitle={selected?.title}
        single
        pads
      />
    </>
  )
}