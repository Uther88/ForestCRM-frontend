

export const addUsers = (state, users) => {
  state.users = users
}
export const addUnits = (state, units) => {
  state.units = units
}
export const addMessages = (state, messages) => {
  state.messages = messages
}
export const addTasks = (state, tasks) => {
  state.tasks = tasks
}
export const addWorkers = (state, workers) => {
	state.workers = workers
}

export const setAccount = (state, user) => {
  state.user = user
}
export const setScreen = (state, screen) => {
  state.screen.height = screen.height;
  state.screen.width = screen.width;
}

export const showNewMessage = (state, value) => {
	state.showNewMessage = value
}

export const setStatus = (state, status) => {
	state.connected = status
}

export const setRecipient = (state, user) => {
	state.recipient = user
}

