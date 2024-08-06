const form = document.getElementById('loginForm')

form.addEventListener('submit', (e) => {
	e.preventDefault()
	const data = new FormData(form)
	const obj = {}
	data.forEach((value, key) => (obj[key] = value))

	fetch('/api/sessions/login', {
		method: 'POST',
		body: JSON.stringify(obj),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => {
			if (response.status === 200) {
				return response.json()
			} else {
				throw new Error('algo salio mal')
			}
		})
		.then((data) => {
			console.log(data.user.rol)
			if (data.user.rol === 'admin') {
				window.location.replace('/admin/users')
			} else {
				window.location.replace('/products')
			}
		})
		.catch((error) => {
			console.error(error)
			alert('Error en el login. Verifica tus credenciales.')
		})
})
