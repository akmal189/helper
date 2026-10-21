document.addEventListener('DOMContentLoaded', function(){
    const accordionItems = document.querySelectorAll('.tm_accordion_title');
    
    if (!accordionItems.length) return;
    
    function dropDown(event) {
        const thisItem = event.currentTarget;
        const parentElement = thisItem.parentNode;
        const bodyItem = parentElement.querySelector('.tm_accordion_body');
        
        parentElement.classList.toggle('active');
		$(bodyItem).slideToggle();;
		
        Array.from(parentElement.parentElement.children).forEach(sibling => {
        	const bodySibling = sibling.querySelector('.tm_accordion_body');
            if (sibling !== parentElement) {
                sibling.classList.remove('active');
                $(bodySibling).slideUp();
            }
        });
    }
    
    accordionItems.forEach(btn => btn.addEventListener('click', dropDown));
});