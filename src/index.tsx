import { SelectorWrapper } from "quanta-selector-framework"
import React, { useEffect, useRef, useState } from "react"
import { render } from 'react-dom'
import CategorySelector from "./selector"

interface IDims {
    width: number,
    height: number
}

const App: React.FC = ({ }) => {
    const [dims, setDims] = useState<IDims | undefined>(undefined)
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const bodyElement = document.getElementById("root")
        if(bodyElement === null)
            return

        const resize_ob = new ResizeObserver((entries) => {
            let rect = entries[0]
            const bounding = rect.target.getBoundingClientRect()

            console.log(bounding)
            setDims({ width: bounding.width, height: bounding.height })
        })

        resize_ob.observe(bodyElement)
    }, [])
    
    return (
        <div 
            ref={ref} 
            style={{ 
                minWidth: 500, 
                width: "100vw", 
                height: "100vh",
                overflowY: "scroll" 
            }}
        >
            <SelectorWrapper>
                <CategorySelector dims={dims} />
            </SelectorWrapper>
        </div>
    )
}

export type { IDims }
render(<App />, document.getElementById("root"))