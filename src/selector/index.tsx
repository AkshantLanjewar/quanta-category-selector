import { MantineProvider } from '@mantine/core'
import React, { useEffect } from 'react'
import SelectorTabs from './tabs'
import './index.scss'
import { ISchemaItem, usePingMessage, useSetSchema, useSetSelected } from 'quanta-selector-framework'

const CategorySelector: React.FC = ({ }) => {
    const pingMessage = usePingMessage()
    const setSchema = useSetSchema()
    const setSelected = useSetSelected()
    
    useEffect(() => {
        pingMessage("monitor")

        let schema = [
            {
                name: "indicator_id",
                type: "string"
            }
        ] as ISchemaItem[]

        setSchema("indicator_selector_schema", schema)
        setSelected("indicator_selector_schema", undefined)
    }, [])

    return (
        <>
            <MantineProvider
                theme={{ colorScheme: 'dark' }}
                withGlobalStyles
                withNormalizeCSS
                withCSSVariables
            >
                <div id="monitor" style={{ height: "100%", background: "#101113" }}>
                    <SelectorTabs />
                </div>
            </MantineProvider>
        </>
    )
}

export default CategorySelector