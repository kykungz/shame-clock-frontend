$(() => {
  let alarmList, scheduleList
  const api = 'http://192.168.1.48:3000'
  const date = new Date();
  const schedule = new Date(scheduleList)

  const init = () => {
    fetch(`${api}/schedule`)
      .then(res => res.json())
      .then(res => {
        scheduleList = res.schedule
        console.log(scheduleList);
      })
      .catch(err => console.log(err))

    fetch(`${api}/victims`)
      .then(res => res.json())
      .then(res => {
        alarmList = res.victims
        createList('#alarm-list')
        createList2('#alarm-list2')
        console.log(alarmList);
      })
      .catch(err => console.log(err))

    setUpHours('#hour')
    setUpMins('#min')
    selectShowList()
  }

  const setUpHours = (input) => {
    if (scheduleList == null) {
      $(input).val(date.getHours())
    } else {
      $(input).val(schedule.getHours())
    }
    $(input).on('input', () => {
      if ($(input).val() > 23) $(input).val(0)
      if ($(input).val() < 0) $(input).val(23)
    })
  }

  const setUpMins = (input) => {
    if (scheduleList == null) {
      $(input).val(date.getMinutes())
    } else {
      $(input).val(schedule.getMinutes())
    }
    $(input).on('input', () => {
      if ($(input).val() > 59) $(input).val(0)
      if ($(input).val() < 0) $(input).val(59)
    })
  }

  const createList = (list) => {
    for (let i = 0; i < alarmList.length; i++) {
      $(list).append(`
        <div class="list-group-item d-flex justify-content-between align-items-center name">
          ${alarmList[i]}
          <div class="ckbx-style-8 ckbx-large">
              <input id="toggle${i}" name="ckbx-square-1" type="checkbox">
              <label for="toggle${i}"></label>
          </div>
        </div>`)
    }
  }

  const createList2 = (list) => {
    for (let i = 0; i < alarmList.length; i++) {
      $(list).append(`
        <div class="list-group-item d-flex justify-content-between align-items-center">
          ${alarmList[i]}
        </div>`)
    }
  }

  const selectShowList = () => {
    if (scheduleList == null) {
      $('#alarm-list').show()
      $('#alarm-list2').hide()
      $('#set-alarm').show()
    } else {
      $('#alarm-list').hide()
      $('#alarm-list2').show()
      $('#set-alarm').hide()
    }
  }

  const getDate = () => {
    if (date.getHours() > $('#hour').val())
      return date.getDate() + 1
    else return date.getDate()
  }

  const getVictims = () => {
    let victims = []
    for (let i = 0; i < alarmList.length; i++) {
      if ($(`#toggle${i}`).prop('checked'))
        victims.push(alarmList[i])
    }
    return victims
  }

  $('#set-alarm').on('click', () => {
    fetch(`${api}/set`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date: new Date(date.getFullYear(), date.getMonth(), getDate(),
          $('#hour').val(), $('#min').val(), 0, 0).toString(),
        victims: getVictims()
      })
    })
  })

  init()
})
