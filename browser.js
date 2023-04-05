const mainTime_el = document.querySelector('.main-time')
const addTimer_el = document.querySelector('.add-timer')
const addedTime_el = document.querySelector('.added-time')

const bc = new BroadcastChannel('stopwatch')

bc.addEventListener('message', e => {
  console.log('receive: ', e.data)
  if (e.data.mainTime) {
    mainTime_el.textContent = e.data.mainTime
  } else if (e.data.addedTime) {
    addedTime_el.textContent = e.data.addedTime
    addTimer_el.textContent = '00:00'
  }

  if (e.data.reset) {
    addTimer_el.textContent = ''
    addedTime_el.textContent = ''
  }

  if (e.data.addTimer) {
    addTimer_el.textContent = e.data.addTimer
  }
})