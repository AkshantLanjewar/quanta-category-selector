export const data = [1, 2, 3, 4, 5, 8, 3, 4, 7, 2, 5]
export const config = {
    autoFit: true,
    data,
    smooth: true,
    color: 'red',
    pattern: {
        type: 'line',
        cfg: {
            stroke: '#364fc7',
            backgroundColor: '#141517',
            fill: '#000000'
        },
        backgroundColor: 'white'
    }, 
    
    areaStyle: {
        fill: 'white'
    },

    line: {
        size: 2,
        color: '#364fc7'
    },

    type: 'areaStyle',
    padding: [10, -13, -1, -13]
} as any