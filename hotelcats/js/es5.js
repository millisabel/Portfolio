"use strict";

function removeClass(item, removeClass) {
  if (!item) {
    console.log(item + ' no find');
    return;
  }

  if (item.classList.toggle(removeClass)) {
    item.classList.remove(removeClass);
  }
}

function addClass(item, addClass) {
  if (!item) {
    console.log(item + ' no find');
    return;
  }

  if (!!item.classList.toggle(addClass)) {
    item.classList.add(addClass);
  }
}

function createItems(newItem, length, parent) {
  if (length === 1) {
    var item = document.createElement(newItem);
    parent.append(item);
    return item;
  }

  for (var i = 0; i < length; i++) {
    var _item = document.createElement(newItem);

    parent.append(_item);
  }
}

function initBtnMenu() {
  var menu = document.querySelector('.header');
  var boxForBtn = document.querySelector('.header__logo');
  var btn = createBtnClose(menu, boxForBtn);
  addClass(menu, 'js-menu');
  resize(menu, btn);
  window.addEventListener('resize', function () {
    resize(menu, btn);
  });
}

function resize(box, btn) {
  if (document.body.offsetWidth > 749) {
    if (box.classList.contains('js-menu--close')) {
      removeClass(box, 'js-menu--close');
    }

    if (btn.style.display !== 'none') {
      btn.style.display = 'none';
    }
  } else {
    if (!box.classList.contains('js-menu--close')) {
      addClass(box, 'js-menu--close');
    }

    if (btn.style.display !== 'flex') {
      btn.style.display = 'flex';
    }
  }
}

function createBtnClose(box, parentBtn) {
  var btn = createItems('button', 1, parentBtn);
  createItems('span', 3, btn);
  btn.classList.add('btn--close');
  btn.addEventListener('click', function () {
    box.classList.toggle('js-menu--close');
  });
  return btn;
}

function initModal() {
  var btnOpenModal = document.querySelectorAll('[data-open-modal]');
  var btnCloseModal = document.querySelectorAll('[data-close-modal]');
  var openModal = null;

  var _loop = function _loop(i) {
    btnOpenModal[i].addEventListener('click', function () {
      if (openModal) {
        addClass(openModal, 'modal--close');
      }

      openModal = document.querySelector('#' + btnOpenModal[i].getAttribute('data-open-modal'));
      removeClass(openModal, 'modal--close');
      checkHeight(openModal);
    });
  };

  for (var i = 0; i < btnOpenModal.length; i++) {
    _loop(i);
  }

  for (var _i = 0; _i < btnCloseModal.length; _i++) {
    btnCloseModal[_i].addEventListener('click', function () {
      addClass(openModal, 'modal--close');
      openModal = null;
      checkHeight(openModal);
    });
  }

  if (document.querySelector('#modalFilter')) {
    var checkFilter = displayFilter();
    checkFilter();
    window.addEventListener('resize', function () {
      checkFilter();
    });
  }
}

function checkHeight(modal) {
  if (!modal) {
    document.body.classList.remove('page--no-scroll');
    return;
  }

  if (modal.firstElementChild.offsetHeight > modal.offsetHeight) {
    modal.style.alignItems = "flex-start";
    document.body.classList.add('page--no-scroll');
  } else {
    modal.style.alignItems = "center";
  }
}

function displayFilter() {
  var modal = document.querySelector('#modalFilter .modal__content');
  var parent = document.querySelector('.numbers__content');
  var filter = document.querySelector('.filter');
  var itemMoved = false;

  function moveFilter() {
    if (document.body.offsetWidth < 1200) {
      if (!itemMoved) {
        itemMoved = true;
        modal.append(filter);
      }
    } else {
      if (itemMoved) {
        itemMoved = false;
        parent.prepend(filter);
      }
    }
  }

  return moveFilter;
} // fixme: страница прокручивается вверх
// fixme: прыгает ширина страницы


var isFilter = 0;

function filter() {
  var inputPrice = document.querySelectorAll('input[name="price"]');
  var inputArea = document.querySelectorAll('input[name="area"]');
  var inputEquipment = document.querySelectorAll('input[name="equipment"]');
  var card = document.querySelectorAll('.card--room');
  var cards = [];

  for (var i = 0; i < card.length; i++) {
    cards.push(new Card(card[i]));
  } // addInputListener(inputPrice, cards);


  addListener(inputArea, cards);
  addListener(inputEquipment, cards);
}

function Card(item) {
  this.card = item;
  this.price = this.card.getAttribute('data-filter-price');
  this.area = this.card.getAttribute('data-filter-area');
  this.equipment = this.card.getAttribute('data-filter-equipment').split(',');
  this.show = true;
}

function addListener(inputs, cards) {
  var _loop2 = function _loop2(i) {
    inputs[i].addEventListener('click', function () {
      // по какому полю будем фильтровать
      var field = inputs[i].name; // сброс при выборе первого инпута

      resetShowCards(cards);

      if (field === 'area') {
        listenerForArea(inputs[i], cards);
      }

      if (field === 'equipment') {
        listenerForEquipment(inputs[i], cards);
      }

      if (isFilter <= 1) {
        showCards(cards);
      }

      console.log(isFilter);
    });
  };

  for (var i = 0; i < inputs.length; i++) {
    _loop2(i);
  }
}

function listenerForArea(input, cards) {
  if (input.checked) {
    isFilter++;

    for (var j = 0; j < cards.length; j++) {
      if (cards[j].area === input.getAttribute('data-value')) {
        cards[j].show = true;
      }

      if (isFilter > 1) {
        showCards(cards[j]);
      }
    }
  } else {
    isFilter--;

    if (!isFilter) {
      for (var _j = 0; _j < cards.length; _j++) {
        cards[_j].show = true;
      }
    } else {
      for (var _j2 = 0; _j2 < cards.length; _j2++) {
        if (cards[_j2].area === input.getAttribute('data-value')) {
          cards[_j2].show = false;
        }

        if (isFilter > 1) {
          showCards(cards[_j2]);
        }
      }
    }
  }
}

function listenerForEquipment(input, cards) {
  if (input.checked) {
    isFilter++;

    for (var j = 0; j < cards.length; j++) {
      console.log(cards[j].equipment);

      if (cards[j].equipment === input.getAttribute('data-value')) {}
    }
  }
}

function resetShowCards(cards) {
  if (!isFilter) {
    for (var j = 0; j < cards.length; j++) {
      cards[j].show = false;
    }
  }
}

function showCards(cards) {
  if (Array.isArray(cards)) {
    for (var i = 0; i < cards.length; i++) {
      showCard(cards[i]);
    }
  } else {
    showCard(cards);
  }

  function showCard(card) {
    if (card.show) {
      card.card.style.display = 'flex';
    } else {
      card.card.style.display = 'none';
    }
  }
}

window.addEventListener('load', function () {
  initBtnMenu();
  initModal();

  if (document.querySelector('#rooms .slider--rooms')) {
    $('#rooms .slider--rooms').slick({
      arrows: true,
      dots: true,
      speed: 800,
      slidesToShow: 1,
      variableWidth: true,
      appendDots: $('#rooms .slider__control'),
      appendArrows: $('#rooms .slider__control'),
      responsive: [{
        breakpoint: 768,
        settings: {
          infinite: false,
          arrows: false,
          slidesToShow: 1,
          variableWidth: true
        }
      }]
    });
  }

  if (document.querySelector('#reviews .slider--comment')) {
    $('#reviews .slider--comment').slick({
      infinite: false,
      initialSlide: 1,
      centerMode: true,
      arrows: false,
      dots: true,
      variableWidth: true,
      currentSlide: $('#rooms .slider__item--active'),
      appendArrows: $('#reviews .slider__control'),
      appendDots: $('#reviews .slider__control'),
      responsive: [{
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }, {
        breakpoint: 1400,
        settings: {
          arrows: true
        }
      }]
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNS5qcyJdLCJuYW1lcyI6WyJyZW1vdmVDbGFzcyIsIml0ZW0iLCJjb25zb2xlIiwibG9nIiwiY2xhc3NMaXN0IiwidG9nZ2xlIiwicmVtb3ZlIiwiYWRkQ2xhc3MiLCJhZGQiLCJjcmVhdGVJdGVtcyIsIm5ld0l0ZW0iLCJsZW5ndGgiLCJwYXJlbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJhcHBlbmQiLCJpIiwiaW5pdEJ0bk1lbnUiLCJtZW51IiwicXVlcnlTZWxlY3RvciIsImJveEZvckJ0biIsImJ0biIsImNyZWF0ZUJ0bkNsb3NlIiwicmVzaXplIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsImJveCIsImJvZHkiLCJvZmZzZXRXaWR0aCIsImNvbnRhaW5zIiwic3R5bGUiLCJkaXNwbGF5IiwicGFyZW50QnRuIiwiaW5pdE1vZGFsIiwiYnRuT3Blbk1vZGFsIiwicXVlcnlTZWxlY3RvckFsbCIsImJ0bkNsb3NlTW9kYWwiLCJvcGVuTW9kYWwiLCJnZXRBdHRyaWJ1dGUiLCJjaGVja0hlaWdodCIsImNoZWNrRmlsdGVyIiwiZGlzcGxheUZpbHRlciIsIm1vZGFsIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJvZmZzZXRIZWlnaHQiLCJhbGlnbkl0ZW1zIiwiZmlsdGVyIiwiaXRlbU1vdmVkIiwibW92ZUZpbHRlciIsInByZXBlbmQiLCJpc0ZpbHRlciIsImlucHV0UHJpY2UiLCJpbnB1dEFyZWEiLCJpbnB1dEVxdWlwbWVudCIsImNhcmQiLCJjYXJkcyIsInB1c2giLCJDYXJkIiwiYWRkTGlzdGVuZXIiLCJwcmljZSIsImFyZWEiLCJlcXVpcG1lbnQiLCJzcGxpdCIsInNob3ciLCJpbnB1dHMiLCJmaWVsZCIsIm5hbWUiLCJyZXNldFNob3dDYXJkcyIsImxpc3RlbmVyRm9yQXJlYSIsImxpc3RlbmVyRm9yRXF1aXBtZW50Iiwic2hvd0NhcmRzIiwiaW5wdXQiLCJjaGVja2VkIiwiaiIsIkFycmF5IiwiaXNBcnJheSIsInNob3dDYXJkIiwiJCIsInNsaWNrIiwiYXJyb3dzIiwiZG90cyIsInNwZWVkIiwic2xpZGVzVG9TaG93IiwidmFyaWFibGVXaWR0aCIsImFwcGVuZERvdHMiLCJhcHBlbmRBcnJvd3MiLCJyZXNwb25zaXZlIiwiYnJlYWtwb2ludCIsInNldHRpbmdzIiwiaW5maW5pdGUiLCJpbml0aWFsU2xpZGUiLCJjZW50ZXJNb2RlIiwiY3VycmVudFNsaWRlIl0sIm1hcHBpbmdzIjoiOztBQUdBLFNBQVNBLFdBQVQsQ0FBcUJDLElBQXJCLEVBQTJCRCxXQUEzQixFQUF3QztBQUNwQyxNQUFJLENBQUNDLElBQUwsRUFBVztBQUNQQyxJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUYsSUFBSSxHQUFHLFVBQW5CO0FBQ0E7QUFDSDs7QUFDRCxNQUFJQSxJQUFJLENBQUNHLFNBQUwsQ0FBZUMsTUFBZixDQUFzQkwsV0FBdEIsQ0FBSixFQUF3QztBQUNwQ0MsSUFBQUEsSUFBSSxDQUFDRyxTQUFMLENBQWVFLE1BQWYsQ0FBc0JOLFdBQXRCO0FBQ0g7QUFDSjs7QUFFRCxTQUFTTyxRQUFULENBQWtCTixJQUFsQixFQUF3Qk0sUUFBeEIsRUFBa0M7QUFDOUIsTUFBSSxDQUFDTixJQUFMLEVBQVc7QUFDUEMsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlGLElBQUksR0FBRyxVQUFuQjtBQUNBO0FBQ0g7O0FBQ0QsTUFBSSxDQUFDLENBQUNBLElBQUksQ0FBQ0csU0FBTCxDQUFlQyxNQUFmLENBQXNCRSxRQUF0QixDQUFOLEVBQXVDO0FBQ25DTixJQUFBQSxJQUFJLENBQUNHLFNBQUwsQ0FBZUksR0FBZixDQUFtQkQsUUFBbkI7QUFDSDtBQUNKOztBQUVELFNBQVNFLFdBQVQsQ0FBcUJDLE9BQXJCLEVBQThCQyxNQUE5QixFQUFzQ0MsTUFBdEMsRUFBOEM7QUFDMUMsTUFBSUQsTUFBTSxLQUFLLENBQWYsRUFBa0I7QUFDZCxRQUFJVixJQUFJLEdBQUdZLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QkosT0FBdkIsQ0FBWDtBQUNBRSxJQUFBQSxNQUFNLENBQUNHLE1BQVAsQ0FBY2QsSUFBZDtBQUNBLFdBQU9BLElBQVA7QUFDSDs7QUFDRCxPQUFLLElBQUllLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdMLE1BQXBCLEVBQTRCSyxDQUFDLEVBQTdCLEVBQWlDO0FBQzdCLFFBQUlmLEtBQUksR0FBR1ksUUFBUSxDQUFDQyxhQUFULENBQXVCSixPQUF2QixDQUFYOztBQUNBRSxJQUFBQSxNQUFNLENBQUNHLE1BQVAsQ0FBY2QsS0FBZDtBQUNIO0FBQ0o7O0FBQ0QsU0FBU2dCLFdBQVQsR0FBc0I7QUFDbEIsTUFBSUMsSUFBSSxHQUFHTCxRQUFRLENBQUNNLGFBQVQsQ0FBdUIsU0FBdkIsQ0FBWDtBQUNBLE1BQUlDLFNBQVMsR0FBR1AsUUFBUSxDQUFDTSxhQUFULENBQXVCLGVBQXZCLENBQWhCO0FBQ0EsTUFBSUUsR0FBRyxHQUFHQyxjQUFjLENBQUNKLElBQUQsRUFBT0UsU0FBUCxDQUF4QjtBQUNBYixFQUFBQSxRQUFRLENBQUNXLElBQUQsRUFBTyxTQUFQLENBQVI7QUFDQUssRUFBQUEsTUFBTSxDQUFDTCxJQUFELEVBQU9HLEdBQVAsQ0FBTjtBQUNBRyxFQUFBQSxNQUFNLENBQUNDLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLFlBQVU7QUFDeENGLElBQUFBLE1BQU0sQ0FBQ0wsSUFBRCxFQUFPRyxHQUFQLENBQU47QUFDSCxHQUZEO0FBR0g7O0FBRUQsU0FBU0UsTUFBVCxDQUFnQkcsR0FBaEIsRUFBcUJMLEdBQXJCLEVBQXlCO0FBQ3JCLE1BQUdSLFFBQVEsQ0FBQ2MsSUFBVCxDQUFjQyxXQUFkLEdBQTRCLEdBQS9CLEVBQW1DO0FBQy9CLFFBQUdGLEdBQUcsQ0FBQ3RCLFNBQUosQ0FBY3lCLFFBQWQsQ0FBdUIsZ0JBQXZCLENBQUgsRUFBNEM7QUFDeEM3QixNQUFBQSxXQUFXLENBQUMwQixHQUFELEVBQU0sZ0JBQU4sQ0FBWDtBQUNIOztBQUNELFFBQUdMLEdBQUcsQ0FBQ1MsS0FBSixDQUFVQyxPQUFWLEtBQXNCLE1BQXpCLEVBQWdDO0FBQzVCVixNQUFBQSxHQUFHLENBQUNTLEtBQUosQ0FBVUMsT0FBVixHQUFvQixNQUFwQjtBQUNIO0FBQ0osR0FQRCxNQVFJO0FBQ0EsUUFBRyxDQUFDTCxHQUFHLENBQUN0QixTQUFKLENBQWN5QixRQUFkLENBQXVCLGdCQUF2QixDQUFKLEVBQTZDO0FBQ3pDdEIsTUFBQUEsUUFBUSxDQUFDbUIsR0FBRCxFQUFNLGdCQUFOLENBQVI7QUFFSDs7QUFDRCxRQUFHTCxHQUFHLENBQUNTLEtBQUosQ0FBVUMsT0FBVixLQUFzQixNQUF6QixFQUFnQztBQUM1QlYsTUFBQUEsR0FBRyxDQUFDUyxLQUFKLENBQVVDLE9BQVYsR0FBb0IsTUFBcEI7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsU0FBU1QsY0FBVCxDQUF3QkksR0FBeEIsRUFBNkJNLFNBQTdCLEVBQXVDO0FBQ25DLE1BQUlYLEdBQUcsR0FBR1osV0FBVyxDQUFDLFFBQUQsRUFBVyxDQUFYLEVBQWN1QixTQUFkLENBQXJCO0FBQ0F2QixFQUFBQSxXQUFXLENBQUMsTUFBRCxFQUFRLENBQVIsRUFBV1ksR0FBWCxDQUFYO0FBQ0FBLEVBQUFBLEdBQUcsQ0FBQ2pCLFNBQUosQ0FBY0ksR0FBZCxDQUFrQixZQUFsQjtBQUNBYSxFQUFBQSxHQUFHLENBQUNJLGdCQUFKLENBQXFCLE9BQXJCLEVBQThCLFlBQVU7QUFDcENDLElBQUFBLEdBQUcsQ0FBQ3RCLFNBQUosQ0FBY0MsTUFBZCxDQUFxQixnQkFBckI7QUFDSCxHQUZEO0FBR0EsU0FBT2dCLEdBQVA7QUFDSDs7QUFLRCxTQUFTWSxTQUFULEdBQXFCO0FBQ2pCLE1BQUlDLFlBQVksR0FBR3JCLFFBQVEsQ0FBQ3NCLGdCQUFULENBQTBCLG1CQUExQixDQUFuQjtBQUNBLE1BQUlDLGFBQWEsR0FBR3ZCLFFBQVEsQ0FBQ3NCLGdCQUFULENBQTBCLG9CQUExQixDQUFwQjtBQUNBLE1BQUlFLFNBQVMsR0FBRyxJQUFoQjs7QUFIaUIsNkJBS1JyQixDQUxRO0FBTWJrQixJQUFBQSxZQUFZLENBQUNsQixDQUFELENBQVosQ0FBZ0JTLGdCQUFoQixDQUFpQyxPQUFqQyxFQUEwQyxZQUFZO0FBQ2xELFVBQUdZLFNBQUgsRUFBYTtBQUNUOUIsUUFBQUEsUUFBUSxDQUFDOEIsU0FBRCxFQUFZLGNBQVosQ0FBUjtBQUNIOztBQUNEQSxNQUFBQSxTQUFTLEdBQUd4QixRQUFRLENBQUNNLGFBQVQsQ0FBdUIsTUFBTWUsWUFBWSxDQUFDbEIsQ0FBRCxDQUFaLENBQWdCc0IsWUFBaEIsQ0FBNkIsaUJBQTdCLENBQTdCLENBQVo7QUFDQXRDLE1BQUFBLFdBQVcsQ0FBQ3FDLFNBQUQsRUFBWSxjQUFaLENBQVg7QUFDQUUsTUFBQUEsV0FBVyxDQUFDRixTQUFELENBQVg7QUFDSCxLQVBEO0FBTmE7O0FBS2pCLE9BQUssSUFBSXJCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdrQixZQUFZLENBQUN2QixNQUFqQyxFQUF5Q0ssQ0FBQyxFQUExQyxFQUE4QztBQUFBLFVBQXJDQSxDQUFxQztBQVM3Qzs7QUFFRCxPQUFLLElBQUlBLEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUdvQixhQUFhLENBQUN6QixNQUFsQyxFQUEwQ0ssRUFBQyxFQUEzQyxFQUErQztBQUMzQ29CLElBQUFBLGFBQWEsQ0FBQ3BCLEVBQUQsQ0FBYixDQUFpQlMsZ0JBQWpCLENBQWtDLE9BQWxDLEVBQTJDLFlBQVk7QUFDbkRsQixNQUFBQSxRQUFRLENBQUM4QixTQUFELEVBQVksY0FBWixDQUFSO0FBQ0FBLE1BQUFBLFNBQVMsR0FBRyxJQUFaO0FBQ0FFLE1BQUFBLFdBQVcsQ0FBQ0YsU0FBRCxDQUFYO0FBQ0gsS0FKRDtBQUtIOztBQUVELE1BQUd4QixRQUFRLENBQUNNLGFBQVQsQ0FBdUIsY0FBdkIsQ0FBSCxFQUEwQztBQUN0QyxRQUFJcUIsV0FBVyxHQUFHQyxhQUFhLEVBQS9CO0FBQ0FELElBQUFBLFdBQVc7QUFDWGhCLElBQUFBLE1BQU0sQ0FBQ0MsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsWUFBVTtBQUN4Q2UsTUFBQUEsV0FBVztBQUNkLEtBRkQ7QUFHSDtBQUdKOztBQUVELFNBQVNELFdBQVQsQ0FBcUJHLEtBQXJCLEVBQTRCO0FBQ3hCLE1BQUcsQ0FBQ0EsS0FBSixFQUFVO0FBQ043QixJQUFBQSxRQUFRLENBQUNjLElBQVQsQ0FBY3ZCLFNBQWQsQ0FBd0JFLE1BQXhCLENBQStCLGlCQUEvQjtBQUNBO0FBQ0g7O0FBQ0QsTUFBSW9DLEtBQUssQ0FBQ0MsaUJBQU4sQ0FBd0JDLFlBQXhCLEdBQXVDRixLQUFLLENBQUNFLFlBQWpELEVBQStEO0FBQzNERixJQUFBQSxLQUFLLENBQUNaLEtBQU4sQ0FBWWUsVUFBWixHQUF5QixZQUF6QjtBQUNBaEMsSUFBQUEsUUFBUSxDQUFDYyxJQUFULENBQWN2QixTQUFkLENBQXdCSSxHQUF4QixDQUE0QixpQkFBNUI7QUFDSCxHQUhELE1BSUk7QUFDQWtDLElBQUFBLEtBQUssQ0FBQ1osS0FBTixDQUFZZSxVQUFaLEdBQXlCLFFBQXpCO0FBQ0g7QUFDSjs7QUFFRCxTQUFTSixhQUFULEdBQXdCO0FBQ3BCLE1BQUlDLEtBQUssR0FBRzdCLFFBQVEsQ0FBQ00sYUFBVCxDQUF1Qiw4QkFBdkIsQ0FBWjtBQUNBLE1BQUlQLE1BQU0sR0FBRUMsUUFBUSxDQUFDTSxhQUFULENBQXVCLG1CQUF2QixDQUFaO0FBQ0EsTUFBSTJCLE1BQU0sR0FBSWpDLFFBQVEsQ0FBQ00sYUFBVCxDQUF1QixTQUF2QixDQUFkO0FBQ0EsTUFBSTRCLFNBQVMsR0FBRyxLQUFoQjs7QUFDQSxXQUFTQyxVQUFULEdBQXNCO0FBQ2xCLFFBQUduQyxRQUFRLENBQUNjLElBQVQsQ0FBY0MsV0FBZCxHQUE0QixJQUEvQixFQUFvQztBQUNoQyxVQUFHLENBQUNtQixTQUFKLEVBQWM7QUFDVkEsUUFBQUEsU0FBUyxHQUFHLElBQVo7QUFDQUwsUUFBQUEsS0FBSyxDQUFDM0IsTUFBTixDQUFhK0IsTUFBYjtBQUNIO0FBQ0osS0FMRCxNQU1LO0FBQ0QsVUFBR0MsU0FBSCxFQUFhO0FBQ1RBLFFBQUFBLFNBQVMsR0FBRyxLQUFaO0FBQ0FuQyxRQUFBQSxNQUFNLENBQUNxQyxPQUFQLENBQWVILE1BQWY7QUFDSDtBQUFDO0FBQ1Q7O0FBQ0QsU0FBT0UsVUFBUDtBQUNDLEMsQ0FHTDtBQUNBOzs7QUFDQSxJQUFJRSxRQUFRLEdBQUcsQ0FBZjs7QUFFQSxTQUFTSixNQUFULEdBQWtCO0FBQ2QsTUFBTUssVUFBVSxHQUFHdEMsUUFBUSxDQUFDc0IsZ0JBQVQsQ0FBMEIscUJBQTFCLENBQW5CO0FBQ0EsTUFBTWlCLFNBQVMsR0FBR3ZDLFFBQVEsQ0FBQ3NCLGdCQUFULENBQTBCLG9CQUExQixDQUFsQjtBQUNBLE1BQU1rQixjQUFjLEdBQUd4QyxRQUFRLENBQUNzQixnQkFBVCxDQUEwQix5QkFBMUIsQ0FBdkI7QUFFQSxNQUFNbUIsSUFBSSxHQUFHekMsUUFBUSxDQUFDc0IsZ0JBQVQsQ0FBMEIsYUFBMUIsQ0FBYjtBQUNBLE1BQU1vQixLQUFLLEdBQUcsRUFBZDs7QUFFQSxPQUFLLElBQUl2QyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHc0MsSUFBSSxDQUFDM0MsTUFBekIsRUFBaUNLLENBQUMsRUFBbEMsRUFBc0M7QUFDbEN1QyxJQUFBQSxLQUFLLENBQUNDLElBQU4sQ0FBVyxJQUFJQyxJQUFKLENBQVNILElBQUksQ0FBQ3RDLENBQUQsQ0FBYixDQUFYO0FBQ0gsR0FWYSxDQVlkOzs7QUFDQTBDLEVBQUFBLFdBQVcsQ0FBQ04sU0FBRCxFQUFZRyxLQUFaLENBQVg7QUFDQUcsRUFBQUEsV0FBVyxDQUFDTCxjQUFELEVBQWlCRSxLQUFqQixDQUFYO0FBQ0g7O0FBRUQsU0FBU0UsSUFBVCxDQUFjeEQsSUFBZCxFQUFvQjtBQUNoQixPQUFLcUQsSUFBTCxHQUFZckQsSUFBWjtBQUNBLE9BQUswRCxLQUFMLEdBQWEsS0FBS0wsSUFBTCxDQUFVaEIsWUFBVixDQUF1QixtQkFBdkIsQ0FBYjtBQUNBLE9BQUtzQixJQUFMLEdBQVksS0FBS04sSUFBTCxDQUFVaEIsWUFBVixDQUF1QixrQkFBdkIsQ0FBWjtBQUNBLE9BQUt1QixTQUFMLEdBQWlCLEtBQUtQLElBQUwsQ0FBVWhCLFlBQVYsQ0FBdUIsdUJBQXZCLEVBQWdEd0IsS0FBaEQsQ0FBc0QsR0FBdEQsQ0FBakI7QUFDQSxPQUFLQyxJQUFMLEdBQVksSUFBWjtBQUNIOztBQUVELFNBQVNMLFdBQVQsQ0FBcUJNLE1BQXJCLEVBQTZCVCxLQUE3QixFQUFvQztBQUFBLCtCQUN2QnZDLENBRHVCO0FBRTVCZ0QsSUFBQUEsTUFBTSxDQUFDaEQsQ0FBRCxDQUFOLENBQVVTLGdCQUFWLENBQTJCLE9BQTNCLEVBQW9DLFlBQVk7QUFDNUM7QUFDQSxVQUFJd0MsS0FBSyxHQUFHRCxNQUFNLENBQUNoRCxDQUFELENBQU4sQ0FBVWtELElBQXRCLENBRjRDLENBRzVDOztBQUNBQyxNQUFBQSxjQUFjLENBQUNaLEtBQUQsQ0FBZDs7QUFFQSxVQUFHVSxLQUFLLEtBQUssTUFBYixFQUFvQjtBQUNoQkcsUUFBQUEsZUFBZSxDQUFDSixNQUFNLENBQUNoRCxDQUFELENBQVAsRUFBWXVDLEtBQVosQ0FBZjtBQUNIOztBQUVELFVBQUdVLEtBQUssS0FBSyxXQUFiLEVBQXlCO0FBQ3JCSSxRQUFBQSxvQkFBb0IsQ0FBQ0wsTUFBTSxDQUFDaEQsQ0FBRCxDQUFQLEVBQVl1QyxLQUFaLENBQXBCO0FBQ0g7O0FBRUQsVUFBSUwsUUFBUSxJQUFJLENBQWhCLEVBQW1CO0FBQ2ZvQixRQUFBQSxTQUFTLENBQUNmLEtBQUQsQ0FBVDtBQUNIOztBQUNEckQsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVkrQyxRQUFaO0FBQ0gsS0FsQkQ7QUFGNEI7O0FBQ2hDLE9BQUssSUFBSWxDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdnRCxNQUFNLENBQUNyRCxNQUEzQixFQUFtQ0ssQ0FBQyxFQUFwQyxFQUF3QztBQUFBLFdBQS9CQSxDQUErQjtBQW9CdkM7QUFDSjs7QUFFRCxTQUFTb0QsZUFBVCxDQUF5QkcsS0FBekIsRUFBZ0NoQixLQUFoQyxFQUFzQztBQUNsQyxNQUFJZ0IsS0FBSyxDQUFDQyxPQUFWLEVBQW1CO0FBQ2Z0QixJQUFBQSxRQUFROztBQUNSLFNBQUssSUFBSXVCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdsQixLQUFLLENBQUM1QyxNQUExQixFQUFrQzhELENBQUMsRUFBbkMsRUFBdUM7QUFDbkMsVUFBSWxCLEtBQUssQ0FBQ2tCLENBQUQsQ0FBTCxDQUFTYixJQUFULEtBQWtCVyxLQUFLLENBQUNqQyxZQUFOLENBQW1CLFlBQW5CLENBQXRCLEVBQXdEO0FBQ3BEaUIsUUFBQUEsS0FBSyxDQUFDa0IsQ0FBRCxDQUFMLENBQVNWLElBQVQsR0FBZ0IsSUFBaEI7QUFDSDs7QUFFRCxVQUFJYixRQUFRLEdBQUcsQ0FBZixFQUFrQjtBQUNkb0IsUUFBQUEsU0FBUyxDQUFDZixLQUFLLENBQUNrQixDQUFELENBQU4sQ0FBVDtBQUNIO0FBQ0o7QUFDSixHQVhELE1BWUs7QUFDRHZCLElBQUFBLFFBQVE7O0FBQ1IsUUFBSSxDQUFDQSxRQUFMLEVBQWU7QUFDWCxXQUFLLElBQUl1QixFQUFDLEdBQUcsQ0FBYixFQUFnQkEsRUFBQyxHQUFHbEIsS0FBSyxDQUFDNUMsTUFBMUIsRUFBa0M4RCxFQUFDLEVBQW5DLEVBQXVDO0FBQ25DbEIsUUFBQUEsS0FBSyxDQUFDa0IsRUFBRCxDQUFMLENBQVNWLElBQVQsR0FBZ0IsSUFBaEI7QUFDSDtBQUNKLEtBSkQsTUFLSTtBQUNBLFdBQUssSUFBSVUsR0FBQyxHQUFHLENBQWIsRUFBZ0JBLEdBQUMsR0FBR2xCLEtBQUssQ0FBQzVDLE1BQTFCLEVBQWtDOEQsR0FBQyxFQUFuQyxFQUF1QztBQUNuQyxZQUFJbEIsS0FBSyxDQUFDa0IsR0FBRCxDQUFMLENBQVNiLElBQVQsS0FBa0JXLEtBQUssQ0FBQ2pDLFlBQU4sQ0FBbUIsWUFBbkIsQ0FBdEIsRUFBd0Q7QUFDcERpQixVQUFBQSxLQUFLLENBQUNrQixHQUFELENBQUwsQ0FBU1YsSUFBVCxHQUFnQixLQUFoQjtBQUNIOztBQUVELFlBQUliLFFBQVEsR0FBRyxDQUFmLEVBQWtCO0FBQ2RvQixVQUFBQSxTQUFTLENBQUNmLEtBQUssQ0FBQ2tCLEdBQUQsQ0FBTixDQUFUO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUFDSjs7QUFFRCxTQUFTSixvQkFBVCxDQUE4QkUsS0FBOUIsRUFBcUNoQixLQUFyQyxFQUE0QztBQUN4QyxNQUFJZ0IsS0FBSyxDQUFDQyxPQUFWLEVBQW1CO0FBQ2Z0QixJQUFBQSxRQUFROztBQUNSLFNBQUssSUFBSXVCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdsQixLQUFLLENBQUM1QyxNQUExQixFQUFrQzhELENBQUMsRUFBbkMsRUFBdUM7QUFDbkN2RSxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWW9ELEtBQUssQ0FBQ2tCLENBQUQsQ0FBTCxDQUFTWixTQUFyQjs7QUFDQSxVQUFJTixLQUFLLENBQUNrQixDQUFELENBQUwsQ0FBU1osU0FBVCxLQUF1QlUsS0FBSyxDQUFDakMsWUFBTixDQUFtQixZQUFuQixDQUEzQixFQUE2RCxDQUM1RDtBQUNKO0FBQ0o7QUFFSjs7QUFFRCxTQUFTNkIsY0FBVCxDQUF3QlosS0FBeEIsRUFBK0I7QUFDM0IsTUFBSSxDQUFDTCxRQUFMLEVBQWU7QUFDWCxTQUFLLElBQUl1QixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHbEIsS0FBSyxDQUFDNUMsTUFBMUIsRUFBa0M4RCxDQUFDLEVBQW5DLEVBQXVDO0FBQ25DbEIsTUFBQUEsS0FBSyxDQUFDa0IsQ0FBRCxDQUFMLENBQVNWLElBQVQsR0FBZ0IsS0FBaEI7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsU0FBU08sU0FBVCxDQUFtQmYsS0FBbkIsRUFBMEI7QUFDdEIsTUFBSW1CLEtBQUssQ0FBQ0MsT0FBTixDQUFjcEIsS0FBZCxDQUFKLEVBQTBCO0FBQ3RCLFNBQUssSUFBSXZDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd1QyxLQUFLLENBQUM1QyxNQUExQixFQUFrQ0ssQ0FBQyxFQUFuQyxFQUF1QztBQUNuQzRELE1BQUFBLFFBQVEsQ0FBQ3JCLEtBQUssQ0FBQ3ZDLENBQUQsQ0FBTixDQUFSO0FBQ0g7QUFDSixHQUpELE1BSU87QUFDSDRELElBQUFBLFFBQVEsQ0FBQ3JCLEtBQUQsQ0FBUjtBQUNIOztBQUVELFdBQVNxQixRQUFULENBQWtCdEIsSUFBbEIsRUFBd0I7QUFDcEIsUUFBSUEsSUFBSSxDQUFDUyxJQUFULEVBQWU7QUFDWFQsTUFBQUEsSUFBSSxDQUFDQSxJQUFMLENBQVV4QixLQUFWLENBQWdCQyxPQUFoQixHQUEwQixNQUExQjtBQUNILEtBRkQsTUFFTztBQUNIdUIsTUFBQUEsSUFBSSxDQUFDQSxJQUFMLENBQVV4QixLQUFWLENBQWdCQyxPQUFoQixHQUEwQixNQUExQjtBQUNIO0FBQ0o7QUFDSjs7QUFJRFAsTUFBTSxDQUFDQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxZQUFZO0FBQ3hDUixFQUFBQSxXQUFXO0FBQ1hnQixFQUFBQSxTQUFTOztBQUVULE1BQUdwQixRQUFRLENBQUNNLGFBQVQsQ0FBdUIsdUJBQXZCLENBQUgsRUFBbUQ7QUFDL0MwRCxJQUFBQSxDQUFDLENBQUMsdUJBQUQsQ0FBRCxDQUEyQkMsS0FBM0IsQ0FBaUM7QUFDN0JDLE1BQUFBLE1BQU0sRUFBRSxJQURxQjtBQUU3QkMsTUFBQUEsSUFBSSxFQUFFLElBRnVCO0FBRzdCQyxNQUFBQSxLQUFLLEVBQUUsR0FIc0I7QUFJN0JDLE1BQUFBLFlBQVksRUFBRSxDQUplO0FBSzdCQyxNQUFBQSxhQUFhLEVBQUUsSUFMYztBQU03QkMsTUFBQUEsVUFBVSxFQUFFUCxDQUFDLENBQUMseUJBQUQsQ0FOZ0I7QUFPN0JRLE1BQUFBLFlBQVksRUFBRVIsQ0FBQyxDQUFDLHlCQUFELENBUGM7QUFRN0JTLE1BQUFBLFVBQVUsRUFBRSxDQUNSO0FBQ0lDLFFBQUFBLFVBQVUsRUFBRSxHQURoQjtBQUVJQyxRQUFBQSxRQUFRLEVBQUU7QUFDTkMsVUFBQUEsUUFBUSxFQUFFLEtBREo7QUFFTlYsVUFBQUEsTUFBTSxFQUFFLEtBRkY7QUFHTkcsVUFBQUEsWUFBWSxFQUFFLENBSFI7QUFJTkMsVUFBQUEsYUFBYSxFQUFFO0FBSlQ7QUFGZCxPQURRO0FBUmlCLEtBQWpDO0FBb0JIOztBQUVELE1BQUd0RSxRQUFRLENBQUNNLGFBQVQsQ0FBdUIsMkJBQXZCLENBQUgsRUFBdUQ7QUFDbkQwRCxJQUFBQSxDQUFDLENBQUMsMkJBQUQsQ0FBRCxDQUErQkMsS0FBL0IsQ0FBcUM7QUFDakNXLE1BQUFBLFFBQVEsRUFBRSxLQUR1QjtBQUVqQ0MsTUFBQUEsWUFBWSxFQUFFLENBRm1CO0FBR2pDQyxNQUFBQSxVQUFVLEVBQUUsSUFIcUI7QUFJakNaLE1BQUFBLE1BQU0sRUFBRSxLQUp5QjtBQUtqQ0MsTUFBQUEsSUFBSSxFQUFFLElBTDJCO0FBTWpDRyxNQUFBQSxhQUFhLEVBQUUsSUFOa0I7QUFPakNTLE1BQUFBLFlBQVksRUFBRWYsQ0FBQyxDQUFDLDhCQUFELENBUGtCO0FBUWpDUSxNQUFBQSxZQUFZLEVBQUVSLENBQUMsQ0FBQywyQkFBRCxDQVJrQjtBQVNqQ08sTUFBQUEsVUFBVSxFQUFFUCxDQUFDLENBQUMsMkJBQUQsQ0FUb0I7QUFXakNTLE1BQUFBLFVBQVUsRUFBRSxDQUNSO0FBQ0lDLFFBQUFBLFVBQVUsRUFBRSxHQURoQjtBQUVJQyxRQUFBQSxRQUFRLEVBQUU7QUFDTlQsVUFBQUEsTUFBTSxFQUFFO0FBREY7QUFGZCxPQURRLEVBT1I7QUFDSVEsUUFBQUEsVUFBVSxFQUFFLElBRGhCO0FBRUlDLFFBQUFBLFFBQVEsRUFBRTtBQUNOVCxVQUFBQSxNQUFNLEVBQUU7QUFERjtBQUZkLE9BUFE7QUFYcUIsS0FBckM7QUEwQkg7QUFDSixDQXZERCIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUNsYXNzKGl0ZW0sIHJlbW92ZUNsYXNzKSB7XHJcbiAgICBpZiAoIWl0ZW0pIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhpdGVtICsgJyBubyBmaW5kJyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKGl0ZW0uY2xhc3NMaXN0LnRvZ2dsZShyZW1vdmVDbGFzcykpIHtcclxuICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUocmVtb3ZlQ2xhc3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRDbGFzcyhpdGVtLCBhZGRDbGFzcykge1xyXG4gICAgaWYgKCFpdGVtKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coaXRlbSArICcgbm8gZmluZCcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICghIWl0ZW0uY2xhc3NMaXN0LnRvZ2dsZShhZGRDbGFzcykpIHtcclxuICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoYWRkQ2xhc3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVJdGVtcyhuZXdJdGVtLCBsZW5ndGgsIHBhcmVudCkge1xyXG4gICAgaWYgKGxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIGxldCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuZXdJdGVtKTtcclxuICAgICAgICBwYXJlbnQuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuZXdJdGVtKTtcclxuICAgICAgICBwYXJlbnQuYXBwZW5kKGl0ZW0pO1xyXG4gICAgfVxyXG59XG5mdW5jdGlvbiBpbml0QnRuTWVudSgpe1xyXG4gICAgbGV0IG1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJyk7XHJcbiAgICBsZXQgYm94Rm9yQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbG9nbycpO1xyXG4gICAgbGV0IGJ0biA9IGNyZWF0ZUJ0bkNsb3NlKG1lbnUsIGJveEZvckJ0bik7XHJcbiAgICBhZGRDbGFzcyhtZW51LCAnanMtbWVudScpO1xyXG4gICAgcmVzaXplKG1lbnUsIGJ0bik7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKXtcclxuICAgICAgICByZXNpemUobWVudSwgYnRuKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXNpemUoYm94LCBidG4pe1xyXG4gICAgaWYoZG9jdW1lbnQuYm9keS5vZmZzZXRXaWR0aCA+IDc0OSl7XHJcbiAgICAgICAgaWYoYm94LmNsYXNzTGlzdC5jb250YWlucygnanMtbWVudS0tY2xvc2UnKSl7XHJcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKGJveCwgJ2pzLW1lbnUtLWNsb3NlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGJ0bi5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpe1xyXG4gICAgICAgICAgICBidG4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICAgIGlmKCFib3guY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1tZW51LS1jbG9zZScpKXtcclxuICAgICAgICAgICAgYWRkQ2xhc3MoYm94LCAnanMtbWVudS0tY2xvc2UnKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGJ0bi5zdHlsZS5kaXNwbGF5ICE9PSAnZmxleCcpe1xyXG4gICAgICAgICAgICBidG4uc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUJ0bkNsb3NlKGJveCwgcGFyZW50QnRuKXtcclxuICAgIGxldCBidG4gPSBjcmVhdGVJdGVtcygnYnV0dG9uJywgMSwgcGFyZW50QnRuKTtcclxuICAgIGNyZWF0ZUl0ZW1zKCdzcGFuJywzLCBidG4pO1xyXG4gICAgYnRuLmNsYXNzTGlzdC5hZGQoJ2J0bi0tY2xvc2UnKTtcclxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgYm94LmNsYXNzTGlzdC50b2dnbGUoJ2pzLW1lbnUtLWNsb3NlJyk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBidG47XHJcbn1cclxuXHJcblxyXG5cclxuXG5mdW5jdGlvbiBpbml0TW9kYWwoKSB7XHJcbiAgICBsZXQgYnRuT3Blbk1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtb3Blbi1tb2RhbF0nKTtcclxuICAgIGxldCBidG5DbG9zZU1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY2xvc2UtbW9kYWxdJyk7XHJcbiAgICBsZXQgb3Blbk1vZGFsID0gbnVsbDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ0bk9wZW5Nb2RhbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGJ0bk9wZW5Nb2RhbFtpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYob3Blbk1vZGFsKXtcclxuICAgICAgICAgICAgICAgIGFkZENsYXNzKG9wZW5Nb2RhbCwgJ21vZGFsLS1jbG9zZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wZW5Nb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgYnRuT3Blbk1vZGFsW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLW1vZGFsJykpO1xyXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhvcGVuTW9kYWwsICdtb2RhbC0tY2xvc2UnKTtcclxuICAgICAgICAgICAgY2hlY2tIZWlnaHQob3Blbk1vZGFsKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ0bkNsb3NlTW9kYWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBidG5DbG9zZU1vZGFsW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhZGRDbGFzcyhvcGVuTW9kYWwsICdtb2RhbC0tY2xvc2UnKTtcclxuICAgICAgICAgICAgb3Blbk1vZGFsID0gbnVsbDtcclxuICAgICAgICAgICAgY2hlY2tIZWlnaHQob3Blbk1vZGFsKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb2RhbEZpbHRlcicpKXtcclxuICAgICAgICBsZXQgY2hlY2tGaWx0ZXIgPSBkaXNwbGF5RmlsdGVyKCk7XHJcbiAgICAgICAgY2hlY2tGaWx0ZXIoKTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgY2hlY2tGaWx0ZXIoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja0hlaWdodChtb2RhbCkge1xyXG4gICAgaWYoIW1vZGFsKXtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtLW5vLXNjcm9sbCcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmIChtb2RhbC5maXJzdEVsZW1lbnRDaGlsZC5vZmZzZXRIZWlnaHQgPiBtb2RhbC5vZmZzZXRIZWlnaHQpIHtcclxuICAgICAgICBtb2RhbC5zdHlsZS5hbGlnbkl0ZW1zID0gXCJmbGV4LXN0YXJ0XCI7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdwYWdlLS1uby1zY3JvbGwnKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgICAgbW9kYWwuc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlGaWx0ZXIoKXtcclxuICAgIGxldCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb2RhbEZpbHRlciAubW9kYWxfX2NvbnRlbnQnKTtcclxuICAgIGxldCBwYXJlbnQgPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5udW1iZXJzX19jb250ZW50Jyk7XHJcbiAgICBsZXQgZmlsdGVyID0gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maWx0ZXInKTtcclxuICAgIGxldCBpdGVtTW92ZWQgPSBmYWxzZTtcclxuICAgIGZ1bmN0aW9uIG1vdmVGaWx0ZXIoKSB7XHJcbiAgICAgICAgaWYoZG9jdW1lbnQuYm9keS5vZmZzZXRXaWR0aCA8IDEyMDApe1xyXG4gICAgICAgICAgICBpZighaXRlbU1vdmVkKXtcclxuICAgICAgICAgICAgICAgIGl0ZW1Nb3ZlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5hcHBlbmQoZmlsdGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYoaXRlbU1vdmVkKXtcclxuICAgICAgICAgICAgICAgIGl0ZW1Nb3ZlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LnByZXBlbmQoZmlsdGVyKTtcclxuICAgICAgICAgICAgfX1cclxuICAgIH1cclxuICAgIHJldHVybiBtb3ZlRmlsdGVyO1xyXG4gICAgfVxyXG5cclxuXHJcbi8vIGZpeG1lOiDRgdGC0YDQsNC90LjRhtCwINC/0YDQvtC60YDRg9GH0LjQstCw0LXRgtGB0Y8g0LLQstC10YDRhVxyXG4vLyBmaXhtZTog0L/RgNGL0LPQsNC10YIg0YjQuNGA0LjQvdCwINGB0YLRgNCw0L3QuNGG0YtcbmxldCBpc0ZpbHRlciA9IDA7XHJcblxyXG5mdW5jdGlvbiBmaWx0ZXIoKSB7XHJcbiAgICBjb25zdCBpbnB1dFByaWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cInByaWNlXCJdJyk7XHJcbiAgICBjb25zdCBpbnB1dEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwiYXJlYVwiXScpO1xyXG4gICAgY29uc3QgaW5wdXRFcXVpcG1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwiZXF1aXBtZW50XCJdJyk7XHJcblxyXG4gICAgY29uc3QgY2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJkLS1yb29tJyk7XHJcbiAgICBjb25zdCBjYXJkcyA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FyZC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNhcmRzLnB1c2gobmV3IENhcmQoY2FyZFtpXSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGFkZElucHV0TGlzdGVuZXIoaW5wdXRQcmljZSwgY2FyZHMpO1xyXG4gICAgYWRkTGlzdGVuZXIoaW5wdXRBcmVhLCBjYXJkcyk7XHJcbiAgICBhZGRMaXN0ZW5lcihpbnB1dEVxdWlwbWVudCwgY2FyZHMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBDYXJkKGl0ZW0pIHtcclxuICAgIHRoaXMuY2FyZCA9IGl0ZW07XHJcbiAgICB0aGlzLnByaWNlID0gdGhpcy5jYXJkLmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItcHJpY2UnKTtcclxuICAgIHRoaXMuYXJlYSA9IHRoaXMuY2FyZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmlsdGVyLWFyZWEnKTtcclxuICAgIHRoaXMuZXF1aXBtZW50ID0gdGhpcy5jYXJkLmdldEF0dHJpYnV0ZSgnZGF0YS1maWx0ZXItZXF1aXBtZW50Jykuc3BsaXQoJywnKTtcclxuICAgIHRoaXMuc2hvdyA9IHRydWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZExpc3RlbmVyKGlucHV0cywgY2FyZHMpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaW5wdXRzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyDQv9C+INC60LDQutC+0LzRgyDQv9C+0LvRjiDQsdGD0LTQtdC8INGE0LjQu9GM0YLRgNC+0LLQsNGC0YxcclxuICAgICAgICAgICAgbGV0IGZpZWxkID0gaW5wdXRzW2ldLm5hbWU7XHJcbiAgICAgICAgICAgIC8vINGB0LHRgNC+0YEg0L/RgNC4INCy0YvQsdC+0YDQtSDQv9C10YDQstC+0LPQviDQuNC90L/Rg9GC0LBcclxuICAgICAgICAgICAgcmVzZXRTaG93Q2FyZHMoY2FyZHMpO1xyXG5cclxuICAgICAgICAgICAgaWYoZmllbGQgPT09ICdhcmVhJyl7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lckZvckFyZWEoaW5wdXRzW2ldLCBjYXJkcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKGZpZWxkID09PSAnZXF1aXBtZW50Jyl7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lckZvckVxdWlwbWVudChpbnB1dHNbaV0sIGNhcmRzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGlzRmlsdGVyIDw9IDEpIHtcclxuICAgICAgICAgICAgICAgIHNob3dDYXJkcyhjYXJkcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coaXNGaWx0ZXIpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpc3RlbmVyRm9yQXJlYShpbnB1dCwgY2FyZHMpe1xyXG4gICAgaWYgKGlucHV0LmNoZWNrZWQpIHtcclxuICAgICAgICBpc0ZpbHRlcisrO1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2FyZHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGNhcmRzW2pdLmFyZWEgPT09IGlucHV0LmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXJkc1tqXS5zaG93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGlzRmlsdGVyID4gMSkge1xyXG4gICAgICAgICAgICAgICAgc2hvd0NhcmRzKGNhcmRzW2pdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlzRmlsdGVyLS07XHJcbiAgICAgICAgaWYgKCFpc0ZpbHRlcikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNhcmRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjYXJkc1tqXS5zaG93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNhcmRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FyZHNbal0uYXJlYSA9PT0gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXJkc1tqXS5zaG93ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzRmlsdGVyID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDYXJkcyhjYXJkc1tqXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpc3RlbmVyRm9yRXF1aXBtZW50KGlucHV0LCBjYXJkcykge1xyXG4gICAgaWYgKGlucHV0LmNoZWNrZWQpIHtcclxuICAgICAgICBpc0ZpbHRlcisrO1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2FyZHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY2FyZHNbal0uZXF1aXBtZW50KTtcclxuICAgICAgICAgICAgaWYgKGNhcmRzW2pdLmVxdWlwbWVudCA9PT0gaW5wdXQuZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJykpIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2V0U2hvd0NhcmRzKGNhcmRzKSB7XHJcbiAgICBpZiAoIWlzRmlsdGVyKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjYXJkcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBjYXJkc1tqXS5zaG93ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93Q2FyZHMoY2FyZHMpIHtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KGNhcmRzKSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgc2hvd0NhcmQoY2FyZHNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2hvd0NhcmQoY2FyZHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNob3dDYXJkKGNhcmQpIHtcclxuICAgICAgICBpZiAoY2FyZC5zaG93KSB7XHJcbiAgICAgICAgICAgIGNhcmQuY2FyZC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhcmQuY2FyZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpbml0QnRuTWVudSgpO1xyXG4gICAgaW5pdE1vZGFsKCk7XHJcblxyXG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jvb21zIC5zbGlkZXItLXJvb21zJykpe1xyXG4gICAgICAgICQoJyNyb29tcyAuc2xpZGVyLS1yb29tcycpLnNsaWNrKHtcclxuICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBzcGVlZDogODAwLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWUsXHJcbiAgICAgICAgICAgIGFwcGVuZERvdHM6ICQoJyNyb29tcyAuc2xpZGVyX19jb250cm9sJyksXHJcbiAgICAgICAgICAgIGFwcGVuZEFycm93czogJCgnI3Jvb21zIC5zbGlkZXJfX2NvbnRyb2wnKSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2OCxcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jldmlld3MgLnNsaWRlci0tY29tbWVudCcpKXtcclxuICAgICAgICAkKCcjcmV2aWV3cyAuc2xpZGVyLS1jb21tZW50Jykuc2xpY2soe1xyXG4gICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGluaXRpYWxTbGlkZTogMSxcclxuICAgICAgICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcclxuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZSxcclxuICAgICAgICAgICAgY3VycmVudFNsaWRlOiAkKCcjcm9vbXMgLnNsaWRlcl9faXRlbS0tYWN0aXZlJyksXHJcbiAgICAgICAgICAgIGFwcGVuZEFycm93czogJCgnI3Jldmlld3MgLnNsaWRlcl9fY29udHJvbCcpLFxyXG4gICAgICAgICAgICBhcHBlbmREb3RzOiAkKCcjcmV2aWV3cyAuc2xpZGVyX19jb250cm9sJyksXHJcblxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY4LFxyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiAxNDAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0pOyJdLCJmaWxlIjoiZXM1LmpzIn0=
