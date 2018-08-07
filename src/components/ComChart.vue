<template>
    <canvas ref="canvas" @click="onClick"></canvas>
</template>

<script lang="ts">
import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
import Charts from '../lib/Charts';
// @ts-ignore
import ChartJS from 'chart.js';

import {IDataChart, IChartDataset, IColumn} from '../lib/Types';


@Component({})
export default class Chart extends Charts {
    position = 0;
    valuesAmount = 0;
    chart: any;
    opacity = .7;
    linewidth = 3;

    @Prop() width!: string;
    @Prop() height!: string;
    @Prop() xAxisColumn!: string;
    @Prop() yAxisHide!: string;
    @Prop() columns!: IColumn[];

    @Watch('columns', { immediate: true, deep: false })
    onOptionsChanged(val: any, oldVal: any) {
        if (oldVal) {
            this.chart.options.animation.duration = 1000;
            this.chart.data.datasets = this.getDatasets();
            this.update();
        }
    }

    // onScroll(e: any): void {
    //     this.position += e.deltaY > 0 ? 1 : -1;
    //     this.position = Math.max(this.position, 0);
    //     this.chart.options.animation.duration = 10;
    //     this.update();
    // }

    update() {
        let i = 0;
        this.columns.forEach((ds) => {
            this.chart.data.datasets[i++].data = this.calculateData(ds.id);
        });

        this.yAxisVisibility();
        this.chart.data.labels = this.labelsX;
        this.chart.update();
    }

    yAxisVisibility() {
        let selectedColumnsIDs: string[] = [];
        this.columns.forEach((col) => {
            selectedColumnsIDs.push(col.yAxisID);
        });

        if (this.chart.options.scales) {
            this.chart.options.scales.yAxes.forEach((scale: any) => {
                scale.display = ~selectedColumnsIDs.indexOf(scale.id) * +!this.yAxisHide;
            });
        }
    }

    get labelsX() {
        let labelsX: string[] = [];
        let iMax = Math.min(this.data.length, this.valuesAmount + this.position);
        iMax = Math.max(0, this.data.length);

        for (let i = this.position; i < iMax; ++i) {
            labelsX.push(this.data[i].labelX.split('-').splice(-1)[0]);
        }
        return labelsX;
    }

    calculateData(name: string): number[] {
        let dataset: number[] = [];
        let iMax = Math.min(this.data.length, this.valuesAmount + this.position);
        iMax = Math.max(0, this.data.length);

        for (let i = this.position; i < iMax; ++i) {
            dataset.push(this.data[i][name]);
        }
        return dataset;
    }

    getColors(opacity: number): string[] {
        let colors: string[] = [];

        for (let i = 0; i <= this.columns.length; ++i) {
            colors.push(ChartJS.helpers
                    .color(this.colors[i % this.colors.length])
                    .alpha(opacity)
                    .rgbString()
            );
        }

        return colors;
    }

    getDatasets(): any {
        let datasets: IChartDataset[] = [];
        let i = 0;

        this.columns.forEach((ds: any) => {
            let dataset: IChartDataset = Object.assign({}, ds);

            dataset.type = dataset.type || 'bar';
            dataset.label = ds.label;
            dataset.yAxisID = ds.yAxisID;
            dataset.data = this.calculateData(ds.id);
            dataset.borderWidth = dataset.type === 'bar' ? 1 : 3;

            dataset.backgroundColor = this.getColor(ds.color, ds.opacity || this.opacity);
            dataset.borderColor = this.getColor(ds.color);
            dataset.hoverBackgroundColor = this.getColor(ds.color);

            datasets.push(dataset);
        });
        return datasets;
    }


    mounted(): void {
        const options = {
            type: this.type || 'bar',
            data: {
                labels: this.labelsX,
                datasets: []
            },
            options: {
                responsive: true,
                legend: {
                    position: 'bottom'
                },
                tooltips: {
                    mode: 'index'
                },
                hover: {
                    onHover: this.setupCursorStyleFn
                },
                scales: {
                    xAxes: [{
                        // type: 'time',
                        // time: {
                        //     unit: 'day', // millisecond, second, minute, hour, day, week, month, quarter, year
                        //     // tooltipFormat: 'll HH:mm'
                        // },
                        scaleLabel: {
                            display: false,
                            labelString: '...'
                        }
                    }],

                    yAxes: [{
                        type: 'linear',
                        display: true,
                        position: 'left',
                        id: 'hundreds',
                        ticks: {
                            // the data minimum used for determining the ticks is Math.min(dataMin, suggestedMin)
                            // stepSize: 10,
                            min: 0,
                            // max: 100
                        }
                    }, {
                        type: 'linear', // logarithmic
                        display: true,
                        position: 'left',
                        id: 'thousands',
                        ticks: {
                            // the data minimum used for determining the ticks is Math.min(dataMin, suggestedMin)
                            // stepSize: 10,
                            min: 0
                        }
                        // gridLines: {
                        //     drawOnChartArea: false
                        // }
                    }]
                }
            }
        };
        options.data.datasets = this.getDatasets();

        this.chart = this.chartInit(options);
        this.update();
    }



}

</script>

<style scoped lang="scss">
.chart-container {
    width: 100%;
    &:hover {
        background-color: #fafafa;
    }
    canvas {
        // width: 100%;
        // height: 333px;
        // height: 400px;
    }
}
</style>
