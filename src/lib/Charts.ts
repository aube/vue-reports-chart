import {Component, Prop, Watch, Vue} from 'vue-property-decorator';
// @ts-ignore
import ChartJS from 'chart.js';

import {IDataChart, IChartDataset, IColumn, IChartFilter} from './Types';


@Component({})
export default class Charts extends Vue {
    position = 0;
    valuesAmount = 0;
    chart: any;
    opacity = .7;
    linewidth = 3;

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
    @Prop() filters!: IDataChart[];
    @Prop() legendPosition!: string;
    @Prop() yAxisHide!: string;
    @Prop() columns!: IColumn[];
    @Prop() type!: string;

    @Watch('data', { immediate: true, deep: true })
    // @ts-ignore
    onDataChanged(val: any, oldVal: any) {
        if (oldVal) {
            this.chart.options.animation.duration = 1000;
            this.position = 0;
            this.update();
        }
    }
    @Watch('filters', { immediate: true, deep: true })
    // @ts-ignore
    onDataChanged(val: any, oldVal: any) {
        if (oldVal) {
            this.chart.options.animation.duration = 0;
            this.update();
        }
    }

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


    getColors(from: number, amount: number, opacity: number = 1): string[] {
        let colors: string[] = [];

        for (let i = from; i <= from + amount; ++i) {
            colors.push(this.getColor(i, opacity));
        }

        return colors;
    }

    getColor(color: number | string, opacity: number = 1): string {
        color = typeof color === 'number' ? this.colors[color % this.colors.length] : color;
        return ChartJS.helpers
            .color(color)
            .alpha(opacity)
            .rgbString();
    }

    filterIsSelected(id: string, label: string): boolean {
        for (let filter of this.filters) {
            if (filter.id === id && ~filter.values.indexOf(label)) {
                return true;
            }
        }
        return false;
    }

    onClick(e: any) {
        let activePoints = this.chart.getElementsAtEvent && this.chart.getElementsAtEvent(e);
        activePoints = this.chart.getSegmentsAtEvent && this.chart.getSegmentsAtEvent(e) || activePoints;

        if ( activePoints.length > 0) {
            const clickedElementIndex = activePoints[0]._index;
            const clickedDatasetIndex = activePoints[0]._datasetIndex;
            const label = this.chart.data.labels[clickedElementIndex];
            const value = this.chart.data.datasets[clickedDatasetIndex].data[clickedElementIndex];
            this.$emit('onClickByPoint', {
                clickedElementIndex,
                clickedDatasetIndex,
                label,
                value,
                data: this.type === 'pie'
                    ? this.data[clickedDatasetIndex].data[clickedElementIndex]
                    : this.data[clickedElementIndex]
            });
        }
    }

    setupCursorStyleFn(e: any) {
        let point = this.chart.getElementAtEvent(e);
        e.target.style.cursor = point.length ? 'pointer' : 'default';
    }


    chartInit(options: any): void {

        const canvas: any = this.$refs.canvas;
        // this shit should be here because canvas.js guys
        // a little strange calculate canvas sizes:
        // "width" is 100% always,
        // and then height is set proportional by new width
        canvas.setAttribute('width', canvas.parentNode.offsetWidth);
        canvas.setAttribute('height', canvas.parentNode.offsetHeight);

        return new ChartJS(canvas, options);
    }


}
