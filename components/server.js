import Vue from "vue";
import Icon from "./Icon/Icon";

Vue.component('Icon', Icon);

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

Date.prototype.isNow = function () {
  const d = new Date();
  const date = new Date(this.valueOf());
  return date.getDate() === d.getDate() && date.getMonth() === d.getMonth() && date.getFullYear() === d.getFullYear();
}

Date.prototype.str = function () {
  return (
    `${monthNames[this.getMonth()]} ${this.getDate()}, ${this.getFullYear()}`
  )
}

Date.prototype.normalize = function () {
  const d = this.getDate()
  const m = this.getMonth() + 1
  return (
    `${this.getFullYear()}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`
  )
}

Date.prototype.setZero = function () {
  this.setHours(0)
  this.setMinutes(0)
  this.setSeconds(0)
}


Vue.mixin({
  methods: {
    timeSince(dateStr, isCountdown = false) {
      const date = new Date(dateStr);
      const compareDate = new Date();
      let seconds = Math.floor((isCountdown ? date - compareDate : compareDate - date) / 1000);
      let isN = true;
      if (seconds < 0) {
        isN = false;
        seconds = 0 - seconds;
      }
      let interval = seconds / 31536000;
      if (interval > 1) {
        return Math.floor(interval) + " years"
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + " months"
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " days"
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " hours"
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " minutes"
      }
      return Math.floor(seconds) + " seconds"
    },
    dateFormat(dateStr) {
      const arr = dateStr.split("T")
      const arr2 = arr[1].split(":")
      return `${arr[0]} ${arr2[0]}:${arr2[1]}`
    },
    eventTimeStr(now, dateStart, dateEnd) {
      const start = new Date(dateStart)
      const end = new Date(dateEnd)
      if (now.getTime() < start.getTime()) {
        // UPCOMING
        return `Start in ${this.timeSince(dateStart)}`
      } else {
        if (now.getTime() < end.getTime()) {
          // ONGOING
          return `End in ${this.timeSince(dateEnd)}`
        } else {
          // PASSED
          return 'Ended'
        }
      }
    },
    action(type, instance) {
      console.log(this.$api.event[type]);
      this.$api.event[type](instance.id, {}).then(res => {
        console.log(res);
      })
    },
    parsePercent(num) {
      return `${Number.parseFloat((num * 100).toFixed(2))}%`
    }
  }
})
