import { Stack, Pagination, SimpleGrid } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import IndicatorCard from './indicator-card'
import { IQuantaIndicator, IQuantaQuery, useAnalysis, useIndicatorsLength, useIndicatorsPaged } from 'quanta-selector-react'

const PAGE_LENGTH = 20
const QUERY_MONITOR = 400

interface IPagerProps {
    category: string
}

const Pager: React.FC<IPagerProps> = ({ category }) => {
    const [page, setPage] = useState<number | undefined>(undefined)
    const [pageLength, setPageLength] = useState<number | undefined>(undefined)
    const [query, setQuery] = useState<IQuantaQuery[] | undefined | number>(QUERY_MONITOR)
    const [indicators, setIndicators] = useState<IQuantaIndicator[]>([])

    const analysis = useAnalysis()
    const indicatorsLength = useIndicatorsLength()
    const queryIndicatorsPage = useIndicatorsPaged()
    
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

        let query: IQuantaQuery[] | undefined = undefined
        if(category !== 'All') {
            query = []
            //add the category
            query.push({
                fieldKey: "category", // reserved field keyword
                fieldType: "string",
                stringField: category
            })

            //add any previously selected objects to the query
            for(let i = 0; i < queryKeysList.length; i++) {
                let queryKey = queryKeysList[i]
                let keySplit = queryKey.split('::')
                if(keySplit.length < 2)
                    continue

                let field = analysis[queryKey]
                if(field.isArray === true)
                    continue

                query.push({
                    fieldKey: keySplit[1],
                    fieldType: field.objectType,
                    stringField: field.stringValue,
                    dateField: field.dateValue
                })
            }
        }

        //get the amount of indicators
        const indicatorTotal = await indicatorsLength(query)
        if(indicatorTotal === undefined)
            return

        let nTotalPages = Math.ceil(indicatorTotal / PAGE_LENGTH)

        setPageLength(nTotalPages)
        setPage(0)
        setQuery(query)
    }

    useEffect(() => {
        request()
    }, [analysis])

    async function fetchPage() {
        if(pageLength === undefined || page === undefined)
            return
        if(query === QUERY_MONITOR || typeof query === 'number')
            return
        
        //get the active page
        setIndicators([])
        let indicators = await queryIndicatorsPage(page, PAGE_LENGTH, query)
        if(indicators === undefined)
            return

        setIndicators([ ...indicators ])
    }

    useEffect(() => {
        fetchPage()
    }, [page])
    
    return (
        <Stack justify={'center'}>
            <SimpleGrid cols={5}>
                {indicators.map((step) => (
                    <IndicatorCard indicator={step} />
                ))}
            </SimpleGrid>

            {pageLength && page && (
                <Pagination
                    total={pageLength}
                    page={page + 1}
                    onChange={(page) => setPage(page - 1)}
                    size={"md"}
                    radius={"xl"}
                    pt={'md'}
                    sx={{ justifyContent: 'center' }}
                />
            )}
        </Stack>
    )
}

export default Pager