;
(function($) {
  'use strict';
  
  const SELECTORS = {
    PRODUCT_LIST_WRAPPER: '.product-list',                          //корневой элемент списка товаров необходим для отслеживания изменений в случае наличия ленивой подгрузки
    PRODUCT_LIST_ITEM:    '.shop2-product-discount-form',           // класс по которому будет происходить поиск всего div'а с товаром
    DISCOUNT_WRAPPER:     '.shop2-discount-wrapper',                // корневой элемент в котором начинается таблица со скидками в нем хранится id текущего товара
    DISCOUNT_ITEM:        '.shop2-discount-item',                   // элемент скидки в таблице со списком скидок в этом элементе хранятся все data параметры о скидке
    DISCOUNT_ITEM_PRICE:  '.shop2-discount-item-price-value-data',  // span в списке скидок - записывается динамически вычисляемая цена
    AMOUNT_INPUT:         '.shop2-product-amount input',            // input с количеством товара
    PRICE_BLOCK:          '.price-current strong',                  // div в котором необходимо менять стоимость товара
    BTN_BUY_PRODUCT:      '.shop2-product-btn',					    // Кнопка покупки
  };

  const ACTIVE_CLASS = 'shop2-discount-item-active'                 // класс по которому визуально отделяем активную скидку в таблице

  /**
   * @type {{LAZY_LOAD_ON: boolean, ANIMATION_ON: boolean, WORKING_WITH_CART: boolean}}
   */
  const OPTIONS = {
    ANIMATION_ON: false, 	// включить / отключить анимацию стоимости
    LAZY_LOAD_ON: true,	// включить / отключить отслеживание изменения количество товаров в списке - для ленивой подгрузки
    RESET_INPUT_VALUE_ON: false,  // Сбрасывать значение количества в инпуте на минимальное значение после добавления товара в корзину
    QUICK_VIEW_POPUP_ON: true,  // включить функционал быстрого просмотра товара в списке
    RESULT_MULTIPLY_ON: false,   // в блок с ценой выводить результат произведения стоимости за товар на количество
    WORKING_WITH_CART: window?.xapi ? false : false,    // включен ли xapi для работы с товарами из корзины
  }
  
  let productElementList = []
  const productsInCart = new Map()
  const timerDirectory = new Map()
  const timerDelay = 1000
  let timerCartUpdated = null

  /**
   * основная инициализация событий на товарах
   */
  function initProductsEvents() {
    productElementList = document.querySelectorAll(SELECTORS.PRODUCT_LIST_ITEM)
    if (!elementExists(productElementList, SELECTORS.PRODUCT_LIST_ITEM)) return null
    if (OPTIONS.WORKING_WITH_CART) {
      initGettingAggregatedDiscounts()
    } else {
      initEventProductListItem()
    }
  }

  function initEventProductListItem() {
    productElementList.forEach(productElement => {
      const dicsountWrapper = productElement.querySelector(SELECTORS.DISCOUNT_WRAPPER)   
      if (!elementExists(dicsountWrapper, SELECTORS.DISCOUNT_WRAPPER)) return null

      const kindId = replaceSpaceAndGetNumber(dicsountWrapper.dataset.kindId)

      const discountItems = productElement.querySelectorAll(SELECTORS.DISCOUNT_ITEM)
      if (!elementExists(discountItems, SELECTORS.DISCOUNT_ITEM)) return null

      const priceBlock = $(productElement).find(SELECTORS.PRICE_BLOCK);
      if (!elementExists(priceBlock, SELECTORS.PRICE_BLOCK)) return null
      updateDiscountedPrices(discountItems)

      const currentAmountInput = productElement.querySelector(SELECTORS.AMOUNT_INPUT)
      if (!elementExists(currentAmountInput, SELECTORS.AMOUNT_INPUT)) return null
		  let value = isNaN(replaceSpaceAndGetNumber(currentAmountInput.value)) ? 0 : replaceSpaceAndGetNumber(currentAmountInput.value)

      updateDiscountItem(discountItems, value, priceBlock, kindId)

      $(productElement).on('change', SELECTORS.AMOUNT_INPUT, function(e) {
      const currentAmountValue = isNaN(replaceSpaceAndGetNumber(e.target.value)) ? 0 : replaceSpaceAndGetNumber(e.target.value)

        deleteTimerInDorectory(kindId)
        let timer = setTimeout(() => {
            updateDiscountItem(discountItems, currentAmountValue, priceBlock, kindId)
            deleteTimerInDorectory(kindId)
          }, timerDelay)
          timerDirectory.set(kindId, timer)
      });
    })
  }

  function deleteTimerInDorectory(id){
    if (timerDirectory.has(id)) {
      clearTimeout(timerDirectory.get(id))
      timerDirectory.delete(id)
    }
  }

  /**
   * Обновляем список скидок и прописываем корректное значение цены с учетом скидки в html
   * @param {Node[]} items
   * @returns {null}
   */
  function updateDiscountedPrices(items) {
    items = Array.from(items)

    items.splice(0, 1)
    const length = items.length
    if (!length) return null

    items.forEach(item => {
      const data = getDatasetItem(item)
      const resultPrice = calculateNewPrice(data)
      updatePriceElement(item, resultPrice)
    })
  }

  /**
   *
   * @param item
   * @param newPrice
   * @returns {null}
   */
  function updatePriceElement(item, newPrice) {
    if (newPrice === null) return null

    const elementPriceData = item.querySelector(SELECTORS.DISCOUNT_ITEM_PRICE)
    newPrice = newPrice > 0 ? newPrice : 0
    elementPriceData.innerHTML = ''
    elementPriceData.insertAdjacentHTML('afterbegin', setSpaceInPrice(newPrice))
    item.dataset.price = newPrice
  }

  /**
   *  Обновляем полученный список скидок
   * @param {Node[]} items
   * @param {number} currentAmountValue
   * @param {Object} priceBlock
   */
  function updateDiscountItem(items, currentAmountValue, priceBlock, kindId) {
    const activeIndex = getActiveIndexItem(currentAmountValue, items, kindId)

    updateActiveItem(activeIndex, items)
    updateMainPrice(activeIndex, currentAmountValue, items, priceBlock)
  }

  /**
   * Обновляем класс для активной скидки
   * @param {number} activeIndex
   * @param {Node[]} items
   */
  function updateActiveItem(activeIndex, items) {
    Array.from(items).forEach((item, index) => {
      const isActive = item.classList.contains(ACTIVE_CLASS)

      if (index !== activeIndex && isActive) {
        item.classList.remove(ACTIVE_CLASS)
      } else if (index === activeIndex && !isActive) {
        item.classList.add(ACTIVE_CLASS)
      }
    })
  }

  /**
   * Обновляем основную цену
   * @param {number} activeIndex
   * @param {number} currentAmountValue
   * @param {Node[]} items
   * @param {Object} priceBlock
   * @returns {boolean}
   */
  function updateMainPrice(activeIndex, currentAmountValue, items, priceBlock) {
    const activeItem = Array.from(items)[activeIndex]
    if (!activeItem) return null

    const data = getDatasetItem(activeItem)
    const newSum = OPTIONS.RESULT_MULTIPLY_ON ? data.price * currentAmountValue : data.price
    animatePrice(priceBlock, newSum)
  }

  /**
   *
   * @param {Object} data
   * @returns {null|number}
   */
  function calculateNewPrice(data) {
    let resultPrice = null

    if (data.isPercentType && data.discountValue) {
      resultPrice = replaceSpaceAndGetNumber((data.originPrice * (1 - data.discountValue / 100)).toFixed(2))
    }

    if (data.isCurrencyType && data.discountValue) {
      resultPrice = replaceSpaceAndGetNumber((data.originPrice - data.discountValue).toFixed(2))
    }

    if (data.isPriceType) {
      resultPrice = replaceSpaceAndGetNumber(data.price)
    }
    return resultPrice
  }

  /**
   * получаем индекс скидки которую нужно сделать активной
   * учитываем логику И или ИЛИ
   * учитываем меньшую скидку из тех которые удовлетворяют условию
   * @param {number} currentAmountValue
   * @param {Node[]} items
   * @returns {number}
   */
  function getActiveIndexItem(currentAmountValue, items, kindId) {
    const result = Array.from(items).reduce((res, item, index) => {

      const {
        discountAmountTo,
        discountSumTo,
      	isAggregated,
        originPrice,
        isLogicAnd,
        isLogicOr,
        price,
        discountId
      } = getDatasetItem(item)
      
      const {sumPriceInCart, sumAmmountInCart} = getDateProductInCart(discountId, kindId, isAggregated)

      const sumBeforeCheckCart = (currentAmountValue * originPrice) + sumPriceInCart
      const amountBeforChecCart = currentAmountValue + sumAmmountInCart

      let lastPrice = res.lastPrice 
      
      if (lastPrice === null) {
        lastPrice = price
      }

      if (isLogicAnd && lastPrice >= price) {
        if (amountBeforChecCart >= discountAmountTo && sumBeforeCheckCart >= discountSumTo) {
          return {
            index,
            lastPrice: price
          }
        }
      }

      if (isLogicOr && lastPrice >= price) {
        if (!discountSumTo && amountBeforChecCart >= discountAmountTo) {
          return {
            index,
            lastPrice: price
          }
        } else if (!discountAmountTo && sumBeforeCheckCart >= discountSumTo) {
          return {
            index,
            lastPrice: price
          }
        } else if ((discountSumTo && discountAmountTo) && (amountBeforChecCart >= discountAmountTo || sumBeforeCheckCart >= discountSumTo)) {
          return {
            index,
            lastPrice: price
          }
        }
      }
      return res
    }, {
      index: 0,
      lastPrice: null,
    })    
    return result?.index
  }

  /**
   * Получаем сумму стоимости и количества товаров в корзине при условии, что их скидки имеют настройки "группавая скидка" и эта 
   * скидка есть у текущего товара или этот товар и совпадает с текущим
   * @param {number} dicountId 
   * @param {boolean} isAggregated 
   * @param {number} kindId 
   * @returns 
   */
  function getDateProductInCart(dicountId, kindId, isAggregated){
    let sumPriceInCart = 0
    let sumAmmountInCart = 0
    if (productsInCart.size && OPTIONS.WORKING_WITH_CART) {
      productsInCart.forEach(item => {
        if ((item.discounts_applicable.includes(dicountId) && isAggregated) || item.kind_id === kindId) {
            sumPriceInCart = sumPriceInCart + (item.price * item.amount)
            sumAmmountInCart = sumAmmountInCart + item.amount
        }
      })
    }
    return {sumPriceInCart, sumAmmountInCart}
  }

  /**
   * @param {Object} priceBlock
   * @param {number} sum
   */
  function animatePrice(priceBlock, sum) {
    if (OPTIONS.ANIMATION_ON) {
      priceBlock.animateNumber({
        number: sum.toFixed(2),
        numberStep: function(now, tween) {
	      const target = $(tween.elem);
	      target.text(setSpaceInPrice(now.toFixed(2)));
	    }
      },
      )
    } else {
      priceBlock.text(setSpaceInPrice(sum.toFixed(2)))
    }
  }
  

  /**
   * Инициализация работы кнопки для ленивой подгрузки товара в списке товаров
   */
  function initLazyLoad() {
    if (!OPTIONS.LAZY_LOAD_ON) return null

    const productListWrapper = document.querySelector(SELECTORS.PRODUCT_LIST_WRAPPER);
    if (!elementExists(productListWrapper, SELECTORS.PRODUCT_LIST_WRAPPER, true)) return null

    const observer = new MutationObserver(handleMutation);
    const observerConfig = {
      childList: true
    };
    observer.observe(productListWrapper, observerConfig);
  }

  /**
   * Обработчик мутаций для ленивой подгрузки
   * @param mutationsList
   * @param observer
   */
  function handleMutation(mutationsList, observer) {
    mutationsList.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
        productElementList = document.querySelectorAll(SELECTORS.PRODUCT_LIST_ITEM)
        initProductsEvents()
      }
    });
  }

  /**
   * проверка на существование переданного элемента
   * @param {*} element 
   * @param {String} selector 
   * @param {Boolean} suppressError 
   * @returns 
   */
  function elementExists(element, selector, suppressError = false) {
    if (element) return true

    if (suppressError !== true) {
      console.error(`Элемента ${selector} не существует!`);
    }
    return false;
  }

  /**
   * Парсим переданный node элемент скидки и получаем данные из dataset
   * @param item
   * @returns {{
   * discountAmountTo: number,
   * isCurrencyType: boolean,
   * isPercentType: boolean,
   * isAggregated: boolean,
   * discountValue: number,
   * discountSumTo: number,
   * isPriceType: boolean,
   * isLogicAnd: boolean,
   * originPrice: number
   * price: number|null,
   * isLogicOr: boolean,
   * discountId: number
   * }}
   */
  function getDatasetItem(item) {
    const isPercentType = item.dataset.discountType === 'percent' 	// тип скидки - проценты
    const isCurrencyType = item.dataset.discountType === 'sum'		// тип скидки - валюта
    const isPriceType = item.dataset.discountType === 'price2' || item.dataset.discountType === 'price3'  // тип скидки - цена 2\3

    const isPrice2 = item.dataset.discountType === 'price2'
    const isPrice3 = item.dataset.discountType === 'price3'

    const discountValue = replaceSpaceAndGetNumber(item.dataset.discountValue)  	// значение на которое применяется скидка
    const discountSumTo = replaceSpaceAndGetNumber(item.dataset.discountSumTo)	// значение суммы товара с какого применяется скидка
    const discountAmountTo = replaceSpaceAndGetNumber(item.dataset.discountAmountTo)	// значение количества товара с которого применяется скидка

    const isLogicAnd = item.dataset.discountLogicAnd === '1' 		// включена логика "И"
    const isLogicOr = item.dataset.discountLogicOr === '1'			// включена логика "ИЛИ"

    const isAggregated = item.dataset.discountAggregated === '1'            // включена логика - групповая скидка
    const discountId = replaceSpaceAndGetNumber(item.dataset.discountId)
    let price = null

    if (!isPriceType) {
      price = replaceSpaceAndGetNumber(item.dataset.price)
    } else if (isPrice2) {
      price = replaceSpaceAndGetNumber(item.dataset.discountPrice2)
    } else if (isPrice3) {
      price = replaceSpaceAndGetNumber(item.dataset.discountPrice3)
    }

    const originPrice = replaceSpaceAndGetNumber(item.dataset.discountOriginPrice)
    return {
      discountAmountTo,
      isCurrencyType,
      discountValue,
      discountSumTo,
      isPercentType,
      isAggregated,
      originPrice,
      isPriceType,
      isLogicAnd,
      isLogicOr,
      price,
      discountId
    }
  }
  
  /**
   * убираем все пробелы из строки и возвращаем число
   * @param {*} value 
   * @returns 
   */
  function replaceSpaceAndGetNumber(value) {
  	let v = value?.toString()
  	if (value?.length) {
  		return parseFloat(v.replace(/\s+/g, ''))
  	}
  	return value
  }

  /**
   * Возвращаем число приведенное к российскому формату с пробелами, но с точкой вместо запятой
   * @param {*} price 
   * @returns 
   */
  function setSpaceInPrice(price) {
    const p = replaceSpaceAndGetNumber(price)
    if (p) {
      return p?.toLocaleString("ru").replace(",", ".")
    }
    return p;
  }


  /**
   * Получаем данные из корзины
   */
  function getCartData(){
  	xapi.method('cart/update').get()
    .then(() => xapi.method('cart/getCartData').get())
    .then(res => res.result.data)
    .then(data => {
      updateProductListInCart(data)
    })        
    .then(() => {
      initEventProductListItem()
    }) 
    .catch((e) => {
      console.error(e);
    });
  }

  /**
   * Преобразуем полученные данные из корзины и добавляем в локальную переменную для обработки
   * @param {Object} data 
   */
  function updateProductListInCart(data){
  	productsInCart.clear()
    const productstInCart = data?.cart?.items
    const producrts = data.products
    const isExist = Boolean(productstInCart?.length) && productstInCart !== 'undefined'

    if (!isExist) return null
	
    productstInCart.forEach(productCart => {
      productCart.discounts_applicable = producrts[productCart.kind_id]?.discounts_applicable
      addProductOnCart(productCart)
    })
  }
    
  /**
   * Добавляем товары из корзины в внутренний список при условии что у него есть 
   * скидка с включенной настройкой "группавая скидка" и она есть у текущего товара
   * @param {*} product
   */
  function addProductOnCart(product) {
    const isDiscount = Boolean(product?.discounts_applicable?.length)

    if (!isDiscount) return null
    productsInCart.set(product.kind_id, product)
 
  }

    /**
     * Инициализируем функицонал связанный с товарами в корзине и групповой скидкой
     */
	function initGettingAggregatedDiscounts(){
	  getCartData()	    
	}
	
  function initClickBuyProductBtn() {
    if (!OPTIONS.RESET_INPUT_VALUE_ON) return null
    document.addEventListener('click', (e) => {
      const target = e.target
      const buyBtn = target.closest(SELECTORS.BTN_BUY_PRODUCT) !== null 
      let product = null
      let amountInput = null
			
      if (buyBtn) {
        product = target.closest(SELECTORS.PRODUCT_LIST_ITEM)
      }

      if (product) {
        amountInput = product.querySelector(SELECTORS.AMOUNT_INPUT)
      }

      if (amountInput) {
        let minValue = amountInput.dataset.min
        amountInput.value = replaceSpaceAndGetNumber(minValue !== undefined ? minValue : 1)
      }
    })
  }

  /**
   * Инициализация
   */
  function init() {
    initLazyLoad()
    initProductsEvents()
    initClickBuyProductBtn()
  }
  
  if (OPTIONS.WORKING_WITH_CART) {
    shop2.on('afterCartAddItem, afterCartUpdated', function(res, status) {
      clearTimeout(timerCartUpdated)
      timerCartUpdated = setTimeout(() => {
        initProductsEvents()
        clearTimeout(timerCartUpdated)
      }, timerDelay)
    });  
  }
  
  if (OPTIONS.QUICK_VIEW_POPUP_ON) {
    /*shop2.on('checkQuickViews', function() {
      productElementList = document.querySelectorAll(SELECTORS.PRODUCT_LIST_ITEM)
      initEventProductListItem()
    })*/
	$(document).on( "ajaxComplete", function() {
      productElementList = document.querySelectorAll(SELECTORS.PRODUCT_LIST_ITEM)
      initEventProductListItem()
	})
  }
  window.recalculateDiscounts = function(formElement) {
  const productElement = formElement.closest(SELECTORS.PRODUCT_LIST_ITEM);
  if (!productElement) return;

  const dicsountWrapper = productElement.querySelector(SELECTORS.DISCOUNT_WRAPPER);
  if (!dicsountWrapper) return;

  const discountItems = productElement.querySelectorAll(SELECTORS.DISCOUNT_ITEM);
  if (!discountItems?.length) return;

  const priceBlock = $(productElement).find(SELECTORS.PRICE_BLOCK);
  if (!priceBlock?.length) return;

  const currentAmountInput = productElement.querySelector(SELECTORS.AMOUNT_INPUT);
  if (!currentAmountInput) return;

  let newOriginPrice = replaceSpaceAndGetNumber(
    priceBlock.text().replace(/[^\d.,]/g, '').replace(',', '.')
  );

  // Обновляем originPrice во всех скидках
  discountItems.forEach(item => {
    item.dataset.discountOriginPrice = newOriginPrice;
  });

  // Обновляем пересчет цен
  updateDiscountedPrices(discountItems);

  let currentAmountValue = replaceSpaceAndGetNumber(currentAmountInput.value || 1);
  const kindId = replaceSpaceAndGetNumber(dicsountWrapper.dataset.kindId);

  updateDiscountItem(discountItems, currentAmountValue, priceBlock, kindId);
};
  $(document).ready(init)	
})(jQuery);