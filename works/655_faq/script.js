document.addEventListener('DOMContentLoaded', function() {
	const accorBtns = document.querySelectorAll('.tm_faq_title');
	
	if (!accorBtns.length) return;

	accorBtns.forEach(function(btn) {
		btn.addEventListener('click', function() {
			const thisParent = this.closest('.tm_faq_item');
			const siblings = Array.from(thisParent.parentElement.children).filter(child => child !== thisParent);
			const isActive = thisParent.classList.toggle('active');
			const link = thisParent.querySelector('.tm_faq_title_link');
			
			link.textContent = isActive ? 'Свернуть' : 'Читать ответ';
			
			siblings.forEach(sibling => {
				sibling.classList.remove('active');
				const siblingBtn = sibling.querySelector('.tm_faq_title_link');
				if (siblingBtn) {
					siblingBtn.textContent = 'Читать ответ';
				}
			});
		});
	});
});