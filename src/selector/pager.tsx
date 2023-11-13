import { Stack, Pagination, SimpleGrid } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import IndicatorCard from './indicator-card'
import { IQuantaIndicator, IQuantaQuery, useAnalysis, useIndicatorsLength, useIndicatorsPaged, useAnalysisUpdated } from 'quanta-selector-framework'
import { usePrevious } from '@mantine/hooks'
import { IDims } from '..'

const PAGE_LENGTH = 20
const QUERY_MONITOR = 400
const QUERY_ALL = 420

interface IPagerProps {
    dims: IDims | undefined,
    category: string,
    setIndicatorCallback: (indicatorId: string) => void,
    activeIndicator: string | undefined,
    addIndicatorBlockCallback: (indicatorBlock: IQuantaIndicator[]) => void,
    allIndicators: IQuantaIndicator[]
}

const Pager: React.FC<IPagerProps> = ({ 
    dims,
    category, 
    setIndicatorCallback, 
    activeIndicator, 
    addIndicatorBlockCallback,
    allIndicators 
}) => {
    const [page, setPage] = useState<number | undefined>(undefined)
    const [pageLength, setPageLength] = useState<number | undefined>(undefined)
    const [query, setQuery] = useState<IQuantaQuery[] | undefined | number>(QUERY_MONITOR)
    const [indicators, setIndicators] = useState<IQuantaIndicator[]>([])
    const [cols, setCols] = useState(0)

    const analysis = useAnalysis()
    const analysisUpdated = useAnalysisUpdated()

    const indicatorsLength = useIndicatorsLength()
    const queryIndicatorsPage = useIndicatorsPaged()

    useEffect(() => {
        let page_length = Math.ceil(allIndicators.length / PAGE_LENGTH)
        if(category !== 'All')
            return
        
        setPageLength(page_length)
        setPage(0)
        setIndicators([ ...allIndicators ])
    }, [allIndicators])

    useEffect(() => {
        if(dims === undefined)
            return

        let containerWidth = dims.width
        let nCols = Math.round(containerWidth / 270)
        setCols(nCols)
    }, [dims])
    
    async function request() {
        if(analysis === null)
            return

        let queryKeys = Object.keys(analysis)
        let queryKeysList = [] as string[]
        for(let i = 0; i < queryKeys.length; i++) {
            let key = queryKeys[i]
            let keySplit = key.split('::')

            if(keySplit.length < 2)
                continue
            if(keySplit[0] === "query")
                queryKeysList.push(key)
        }

        let nQuery: IQuantaQuery[] | number | undefined = QUERY_MONITOR
        if(category !== 'All') {
            nQuery = []
            //add the category
            nQuery.push({
                fieldKey: "category", // reserved field keyword
                fieldType: "string",
                stringField: category
            })

            //add any previously selected objects to the query
            for(let i = 0; i < queryKeysList.length; i++) {
                let queryKey = queryKeysList[i]
                let keySplit = queryKey.split('::')
                if(keySplit.length < 2 || keySplit[0] !== 'query')
                    continue

                let field = analysis[queryKey]
                if(field.isArray === true)
                    continue

                    nQuery.push({
                    fieldKey: keySplit[1],
                    fieldType: field.objectType,
                    stringField: field.stringValue,
                    dateField: field.dateValue
                })
            }
        } else {
            nQuery = undefined
        }

        //get the amount of indicators
        const indicatorTotal = await indicatorsLength(nQuery)
        if(indicatorTotal === undefined)
            return

        let nTotalPages = Math.ceil(indicatorTotal / PAGE_LENGTH)
        setQuery(nQuery)
        setPageLength(nTotalPages)
        setPage(0)
    }

    useEffect(() => {
        request()
    }, [analysisUpdated])

    async function fetchPage() {
        if(pageLength === undefined || page === undefined)
            return
        if(query === QUERY_MONITOR || typeof query === 'number' || pageLength === 0)
            return
        
        //get the active page
        setIndicators([])
        let indicators = await queryIndicatorsPage(page, PAGE_LENGTH, query)
        if(indicators === undefined)
            return

        setIndicators([ ...indicators ])
        //add the indicators to the all page
        addIndicatorBlockCallback(indicators)
    }

    useEffect(() => {
        fetchPage()
    }, [page])

    let paginationComponent = undefined
    if(pageLength !== undefined && page !== undefined)
        paginationComponent = (
            <Pagination
                total={pageLength}
                page={page + 1}
                onChange={(page) => setPage(page - 1)}
                size={"md"}
                radius={"xl"}
                pt={'md'}
                sx={{ justifyContent: 'center' }}
            />
        )
    
    return (
        <Stack justify={'center'} sx={{ minHeight: 100 }}>
            <SimpleGrid 
                cols={cols} 
                sx={{ paddingLeft: 10, paddingRight: 10 }}
                data-testId={'indicator-cards'}
            >
                {indicators.map((step, i) => {
                    return (
                        <IndicatorCard 
                            indicator={step} 
                            index={i}
                            setIndicatorCallback={setIndicatorCallback}
                            activeIndicator={activeIndicator}
                        />
                    )
                })}
            </SimpleGrid>

            {paginationComponent}
        </Stack>
    )
}

export default Pager