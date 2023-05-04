import React, { useEffect, useState } from 'react'
import './tabs.scss'
import { Tabs } from '@mantine/core'
import Pager from './pager'
import { useAnalysis } from 'quanta-selector-react'

const SelectorTabs: React.FC = ({ }) => {
    const [categories, setCategories] = useState<string[] | undefined>(undefined)
    const analysis = useAnalysis()

    async function analyze() {
        if(analysis === null)
            return

        let analysisKeys = Object.keys(analysis)
        if(analysisKeys.includes('category') === false)
            return

        let object = analysis['category']
        let categoryArray = object.stringArray
        if(categoryArray === undefined)
            categoryArray = [] as string[]

        categoryArray.unshift('All')
        setCategories([ ...categoryArray ])
    }

    useEffect(() => {
        analyze()
    }, [analysis])

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