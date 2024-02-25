<template>
  <div ref="test"></div>
</template>
<script>
import 'gantt-schedule-timeline-calendar/dist/style.css'
import GSTC from "gantt-schedule-timeline-calendar";

export default {
  data() {
      return {
          ganttSate: null,
          sc: null,
          rowsFromDB: [
              {
                  id: 1,
                  label: "Row 1",
              },
              {
                  id: 2,
                  label: "Row 2",
              },
          ]
      }
  },
  mounted() {
      this.initGantt();
  },
  beforeUnmount() {
      this.sc.close();
  },
  methods: {
      initGantt() {
          const itemsFromDB = [
              {
                  id: "1",
                  label: "Item 1",
                  rowId: "1",
                  time: {
                      start: GSTC.api.date("2020-01-01").startOf("day").valueOf(),
                      end: GSTC.api.date("2020-01-05").endOf("day").valueOf(),
                  },
              },
              {
                  id: "2",
                  label: "Item 2",
                  rowId: "1",
                  time: {
                      start: GSTC.api.date("2020-02-01").startOf("day").valueOf(),
                      end: GSTC.api.date("2020-02-03").endOf("day").valueOf(),
                  },
              },
              {
                  id: "3",
                  label: "Item 3",
                  rowId: "1",
                  time: {
                      start: GSTC.api.date("2020-01-15").startOf("day").valueOf(),
                      end: GSTC.api.date("2020-01-20").endOf("day").valueOf(),
                  },
              },
          ];
          const columnsFromDB = [
              {
                  id: "id",
                  label: "ID",
                  data: ({ row }) => GSTC.api.sourceID(row.id),
                  sortable: ({ row }) => Number(GSTC.api.sourceID(row.id)),
                  width: 80,
                  header: {
                      content: "ID",
                  },
              },
              {
                  id: "label",
                  data: "label",
                  sortable: "label",
                  isHTML: false,
                  width: 150,
                  header: {
                      content: "标题",
                  },
              },
          ];
          // https://gstc.neuronet.io/free-key/
          const config = {
              licenseKey: "====BEGIN LICENSE KEY====\nm9C8wl8T0To16D1xR28WGIYU/pJTX7zFGuYD+FOm781fotizfr9gANTvXx8+ECwTpy/j0oe/H0HrAtYZhKdr9tF1/8CZZ56CWr7zm0PCjHmfgvPnVmqKZy6FyFQSfo2yCqg2ImGT++1Qyxja/nlr0CnLvU8KOn+vCty/a2W5Yhq+GstXfey+f5k3EDchTXH2q6BsQS12ScW1fr0dx8uAD6d62aMz/JIbNrAI8aJ7RAqujOWcBDv0o8MV4TyqfNjasekCDxZH78HrD2yOf44s3dTOFUnuNgCsw3bPYGH8RV+i2vlzIY8U2Mlx1Va29Wj6Ynv+BVO2zgkzvxiwB5mVzw==||U2FsdGVkX1/5trA8seitSL2vdulM8dak0bzA3D5oNVyLCx583vKzCYv+A6AHMk2N7vtBB4w5FSSq0fXfTwykYk179oy8Z620/oJfeX7Bn5g=\nX7o1rFiM+5OaP2K5Yh8KHNFMsXK7XrKE9SywMYbAV41BtuQr91WeORb43NeazsxD3uT/a5wM0+kFDxPP9Fn5KauFbRdSe21QRb4KiqiM2zH4jnwTZq8PoP6A6ZwUWwDVAtFoOg1V5jSfsTP6UXKeytYks45IxO7IkJEdiV07Vr4OPcwq+/K7qI2NQHCEC8h/epwYY53lOxwdEkMsu1wtRyF4C286q4+Gg+8wMlKCfvdeiXFcj52uHFsRBTawtOk0VedRwOgE7Xb2eu9xWrboAlhQ4Uh/6TV7SIFb/mvfAPfUapNIllXWCxvQByufi7VqUoNFHmzV+rLqOxxLP3XKgg==\n====END LICENSE KEY====",
              list: {
                  columns: {
                      data: GSTC.api.fromArray(columnsFromDB),
                  },
                  rows: GSTC.api.fromArray(this.rowsFromDB),
              },
              chart: {
                  items: GSTC.api.fromArray(itemsFromDB),
              },
          };
          this.ganttSate = GSTC.api.stateFromConfig(config);
          const app = GSTC({
              element: this.$refs.test,
              state: this.ganttSate,
          });
      },
  },
}
</script>
<style lang="scss">

</style>