import { SelectorWrapper } from "quanta-selector-framework"
import React from "react"
import { render } from 'react-dom'
import CategorySelector from "./selector"

const App: React.FC = ({ }) => {
    return (
        <>
            <SelectorWrapper>
                <CategorySelector />
            </SelectorWrapper>
        </>
    )
}

render(<App />, document.getElementById("app"))