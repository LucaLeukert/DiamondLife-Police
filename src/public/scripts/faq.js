$(document).ready(function () {
	$('#list--search').on('keyup', function () {
		var value = $(this).val().toLowerCase()

		if (value === 'yung hurn') {
			window.location = 'https://www.youtube.com/watch?v=sVjf-NlHpHQ'
		}

		$('#list li').filter(function () {
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		})
	})
})
