// Global variables
const time_el = document.querySelector('.stopwatch .time')
const addtiming_el = document.querySelector('.add-timing')
const addtime_el = document.querySelector('.add-time')
const start_btn = document.getElementById('start')
const stop_btn = document.getElementById('stop')
const reset_btn = document.getElementById('reset')
const startAdd_btn = document.getElementById('start-add')
const stopAdd_btn = document.getElementById('stop-add')
const resetAdd_btn = document.getElementById('reset-add')

const firstHalf = document.getElementById('first')
const secondHalf = document.getElementById('second')
const halfSelect_btn = document.querySelectorAll("input[name='halfSelect']")
const halfStatus = document.getElementById('half-status')
const minsInput = document.getElementById('minute-input')
const addtimeInput = document.getElementById('addtime-input')
const startimeErr = document.getElementById('starttime-error')
const addtimeErr = document.getElementById('addtime-error')

let seconds = 0
let addtime = 0
let addedTime = 0
let interval = null
let intervalAdd = null
let halfValue = firstHalf.value

const bc = new BroadcastChannel('stopwatch')

for (let i = 0; i < halfSelect_btn.length; i++) {
  halfSelect_btn[i].addEventListener("change", function () {
    halfValue = this.value;

    if (halfValue == 'second') {
      stop()
      seconds = 2700
      time_el.innerText = '45:00'
      bc.postMessage({ mainTime: '45:00' })
      start_btn.innerText = "Start"
      halfStatus.innerText = "2nd Half"
      console.log('seconds: ', seconds)
    } else {
      stop()
      seconds = 0
      time_el.innerText = '00:00'
      bc.postMessage({ mainTime: '00:00' })
      start_btn.innerText = "Start"
      halfStatus.innerText = "1st Half"
      console.log('seconds: ', seconds)
    }
  });
}

minsInput.addEventListener('change', () => {
  if (minsInput.value !== "" && minsInput.value >= 0) {
    startimeErr.innerText = ""
    // format minute
    let minutes = Number(minsInput.value)
    seconds = minutes * 60

    if (minutes < 10) minutes = `0${minutes}`

    time_el.innerText = `${minutes}:00`
    bc.postMessage({ mainTime: `${minutes}:00` })
  } else {
    startimeErr.innerText = 'Wrong fromat!'
  }
})

addtimeInput.addEventListener('change', () => {
  if (addtimeInput.value !== "" && addtimeInput.value >= 0) {
    addtimeErr.innerText = ""
    // format minute
    let minutes = Number(addtimeInput.value)
    addedTime = minutes

    if (minutes < 10) minutes = `0${minutes}`
    addtime_el.innerText = `+${minutes}`
    bc.postMessage({ addedTime: `+${minutes}` })
  } else {
    addtimeErr.innerText = 'Wrong fromat!'
  }
})

start_btn.addEventListener('click', () => {
  start()
})
stop_btn.addEventListener('click', () => {
  stop()
})
reset_btn.addEventListener('click', () => {
  reset()
  start_btn.innerText = 'Start'
})

startAdd_btn.addEventListener('click', () => {
  if (addtimeInput.value == '') {
    addtimeErr.innerText = 'Enter add time!'
    return
  }
  addtimeErr.innerText = ''
  startAdd()
})
stopAdd_btn.addEventListener('click', () => {
  stopAdd()
})
resetAdd_btn.addEventListener('click', () => {
  resetAdd()
  startAdd_btn.innerText = 'Start'
})

// Update the timer
function timer() {
  seconds++

  // Format hrs:mins:secs 01:45:32
  // let hrs = Math.floor(seconds / 3600)
  // let mins = Math.floor((seconds - (hrs * 3600)) / 60)
  // let secs = seconds % 60

  // Format mins:secs 85:32
  let mins = Math.floor(seconds / 60)
  let secs = seconds % 60

  if (secs < 10) secs = '0' + secs
  if (mins < 10) mins = '0' + mins
  // if (hrs < 10) hrs = '0' + hrs

  // first half
  if (mins == '45' && secs == '00') {
    stop()
    halfStatus.innerText = 'Half Time'
  }

  if (mins == '90' && secs == '00') {
    stop()
    halfStatus.innerText = 'Full Time'
  }

  time_el.innerText = `${mins}:${secs}`
  bc.postMessage({ mainTime: `${mins}:${secs}` })
}

function timerAdd() {
  addtime++

  // Format time
  let mins = Math.floor(addtime / 60)
  let secs = addtime % 60

  if (secs < 10) secs = '0' + secs
  if (mins < 10) mins = '0' + mins

  // add time end
  if (Number(mins) == addedTime) {
    stopAdd()
  }

  addtiming_el.innerText = `${mins}:${secs}`
  bc.postMessage({ addTimer: `${mins}:${secs}` })
}

function start() {
  if (interval) {
    return
  }

  interval = setInterval(timer, 1000)
  start_btn.innerText = 'Start'
}

function stop() {
  clearInterval(interval)
  interval = null
  start_btn.innerText = 'Resume'
}

function reset() {
  stop()
  seconds = 0
  time_el.innerText = '00:00'
  minsInput.value = ''
  bc.postMessage({ mainTime: '00:00' })
}

// Additonal time
function startAdd() {
  if (intervalAdd) {
    return
  }

  intervalAdd = setInterval(timerAdd, 1000)
  startAdd_btn.innerText = 'Start'
}

function stopAdd() {
  clearInterval(intervalAdd)
  intervalAdd = null
  startAdd_btn.innerText = 'Resume'
}

function resetAdd() {
  stopAdd()
  addtime = 0
  addtiming_el.innerText = '00:00'
  addtimeInput.value = ''
  addedTime = 0
  addtime_el.innerText = '+00'
  bc.postMessage({ reset: true })
}