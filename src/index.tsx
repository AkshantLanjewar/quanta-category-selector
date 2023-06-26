import { SelectorWrapper } from "quanta-selector-framework"
import React from "react"
import { render } from 'react-dom'
import CategorySelector from "./selector"

const App: React.FC = ({ }) => {
    return (
        <div style={{ minWidth: 500 }}>
            <SelectorWrapper>
                <CategorySelector />
            </SelectorWrapper>
        </div>
    )
}

render(<App />, document.getElementById("root"))