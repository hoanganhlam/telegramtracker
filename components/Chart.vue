<template>
  <div class="line-chart">
    <div class="h-48">
      <canvas ref="myChart"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

let chart;
const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
    },
    y: {
      stacked: true,
      beginAtZero: false,
      position: 'left',
      grid: {
        display: false,
      },
    },
    y1: {
      stacked: true,
      type: 'linear',
      display: true,
      position: 'right',
    },
  },
  plugins: {
    legend: {
      display: false,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'rectRounded',
      },
    },
    title: {
      display: false,
    },
    tooltip: {
      mode: 'index',
    },
  },
  fill: false,
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false,
  },
  radius: 0,
}
export default {
  name: "Chart",
  props: {
    data: {
      default: null,
      type: Object
    }
  },
  methods: {
    async loadData() {
      const ctx = this.$refs['myChart'];
      if (this.data) {
        if (chart) {
          chart.destroy();
        }
        chart = new Chart(ctx, {
          type: 'line',
          data: this.data,
          options: options
        });
      }
    }
  },
  mounted() {
    this.loadData()
  },
  watch: {
    data() {
      this.loadData()
    }
  }
}
</script>

