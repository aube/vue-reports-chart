<template>
    <div class="chart-container row"
        @-#@!-mousewheel.prevent="onScroll">
        <div class="col-6">
            <canvas :width='width' :height='height' ref="canvas"
                @click="onClick"></canvas>
        </div>


        <div class="col-6">
            <p class="m-1" v-for="(amount, label) in getLegend">
                <span>
                    {{label}}
                </span> - 
                <strong>
                    {{amount}}
                </strong>
            </p>
        </div>

    </div>
</template>

<script lang="ts">
import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
import Charts from '../lib/Charts';
// @ts-ignore
import ChartJS from 'chart.js';

import {IRawData, IChartPieDataset, IColumn, IDataChart} from '../lib/Types';


@Component({})
export default class ChartPie extends Charts {
    position = 0;
    valuesAmount = 0;
    chart: any;
    opacity = .7;
    linewidth = 3;
    tst: number[] = [];
    colors = [
        '#8B0000',
        '#FF8C00',
        '#006400',
        '#483D8B',
        '#2F4F4F',
        '#228B22',
        '#191970',
        '#FF4500',
        '#663399'
    ];


    @Prop() width!: string;
    @Prop() height!: string;
    @Prop() data!: IDataChart[];
    @Prop() legendPosition!: string;


    update() {
        this.chart.data.datasets = this.getDatasets();
        this.chart.data.labels = this.getLabels;
        this.chart.update();
    }

    get getLabels() {
        let labels: string[] = [];
        this.data.forEach((ds: any) => {
            labels = labels.concat(ds.labels);
        });
        return labels;
    }

    get getLegend() {
        let legend: any = {};
        let datasets = this.getDatasets();

        datasets.forEach((ds: any) => {
            for (let i = 0; i < ds.data.length; ++i) {
                legend[ds.labels[i]] = ds.data[i];
            }
        });

        return legend;
    }

    getDatasets(): any {
        let datasets: IChartPieDataset[] = [];
        let i = 0;

        this.data.forEach((ds: any) => {
            let dataset: IChartPieDataset = Object.assign({}, ds);

            dataset.label = ds.label;
            dataset.data = ds.data;
            dataset.backgroundColor = this.getColors(i, ds.data.length, ds.opacity || this.opacity);
            dataset.hoverBackgroundColor = this.getColors(i, ds.data.length, ds.opacity || this.opacity);
            i += ds.data.length;

            datasets.push(dataset);
        });

        return datasets;
    }

    mounted(): void {

        const options = {
            type: 'pie',
            data: {
                labels: this.getLabels,
                datasets: []
            },
            options: {
                responsive: true,
                legend: {
                    position: this.legendPosition || 'right',
                },
                tooltips: {
                    callbacks: {
                        label(tooltipItem: any, data: any) {
                            let label = data.datasets[tooltipItem.datasetIndex].labels[tooltipItem.index];
                            let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                            return label + ': ' + value;
                        }
                    }
                },
                hover: {
                    onHover: this.setupCursorStyleFn
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
        // width: 40px;
        // height: 40px;
    }
}
</style>
