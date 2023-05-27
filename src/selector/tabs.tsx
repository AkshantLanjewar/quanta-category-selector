import React, { useEffect, useState } from 'react'
import './tabs.scss'
import { Tabs } from '@mantine/core'
import Pager from './pager'
import { useAnalysis, useAnalysisUpdated } from 'quanta-selector-framework'

const SelectorTabs: React.FC = ({ }) => {
    const [categories, setCategories] = useState<string[] | undefined>(undefined)

    const analysis = useAnalysis()
    const analysisUpdated = useAnalysisUpdated()

    async function analyze() {
        if(analysis === null)
            return

        let internalAnalysis = JSON.parse(JSON.stringify(analysis))
        let analysisKeys = Object.keys(internalAnalysis)
        if(analysisKeys.includes('category') === false)
            return

        let object = internalAnalysis['category']
        let categoryArray = object.stringArray
        if(categoryArray === undefined)
            categoryArray = [] as string[]

        categoryArray.unshift('All')
        setCategories([ ...categoryArray ])
    }

    useEffect(() => {
        analyze()
    }, [analysisUpdated])

    return (
        <div className={"tabs__wrapper"}>
            <Tabs
                variant='pills'
                color='indigo'
                defaultValue={'example'}
            >
                <Tabs.List style={{ justifyContent: "center" }}>
                    {categories && categories.map((step) => (
                        <Tabs.Tab value={step.toLowerCase()}>
                            {step}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                {categories && categories.map((step) => (
                    <Tabs.Panel
                        value={step.toLowerCase()}
                        pt={"md"}
                    >
                        <Pager category={step} />
                    </Tabs.Panel>
                ))}
            </Tabs>
        </div>
    )
}

export default SelectorTabs