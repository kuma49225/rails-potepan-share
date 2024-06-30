import Rails from "@rails/ujs";
import Turbolinks from "turbolinks";
import * as ActiveStorage from "@rails/activestorage";
import "channels";
import "bootstrap";
import "../stylesheets/application";

Rails.start();
Turbolinks.start();
ActiveStorage.start();

document.addEventListener("turbolinks:load", function () {
    console.log("JavaScript loaded");

    if (typeof jQuery !== 'undefined') {
        console.log("jQuery version:", jQuery.fn.jquery);
    } else {
        console.log("jQuery is not loaded");
    }

    const deleteModal = $('#deleteModal');
    const deleteModalBody = $('#deleteModalBody');
    const confirmDeleteButton = $('#confirmDeleteButton');

    if (deleteModal.length && deleteModalBody.length && confirmDeleteButton.length) {
        console.log("Modal elements found");
    } else {
        console.log("Modal elements not found");
    }

    // BootstrapのJavaScript部分が読み込まれているか確認
    console.log("Bootstrap loaded:", typeof $.fn.modal === 'function');

    deleteModal.on('show.bs.modal', function(event) {
        const button = $(event.relatedTarget);
        const hotelName = button.data('hotel-name');
        const checkIn = button.data('check-in');
        const checkOut = button.data('check-out');
        const numberOfPeople = button.data('number-of-people');
        const deleteUrl = button.data('delete-url');
        const isReservation = button.data('is-reservation');
        const imageSrc = button.data('image-src');

        deleteModalBody.html(isReservation ? `
            <div class="ConfirmBody">
                <img class="ConfirmBody__image" src="${imageSrc}" alt="${hotelName}">
                <div>
                    ${hotelName}<br>
                    ${numberOfPeople}人
                </div>
            </div>
            よろしければ「削除」ボタンを押してください。
        ` : `<div class="ConfirmBody">
                <img class="ConfirmBody__image" src="${imageSrc}" alt="${hotelName}">
                <div>
                    ${hotelName}
                </div>
            </div>
            よろしければ「削除」ボタンを押してください。`);

        confirmDeleteButton.off('click').on('click', function() {
            Rails.ajax({
                url: deleteUrl,
                type: "DELETE",
                success: function(data) {
                    location.reload();
                },
                error: function(err) {
                    console.log(err);
                }
            });
        });
    });

    // アカウントメニューのトグル
    const accountMenuToggle = document.querySelector('.account-menu-toggle');
    const accountMenu = document.querySelector('.account-menu');
  
    if (accountMenuToggle && accountMenu) {
        accountMenuToggle.addEventListener('click', function(event) {
            event.preventDefault();
            accountMenuToggle.parentElement.classList.toggle('show');
        });
    
        document.addEventListener('click', function(event) {
            if (!accountMenuToggle.contains(event.target) && !accountMenu.contains(event.target)) {
                accountMenuToggle.parentElement.classList.remove('show');
            }
        });
    }

    // ドロップダウンメニューのトグル
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(event) {
            event.preventDefault();
            const menu = this.nextElementSibling;
            menu.classList.toggle('show');
        });
    });

    // ドキュメント全体のクリックイベントを監視し、メニュー外をクリックしたらメニューを閉じる
    document.addEventListener('click', function(event) {
        dropdowns.forEach(dropdown => {
            const menu = dropdown.nextElementSibling;
            if (menu && !dropdown.contains(event.target) && !menu.contains(event.target)) {
                menu.classList.remove('show');
            }
        });
    });
});
