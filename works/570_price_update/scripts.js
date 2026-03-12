$(function(){
	
	$('.shop2-product-amount button').on('click', function(){
		let $this = $(this),
			prodAmountValue = +$this.siblings('input').val(),
			prodPrice = +$this.parents('.shop2-product-item, .shop2-product').data('price'),
			prodPriceValue = $this.parents('.shop2-product-item, .shop2-product').find('.price-current strong'),
			totalPrice = prodAmountValue * prodPrice;
			
		prodPriceValue.text((totalPrice.toLocaleString()).replace(',','.'))
	})
	
	$('.shop2-product-amount input').on('change keyup', function(){
		let $this = $(this),
			prodAmountValue = +$this.val(),
			prodPrice = +$this.parents('.shop2-product-item, .shop2-product').data('price'),
			prodPriceValue = $this.parents('.shop2-product-item, .shop2-product').find('.price-current strong'),
			totalPrice = prodAmountValue * prodPrice;
			
		prodPriceValue.text((totalPrice.toLocaleString()).replace(',','.'))
	})
});