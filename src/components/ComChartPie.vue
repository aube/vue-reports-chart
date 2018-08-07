<template>
    <canvas ref="canvas" @click="onClick"></canvas>
</template>

<script lang="ts">
import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
import Charts from '../lib/Charts';
// @ts-ignore
import ChartJS from 'chart.js';

import {IRawData, IChartPieDataset, IColumn, IDataChart} from '../lib/Types';


@Component({})
export default class ChartPie extends Charts {
    type = 'pie';
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

        // тут сделано под несколько наборов данных, но клик, наведение и фильтрацию нужно доделывать,
        // т.к. из коробки они работают неправильно, поэтому лучше ограничиться одним набором
        this.data.forEach((ds: any) => {
            let dataset: IChartPieDataset = Object.assign({}, ds);
            dataset.label = ds.label;
            dataset.data = ds.data;

            dataset.borderColor = [];
            dataset.backgroundColor = [];
            dataset.hoverBackgroundColor = [];
            ds.labels.forEach((label: string) => {
                let opacity = ds.opacity || this.opacity;
                let borderColor = this.getColor('#ffffff', opacity);
                if (this.filterIsSelected(ds.id, label)) {
                    opacity = 1;
                    borderColor = this.getColor('tomato', opacity);
                }
                dataset.backgroundColor.push(this.getColor(i, opacity));
                dataset.hoverBackgroundColor.push(this.getColor(i++, opacity * 2));
                dataset.borderColor.push(borderColor);
            });

            datasets.push(dataset);
        });

        return datasets;
    }


    mounted(): void {
        const options = {
            type: this.type,
            data: {
                labels: this.getLabels,
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
</style>
