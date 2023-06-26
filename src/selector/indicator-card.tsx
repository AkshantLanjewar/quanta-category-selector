import React, { useEffect, useState } from 'react'
import './indicator-card.scss'
import { TinyArea } from '@ant-design/plots'
import { config } from './chart-config'
import { IChartData, IQuantaIndicator, useFormatString } from 'quanta-selector-framework'

interface IANTParsedChartData {
    date: string,
    value: number
}

interface IIndicatorCardProps {
    indicator: IQuantaIndicator,
    setIndicatorCallback: (indicatorId: string) => void,
    activeIndicator: string | undefined
}

function getMonthShortName(monthNo: number) {
    const date = new Date();
    date.setMonth(monthNo - 1);
  
    return date.toLocaleString('en-US', { month: 'short' });
}

function validateChartData(chartData: IChartData[]) {
    for(let i = 0; i < chartData.length; i++) {
        let dataPoint = chartData[i]
        if(dataPoint.isProjection === undefined || dataPoint.xValue === undefined || dataPoint.yValue === undefined)
            return false
    }

    return true
}

function convertQuantaChartDataAnt(data: IChartData[]) {
    let convertedData = [] as IANTParsedChartData[]
    if(validateChartData(data) === false)
        return convertedData

    for(let i = 0; i < data.length; i++) {
        let point = data[i]
        let timestamp = point.xValue! * 1000
        let date = new Date(timestamp)
        
        let dateString = `${getMonthShortName(date.getMonth())} ${date.getFullYear()}`
        convertedData.push({ date: dateString, value: point.xValue! })
    }

    return convertedData
}

const IndicatorCard: React.FC<IIndicatorCardProps> = ({ indicator, setIndicatorCallback, activeIndicator }) => {
    const [settings, setSettings] = useState(config)
    const [title, setTitle] = useState<string | undefined>(undefined)
    const [short, setShort] = useState<string | undefined>(undefined)

    const formatter = useFormatString()

    useEffect(() => {
        let chartData = indicator.chartData
        if(chartData === undefined)
            return

        let convertedData = convertQuantaChartDataAnt(chartData)
        let nSettings = settings

        let antData = [] as number[]
        for(let i = 0; i < convertedData.length; i++)
            antData.push(convertedData[i].value)

        nSettings.data = antData
        nSettings['meta'] = {}
        nSettings['meta']['formatter'] = (value: any) => {
            return `Value ${value}`
        }

        setTitle(formatter("title", indicator))
        setShort(formatter("short", indicator))
        setSettings({ ...nSettings })
    }, [indicator])

    const onClick = (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        if(indicator.indicatorId === undefined)
            return

        e.stopPropagation()
        setIndicatorCallback(indicator.indicatorId)
    }

    return (
        <div 
            className={`indicator__card ${indicator.indicatorId === activeIndicator && 'active'}`}
            onClick={onClick}
        >
            <div className="indicator__chart">
                <TinyArea {...settings} />
            </div>

            <div className="indicator__title">
                <div className="name">
                    {title}
                </div>

                <div className="indicator__id">
                    {short}
                </div>
            </div>
        </div>
    )
}

export default IndicatorCard