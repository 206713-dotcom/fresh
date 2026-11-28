const originalPhoto = document.querySelector('.room-photo.is-current');
const additionalPhotos = [...document.querySelectorAll('.room-photo[data-src]')];
const rotationButton = document.querySelector('.room-rotation');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const slideDuration = 7000;

let photos = [originalPhoto];
let current = 0;
let paused = false;
let timer;
let loading;

async function loadPhotos() {
  const results = await Promise.allSettled(additionalPhotos.map(photo => {
    photo.src = photo.dataset.src;
    return photo.decode();
  }));
  photos = [originalPhoto, ...additionalPhotos.filter((_, index) => results[index].status === 'fulfilled')];
}

function updateRotation() {
  clearInterval(timer);
  rotationButton.hidden = reducedMotion.matches || photos.length < 2;
  rotationButton.textContent = paused ? 'Resume images' : 'Pause images';
  if (rotationButton.hidden || paused || document.hidden) return;

  timer = setInterval(() => {
    photos[current].classList.remove('is-current');
    current = (current + 1) % photos.length;
    photos[current].classList.add('is-current');
  }, slideDuration);
}

async function syncMotionPreference() {
  if (reducedMotion.matches) {
    photos[current].classList.remove('is-current');
    current = 0;
    originalPhoto.classList.add('is-current');
  } else {
    loading ??= loadPhotos();
    await loading;
  }
  updateRotation();
}

rotationButton.addEventListener('click', () => {
  paused = !paused;
  updateRotation();
});
document.addEventListener('visibilitychange', updateRotation);
reducedMotion.addEventListener('change', syncMotionPreference);
syncMotionPreference();
