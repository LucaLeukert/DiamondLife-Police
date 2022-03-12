const menuToggle = document.querySelector('.toggle')
const showcase = document.querySelector('.showcase')
document.querySelector('.lspd-logo').setAttribute('draggable', false)

menuToggle.addEventListener('click', () => {
	menuToggle.classList.toggle('active')
	showcase.classList.toggle('active')
})

document.getElementById('dicord--button').addEventListener('click', (event) => {
	window.open('https://discord.gg/HzwPQwjjcd')
})
