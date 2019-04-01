import Vue from 'vue'

export default {
  app_name: 'Лесное Дело',
  version: '1.0',
  connected: true,
  showNewMessage: false,
  recipient: null,
  users: [],
  messages: [],
  tasks: [],
  user: null,
  screen: {
  	width: 0,
  	height: 0,
  },
  stations: [],
  departaments: [
            {label: 'Лес', value: 'les'},
            {label: 'Цех', value: 'ceh'},
            {label: 'ПХС', value: 'phs'},
            {label: 'МТМ', value: 'mtm'},
          ],
  units: [],
  // Fuel distributions kinds
  fd_kinds: [
    { label: 'Путевой лист', value: 'WB'},
    { label: 'Наряд-Акт', value: 'OF'},
    { label: 'Учетный лист тракториста', value: 'TR'},
  ],

  rates: {
          1: 23.63,
          2: 25,
          3: 26.47,
          4: 28.10,
          5: 28.59,
          6: 31.44
        },
}
