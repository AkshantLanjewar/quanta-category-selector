import { MantineProvider } from '@mantine/core'
import React, { useEffect } from 'react'
import SelectorTabs from './tabs'
import './index.scss'
import { ISchemaItem, usePingMessage, useSetSchema, useSetSelected } from 'quanta-selector-framework'
import { IDims } from '..'

interface IProps {
    dims: IDims | undefined
}

const CategorySelector: React.FC<IProps> = ({ dims }) => {
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
                    <SelectorTabs dims={dims} />
                </div>
            </MantineProvider>
        </>
    )
}

export default CategorySelector