import React, { useCallback, useEffect, useState } from 'react'
import './tabs.scss'
import { Tabs } from '@mantine/core'
import Pager from './pager'
import { IQuantaIndicator, useAnalysis, useAnalysisUpdated, useSetSelected } from 'quanta-selector-framework'
import { IDims } from '..'

interface IProps {
    dims: IDims | undefined
}

const SelectorTabs: React.FC<IProps> = ({ dims }) => {
    const [categories, setCategories] = useState<string[] | undefined>(undefined)
    const [activeIndicator, setActiveIndicator] = useState<string | undefined>(undefined)
    const [allIndicators, setAllIndicators] = useState<IQuantaIndicator[]>([])

    const analysis = useAnalysis()
    const analysisUpdated = useAnalysisUpdated()
    const setSelected = useSetSelected()

    const setIndicatorCallback = useCallback((indicatorId: string) => {
        let selectedObject = {
            indicator_id: indicatorId
        }
        
        setSelected("indicator_selector_schema", selectedObject)
        setActiveIndicator(indicatorId)
    }, [])

    const addIndicatorBlockCallback = useCallback((indicatorBlock: IQuantaIndicator[]) => {
        let oldIndicators = allIndicators
        let newIndicators = [ ...oldIndicators, ...indicatorBlock ]

        setAllIndicators([ ...newIndicators ])
    }, [allIndicators])

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

    const wrapperClicked = () => {
        setActiveIndicator(undefined)
    }

    return (
        <div className={"tabs__wrapper"}>
            <Tabs
                variant='pills'
                color='indigo'
                defaultValue={'example'}
                keepMounted={false}
            >
                <Tabs.List 
                    style={{ justifyContent: "center" }}
                    data-testId={'categories'}
                >
                    {categories && categories.map((step) => (
                        <Tabs.Tab 
                            value={step.toLowerCase()}
                            data-testId={`category-${step.toLowerCase()}`}
                        >
                            {step}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                {categories && categories.map((step) => (
                    <Tabs.Panel
                        value={step.toLowerCase()}
                        pt={"md"}
                        onClick={wrapperClicked}
                    >
                        <Pager 
                            dims={dims}
                            category={step} 
                            setIndicatorCallback={setIndicatorCallback}
                            activeIndicator={activeIndicator}
                            addIndicatorBlockCallback={addIndicatorBlockCallback}
                            allIndicators={allIndicators}
                        />
                    </Tabs.Panel>
                ))}
            </Tabs>
        </div>
    )
}

export default SelectorTabs