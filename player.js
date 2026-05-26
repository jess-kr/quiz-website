function setPlayer(btn) {
        const id = btn.closest('li').dataset.accname;
        localStorage.setItem('chosenPlayer', id);
        window.location.href = 'game.html';
};


