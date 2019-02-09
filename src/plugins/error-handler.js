import { Notify } from 'quasar'

function errorHandler(error) {
	var errorMessage;
	if (error.response) {
		switch (error.response.status) {
			case 400:
				errorMessage = 'Неверный запрос';
				break;
			case 401:
				errorMessage = 'Ошибка авторизации';
				break;
			case 403:
				errorMessage = 'Ошибка прав доступа';
				break;
			case 404:
				errorMessage = 'Ресурс не найден';
				break;
			case 502:
				errorMessage = 'Ошибка соединения с сервером';
				break;
			case 504:
				errorMessage = 'Внутренняя ошибка сервера';
				break;
			default:
				errorMessage = error.message;
		}
	} else {
		errorMessage = 'Ошибка соединения с сервером';
	}
	Notify.create({
	 	message: errorMessage,
        icon: 'error',
        position: 'bottom-right'
	})
}

export default ( {app, Vue } ) => {
    Vue.prototype.$handleError = errorHandler;
}